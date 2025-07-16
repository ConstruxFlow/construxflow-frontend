import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const BOQPDFReader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [boqData, setBOQData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Function to extract text from PDF
  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      
      let extractedText = '';
      const pages = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        pages.push({
          pageNumber: i,
          text: pageText
        });
        extractedText += pageText + '\n';
      }
      
      return {
        totalPages: pdf.numPages,
        pages: pages,
        fullText: extractedText
      };
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  };

  // COMPLETELY FIXED parsing function
  const parseBOQData = (textData) => {
    const phases = [];
    const items = [];
    
    // Split by double spaces and filter out empty strings
    const tokens = textData.fullText.split(/\s+/).filter(token => token.trim());
    
    let currentPhase = null;
    let currentPhaseItems = [];
    let i = 0;
    
    while (i < tokens.length) {
      // Check for phase header
      if (tokens[i] === 'PHASE' && tokens[i + 1] && /^\d+$/.test(tokens[i + 1])) {
        // Save previous phase if exists
        if (currentPhase && currentPhaseItems.length > 0) {
          phases.push({
            id: phases.length + 1,
            name: currentPhase,
            items: currentPhaseItems,
            subtotal: currentPhaseItems.reduce((sum, item) => sum + item.total, 0)
          });
        }
        
        // Extract phase name
        let phaseName = '';
        let j = i;
        while (j < tokens.length && !(/^\d+\.\d+$/.test(tokens[j]))) {
          phaseName += tokens[j] + ' ';
          j++;
        }
        
        currentPhase = phaseName.trim();
        currentPhaseItems = [];
        i = j;
        continue;
      }
      
      // Check for item code pattern (e.g., "1.1", "2.1", etc.)
      if (/^\d+\.\d+$/.test(tokens[i])) {
        const itemCode = tokens[i];
        let materialName = '';
        let materialType = '';
        let unit = '';
        let quantity = 0;
        let rate = 0;
        let total = 0;
        
        // Extract material name and type
        let k = i + 1;
        let foundUnit = false;
        let unitIndex = -1;
        
        // Find the unit (m², m³, Item, etc.)
        while (k < tokens.length && !foundUnit) {
          if (/^(m²|m³|Item|kg|ton|No\.)$/.test(tokens[k])) {
            unit = tokens[k];
            unitIndex = k;
            foundUnit = true;
          }
          k++;
        }
        
        if (foundUnit && unitIndex > i + 1) {
          // Split material name and type
          const materialTokens = tokens.slice(i + 1, unitIndex);
          const midPoint = Math.floor(materialTokens.length / 2);
          
          materialName = materialTokens.slice(0, midPoint).join(' ');
          materialType = materialTokens.slice(midPoint).join(' ');
          
          // Extract quantity, rate, and total
          if (unitIndex + 3 < tokens.length) {
            quantity = parseInt(tokens[unitIndex + 1].replace(/,/g, ''));
            rate = parseInt(tokens[unitIndex + 2].replace(/,/g, ''));
            total = parseInt(tokens[unitIndex + 3].replace(/,/g, ''));
            
            const item = {
              id: items.length + 1,
              itemCode: itemCode,
              materialName: materialName,
              materialType: materialType,
              unit: unit,
              quantity: quantity,
              rate: rate,
              total: total,
              phase: currentPhase || 'Unknown',
              lineNumber: phases.length + 1
            };
            
            items.push(item);
            currentPhaseItems.push(item);
            
            i = unitIndex + 4;
            continue;
          }
        }
      }
      
      i++;
    }
    
    // Add the last phase
    if (currentPhase && currentPhaseItems.length > 0) {
      phases.push({
        id: phases.length + 1,
        name: currentPhase,
        items: currentPhaseItems,
        subtotal: currentPhaseItems.reduce((sum, item) => sum + item.total, 0)
      });
    }
    
    return { items, phases };
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }
    
    setLoading(true);
    setPdfFile(file);
    
    try {
      const textData = await extractTextFromPDF(file);
      const { items, phases } = parseBOQData(textData);
      
      const boqObject = {
        metadata: {
          filename: file.name,
          fileSize: file.size,
          lastModified: new Date(file.lastModified).toISOString(),
          processedAt: new Date().toISOString(),
          totalPages: textData.totalPages,
          projectTitle: "Commercial Office Building"
        },
        content: {
          pages: textData.pages,
          fullText: textData.fullText
        },
        phases: phases,
        boqItems: items,
        summary: {
          totalPhases: phases.length,
          totalItems: items.length,
          totalAmount: items.reduce((sum, item) => sum + item.total, 0),
          totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
          currency: "LKR"
        }
      };
      
      setBOQData(boqObject);
      setNumPages(textData.totalPages);
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF file');
    } finally {
      setLoading(false);
    }
  };

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Navigation functions
  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  // Export BOQ data as JSON
  const exportBOQData = () => {
    if (!boqData) return;
    
    const dataStr = JSON.stringify(boqData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${boqData.metadata.filename}_parsed_data.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Export as CSV
  const exportAsCSV = () => {
    if (!boqData) return;
    
    const csvHeader = 'Phase,Item Code,Material Name,Material Type,Unit,Quantity,Rate (LKR),Total (LKR)\n';
    const csvRows = boqData.boqItems.map(item => 
      `"${item.phase}","${item.itemCode}","${item.materialName}","${item.materialType}","${item.unit}",${item.quantity},${item.rate},${item.total}`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${boqData.metadata.filename}_data.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Export as Excel-compatible format
  const exportAsExcel = () => {
    if (!boqData) return;
    
    let excelContent = 'Phase\tItem Code\tMaterial Name\tMaterial Type\tUnit\tQuantity\tRate (LKR)\tTotal (LKR)\n';
    
    boqData.phases.forEach(phase => {
      phase.items.forEach(item => {
        excelContent += `${phase.name}\t${item.itemCode}\t${item.materialName}\t${item.materialType}\t${item.unit}\t${item.quantity}\t${item.rate}\t${item.total}\n`;
      });
      excelContent += `\t\t\t\t\tPhase Subtotal:\t\t${phase.subtotal}\n`;
    });
    
    excelContent += `\t\t\t\t\tGRAND TOTAL:\t\t${boqData.summary.totalAmount}\n`;
    
    const blob = new Blob([excelContent], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${boqData.metadata.filename}_data.xls`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
          🏗️ BOQ PDF Parser - Construction Project Analysis
        </h1>
        
        {/* File Upload Section */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: '0', color: '#555' }}>📁 Upload BOQ PDF</h3>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            style={{
              padding: '15px',
              border: '2px dashed #007bff',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '500px',
              backgroundColor: '#f8f9ff',
              fontSize: '16px'
            }}
          />
          <p style={{ color: '#666', marginTop: '10px', fontSize: '14px' }}>
            Select a PDF file containing your Bill of Quantities (BOQ) data
          </p>
        </div>

        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '18px', color: '#555' }}>Processing BOQ PDF...</p>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '20px auto'
            }}></div>
            <p style={{ color: '#888' }}>Extracting and parsing construction data...</p>
          </div>
        )}

        {/* Main Content */}
        {pdfFile && !loading && (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* PDF Viewer */}
            <div style={{ 
              flex: '1', 
              minWidth: '400px', 
              backgroundColor: 'white',
              borderRadius: '10px', 
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: '0', color: '#555' }}>📄 PDF Document</h3>
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div style={{ textAlign: 'center', padding: '20px' }}>Loading PDF...</div>}
                error={<div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error loading PDF</div>}
              >
                <Page
                  pageNumber={pageNumber}
                  width={Math.min(400, window.innerWidth - 100)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
              
              {numPages && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button 
                    onClick={goToPrevPage} 
                    disabled={pageNumber <= 1}
                    style={{ 
                      padding: '10px 20px', 
                      marginRight: '10px', 
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      backgroundColor: pageNumber <= 1 ? '#f5f5f5' : '#fff',
                      cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← Previous
                  </button>
                  <span style={{ margin: '0 15px', fontWeight: 'bold', fontSize: '16px' }}>
                    Page {pageNumber} of {numPages}
                  </span>
                  <button 
                    onClick={goToNextPage} 
                    disabled={pageNumber >= numPages}
                    style={{ 
                      padding: '10px 20px', 
                      marginLeft: '10px', 
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      backgroundColor: pageNumber >= numPages ? '#f5f5f5' : '#fff',
                      cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            {/* BOQ Data Display */}
            <div style={{ 
              flex: '1', 
              minWidth: '600px', 
              backgroundColor: 'white',
              borderRadius: '10px', 
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: '0', color: '#555' }}>📊 Extracted BOQ Data</h3>
              {boqData && (
                <div>
                  {/* Export Buttons */}
                  <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={exportBOQData}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      📥 Export JSON
                    </button>
                    <button
                      onClick={exportAsCSV}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      📊 Export CSV
                    </button>
                    <button
                      onClick={exportAsExcel}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#fd7e14',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      📈 Export Excel
                    </button>
                  </div>
                  
                  {/* Summary Cards */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '15px',
                    marginBottom: '25px'
                  }}>
                    <div style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '15px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                        {boqData.summary.totalPhases}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Total Phases</div>
                    </div>
                    <div style={{ 
                      backgroundColor: '#e8f5e8', 
                      padding: '15px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
                        {boqData.summary.totalItems}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Total Items</div>
                    </div>
                    <div style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '15px', 
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f57c00' }}>
                        {boqData.summary.totalAmount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Total Amount (LKR)</div>
                    </div>
                  </div>

                  {/* Phase-wise Breakdown */}
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ color: '#333', marginBottom: '15px' }}>🏗️ Phase-wise Breakdown</h4>
                    {boqData.phases.map((phase, index) => (
                      <div key={index} style={{ 
                        border: '1px solid #e0e0e0', 
                        borderRadius: '8px', 
                        marginBottom: '15px',
                        overflow: 'hidden',
                        backgroundColor: '#fafafa'
                      }}>
                        <div style={{ 
                          backgroundColor: '#f5f5f5', 
                          padding: '15px', 
                          fontWeight: 'bold',
                          borderBottom: '1px solid #e0e0e0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ color: '#333' }}>{phase.name}</span>
                          <span style={{ 
                            color: '#d32f2f', 
                            backgroundColor: '#ffebee',
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontSize: '14px'
                          }}>
                            {phase.subtotal?.toLocaleString() || 'N/A'} LKR
                          </span>
                        </div>
                        <div style={{ padding: '15px' }}>
                          {phase.items.map((item, itemIndex) => (
                            <div key={itemIndex} style={{ 
                              display: 'grid', 
                              gridTemplateColumns: '60px 2fr 1fr 80px 100px 120px', 
                              gap: '15px', 
                              padding: '10px 0',
                              borderBottom: itemIndex < phase.items.length - 1 ? '1px solid #eee' : 'none',
                              alignItems: 'center'
                            }}>
                              <div style={{ fontWeight: 'bold', color: '#1976d2' }}>{item.itemCode}</div>
                              <div style={{ fontSize: '14px' }}>
                                <div style={{ fontWeight: '500' }}>{item.materialName}</div>
                                <div style={{ color: '#666', fontSize: '12px' }}>{item.materialType}</div>
                              </div>
                              <div style={{ fontSize: '14px', color: '#666' }}>{item.quantity} {item.unit}</div>
                              <div style={{ fontSize: '14px', textAlign: 'right' }}>{item.rate.toLocaleString()}</div>
                              <div style={{ fontSize: '14px', textAlign: 'right', fontWeight: 'bold', color: '#d32f2f' }}>
                                {item.total.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Items Table */}
                  <div style={{ marginTop: '25px' }}>
                    <h4 style={{ color: '#333', marginBottom: '15px' }}>📝 Complete Items List</h4>
                    <div style={{ 
                      maxHeight: '500px', 
                      overflowY: 'auto',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px'
                    }}>
                      <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse', 
                        fontSize: '13px'
                      }}>
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 1 }}>
                          <tr>
                            <th style={{ border: '1px solid #dee2e6', padding: '12px 8px', textAlign: 'left' }}>Code</th>
                            <th style={{ border: '1px solid #dee2e6', padding: '12px 8px', textAlign: 'left' }}>Material</th>
                            <th style={{ border: '1px solid #dee2e6', padding: '12px 8px', textAlign: 'left' }}>Type</th>
                            <th style={{ border: '1px solid #dee2e6', padding: '12px 8px', textAlign: 'right' }}>Qty</th>
                            <th style={{ border: '1px solid #dee2e6', padding: '12px 8px', textAlign: 'right' }}>Rate</th>
                            <th style={{ border: '1px solid #dee2e6', padding: '12px 8px', textAlign: 'right' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {boqData.boqItems.map((item, index) => (
                            <tr key={index} style={{ 
                              backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                              '&:hover': { backgroundColor: '#e3f2fd' }
                            }}>
                              <td style={{ border: '1px solid #dee2e6', padding: '10px 8px', fontWeight: 'bold', color: '#1976d2' }}>
                                {item.itemCode}
                              </td>
                              <td style={{ border: '1px solid #dee2e6', padding: '10px 8px' }}>
                                {item.materialName}
                              </td>
                              <td style={{ border: '1px solid #dee2e6', padding: '10px 8px', color: '#666' }}>
                                {item.materialType}
                              </td>
                              <td style={{ border: '1px solid #dee2e6', padding: '10px 8px', textAlign: 'right' }}>
                                {item.quantity} {item.unit}
                              </td>
                              <td style={{ border: '1px solid #dee2e6', padding: '10px 8px', textAlign: 'right' }}>
                                {item.rate.toLocaleString()}
                              </td>
                              <td style={{ border: '1px solid #dee2e6', padding: '10px 8px', textAlign: 'right', fontWeight: 'bold', color: '#d32f2f' }}>
                                {item.total.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Raw Object Data for Development */}
        {boqData && (
          <div style={{ 
            marginTop: '30px',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: '0', color: '#555' }}>🔍 Raw Object Data (Development)</h3>
            <pre style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              maxHeight: '400px',
              overflow: 'auto',
              fontSize: '11px',
              border: '1px solid #dee2e6',
              lineHeight: '1.4'
            }}>
              {JSON.stringify(boqData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        tr:hover {
          background-color: #e3f2fd !important;
        }
      `}</style>
    </div>
  );
};

export default BOQPDFReader;
