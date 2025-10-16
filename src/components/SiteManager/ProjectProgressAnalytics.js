import React from 'react';
import { TrendingUp, Calendar, Clock, CheckCircle } from 'lucide-react';

const ProjectProgressAnalytics = ({ projects }) => {
  // Calculate analytics from projects data
  const calculateAnalytics = () => {
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        averageProgress: 0,
        overdueProjects: 0,
        upcomingDeadlines: 0
      };
    }

    const now = new Date();
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => 
      (p.progressStatus || p.status || '').toLowerCase().includes('progress')
    ).length;
    const completedProjects = projects.filter(p => 
      (p.progressStatus || p.status || '').toLowerCase() === 'completed'
    ).length;
    
    // Calculate average progress based on phases
    const projectsWithPhases = projects.filter(p => p.phases && p.phases.length > 0);
    const totalProgress = projectsWithPhases.reduce((sum, p) => {
      const completedPhases = p.phases.filter(phase => 
        phase.status === 'Completed' || phase.status === 'completed'
      ).length;
      return sum + (completedPhases / p.phases.length);
    }, 0);
    const averageProgress = projectsWithPhases.length > 0 
      ? Math.round((totalProgress / projectsWithPhases.length) * 100) 
      : 0;

    // Count overdue projects
    const overdueProjects = projects.filter(p => {
      if (!p.endDate) return false;
      const endDate = new Date(p.endDate);
      return endDate < now && (p.progressStatus || p.status || '').toLowerCase() !== 'completed';
    }).length;

    // Count upcoming deadlines (within 7 days)
    const upcomingDeadlines = projects.filter(p => {
      if (!p.endDate) return false;
      const endDate = new Date(p.endDate);
      const daysUntilDeadline = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return daysUntilDeadline <= 7 && daysUntilDeadline > 0 && (p.progressStatus || p.status || '').toLowerCase() !== 'completed';
    }).length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      averageProgress,
      overdueProjects,
      upcomingDeadlines
    };
  };

  const analytics = calculateAnalytics();

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    if (progress >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Project Progress Analytics</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{analytics.totalProjects}</div>
          <div className="text-sm text-blue-600 font-medium">Total Projects</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{analytics.activeProjects}</div>
          <div className="text-sm text-green-600 font-medium">Active</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{analytics.completedProjects}</div>
          <div className="text-sm text-purple-600 font-medium">Completed</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className={`text-lg font-bold ${getProgressColor(analytics.averageProgress)}`}>
            {analytics.averageProgress}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(analytics.averageProgress)}`}
            style={{ width: `${analytics.averageProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="space-y-3">
        {analytics.overdueProjects > 0 && (
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="font-medium text-red-800">
                {analytics.overdueProjects} Project{analytics.overdueProjects > 1 ? 's' : ''} Overdue
              </div>
              <div className="text-sm text-red-600">Action required</div>
            </div>
          </div>
        )}

        {analytics.upcomingDeadlines > 0 && (
          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <div className="font-medium text-yellow-800">
                {analytics.upcomingDeadlines} Deadline{analytics.upcomingDeadlines > 1 ? 's' : ''} This Week
              </div>
              <div className="text-sm text-yellow-600">Review and prioritize</div>
            </div>
          </div>
        )}

        {analytics.completedProjects > 0 && (
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-green-800">
                {analytics.completedProjects} Project{analytics.completedProjects > 1 ? 's' : ''} Completed
              </div>
              <div className="text-sm text-green-600">Great progress!</div>
            </div>
          </div>
        )}

        {analytics.overdueProjects === 0 && analytics.upcomingDeadlines === 0 && analytics.completedProjects === 0 && (
          <div className="text-center py-6 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No projects to analyze yet</p>
            <p className="text-sm">Create your first project to see analytics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectProgressAnalytics;
