import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { FaSearch } from 'react-icons/fa';

// ---- Adjust this if your backend runs elsewhere ----
const API_BASE = import.meta?.env?.VITE_API_BASE ?? 'http://localhost:8080/api';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

// tiny debounce hook so we don't hammer the API while typing
function useDebounce(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

const statusOptionsUi = ['All', 'Available', 'In Use', 'Under Maintenance'];

const getStatusColor = (statusLabel) => {
  switch (statusLabel) {
    case 'Available':
      return 'bg-deep_green/10 text-deep_green';
    case 'In Use':
      return 'bg-web_yellow/10 text-web_yellow';
    case 'Under Maintenance':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-light_gray/40 text-slatebluegray';
  }
};

export default function EquipmentScheduling() {
  const navigate = useNavigate();

  // filters/sort/pagination
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 350);

  // UI status strings must be one of: All | Available | Under Maintenance | In Use
  const [filterStatus, setFilterStatus] = useState('All');

  const [currentPage, setCurrentPage] = useState(1); // UI is 1-based
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortBy, setSortBy] = useState('name'); // backend allows name | location | status | id | brand | model
  const [sortOrder, setSortOrder] = useState('asc');

  // data
  const [rows, setRows] = useState([]); // list of EquipmentListItemDTO
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // stats
  const [stats, setStats] = useState({ total: 0, available: 0, onASite: 0, underMaintenance: 0 });

  // loading & error
  const [loadingList, setLoadingList] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorList, setErrorList] = useState('');
  const [errorStats, setErrorStats] = useState('');

  // ---- fetch stats ----
  useEffect(() => {
    let abort = new AbortController();
    async function loadStats() {
      setLoadingStats(true);
      setErrorStats('');
      try {
        const res = await fetch(`${API_BASE}/equipment/stats`, { signal: abort.signal });
        if (!res.ok) throw new Error(`Stats fetch failed (${res.status})`);
        const data = await res.json();
        setStats(data); // { total, available, onASite, underMaintenance }
      } catch (e) {
        if (e.name !== 'AbortError') setErrorStats(e.message || 'Failed to load stats');
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
    return () => abort.abort();
  }, []);

  // ---- fetch list (depends on filters/sort/page) ----
  useEffect(() => {
    let abort = new AbortController();

    async function loadList() {
      setLoadingList(true);
      setErrorList('');

      const params = new URLSearchParams({
        search: debouncedSearch || '',
        status: filterStatus || 'All', // server accepts "All" | "Available" | "Under Maintenance" | "In Use"
        page: String(currentPage - 1), // backend is 0-based
        size: String(itemsPerPage),
        sortBy,
        sortDir: sortOrder,
      });

      try {
        const res = await fetch(`${API_BASE}/equipment/search?${params.toString()}`, {
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(`List fetch failed (${res.status})`);
        const data = await res.json();
        // PagedResponse<EquipmentListItemDTO> => { content, page, size, totalElements, totalPages, sortBy, sortDir }
        setRows(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages ?? 1);
        setTotalItems(data.totalElements ?? 0);
      } catch (e) {
        if (e.name !== 'AbortError') setErrorList(e.message || 'Failed to load equipment');
      } finally {
        setLoadingList(false);
      }
    }

    loadList();
    return () => abort.abort();
  }, [debouncedSearch, filterStatus, currentPage, itemsPerPage, sortBy, sortOrder]);

  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
  const showingFrom = useMemo(() => (totalItems === 0 ? 0 : startIndex + 1), [startIndex, totalItems]);
  const showingTo = useMemo(
    () => Math.min(startIndex + itemsPerPage, totalItems),
    [startIndex, itemsPerPage, totalItems]
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // UPDATED: Fixed navigation to include equipment ID
  const handleButtonClick = (item) => {
    if (item.buttonText === 'Schedule') {
      navigate(`/schedule-form/${item.id}`); // Pass equipment ID to the form
    } else if (item.buttonText === 'View Schedule') {
      navigate(`/view-schedule-page/${item.id}`);
    } else if (item.buttonText === 'View Details') {
      navigate(`/equipment-details/${item.id}`);
    }
  };

  // reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus, itemsPerPage]);

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Equipment Scheduling
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Schedule and manage equipment allocation across your construction sites
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Total Equipment</div>
              <div className="text-2xl font-bold text-main_dark">
                {loadingStats ? '—' : stats.total}
              </div>
              {errorStats && <div className="text-xs text-red-600 mt-1">{errorStats}</div>}
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Available</div>
              <div className="text-2xl font-bold text-green-600">
                {loadingStats ? '—' : stats.available}
              </div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">In Use</div>
              <div className="text-2xl font-bold text-orange-600">
                {loadingStats ? '—' : stats.onASite}
              </div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Under Maintenance</div>
              <div className="text-2xl font-bold text-red-600">
                {loadingStats ? '—' : stats.underMaintenance}
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Equipment
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search equipment by name, brand, model, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptionsUi.map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        filterStatus === status
                          ? 'bg-web_yellow text-main_dark shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page size (optional) */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rows</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              {loadingList
                ? 'Loading...'
                : `Showing ${showingFrom} to ${showingTo} of ${totalItems} equipment`}
            </p>
            {errorList && <p className="text-sm text-red-600">{errorList}</p>}
          </div>

          {/* Equipment Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_brown/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">ID</th>

                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Equipment Name
                        {sortBy === 'name' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>

                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortBy === 'status' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>

                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('location')}
                    >
                      <div className="flex items-center gap-2">
                        Location
                        {sortBy === 'location' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Utilization
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {loadingList ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        Loading equipment…
                      </td>
                    </tr>
                  ) : rows.length > 0 ? (
                    rows.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-main_dark">#{item.id}</td>

                        <td className="px-6 py-4">
                          <div className="font-semibold text-main_dark text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">
                            Last Maintenance: {item.lastMaintenance || 'N/A'}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.displayStatus || 'Unknown'
                            )}`}
                          >
                            {item.displayStatus || 'Unknown'}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">{item.location || 'N/A'}</td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-main_dark">
                            {item.utilization || 'N/A'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleButtonClick(item)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 shadow-sm hover:shadow-md ${
                              item.buttonColorClass ||
                              'bg-light_gray hover:bg-light_gray/80 text-main_dark'
                            }`}
                          >
                            {item.buttonText || 'View Details'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        <div className="text-6xl mb-4">🔧</div>
                        <h3 className="text-lg font-semibold text-main_dark mb-2">
                          No Equipment Found
                        </h3>
                        <p className="text-slatebluegray">
                          Try adjusting your search terms or filters.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {loadingList ? (
                <div className="p-8 text-center text-gray-500">Loading equipment…</div>
              ) : rows.length > 0 ? (
                rows.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-main_dark text-sm">#{item.id}</h3>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="font-semibold text-main_dark text-sm">{item.name}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{item.location || 'N/A'}</p>
                        <p className="text-xs text-gray-500">
                          Last Maintenance: {item.lastMaintenance || 'N/A'}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.displayStatus || 'Unknown'
                          )}`}
                        >
                          {item.displayStatus || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <p>
                        <span className="font-medium">Utilization:</span>{' '}
                        <span className="font-medium text-main_dark">
                          {item.utilization || 'N/A'}
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleButtonClick(item)}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-150 shadow-sm hover:shadow-md ${
                          item.buttonColorClass ||
                          'bg-light_gray hover:bg-light_gray/80 text-main_dark'
                        }`}
                      >
                        {item.buttonText || 'View Details'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🔧</div>
                  <h3 className="text-lg font-semibold text-main_dark mb-2">No Equipment Found</h3>
                  <p className="text-slatebluegray">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              {loadingList
                ? 'Loading…'
                : `Showing ${showingFrom} to ${showingTo} of ${totalItems} results`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loadingList}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  disabled={loadingList}
                  className={`px-3 py-1 text-sm rounded font-medium transition-colors ${
                    currentPage === n
                      ? 'bg-web_yellow text-main_dark'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || loadingList}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}