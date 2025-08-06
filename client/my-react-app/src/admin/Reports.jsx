import { useState } from 'react';

export default function AdminReports() {
  const [reportType, setReportType] = useState('volunteer-history');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch(`/api/reports/${reportType}?format=${format}`, {
        method: 'GET',
      });
      if (!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}. Failed to generate report.`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      const filename =
        reportType === 'volunteer-history'
          ? `volunteer_report.${format}`
          : `event_report.${format}`;

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error.message);
      setError(error.message)
    } finally {
      setIsGenerating(false);
    }
  };

  if(error) return <div>Error: {error}</div>;

  return (
    <div className="py-12 px-4">
      <div className=" mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">Generate Reports</h2>
          <p className="text-blue-100 text-center mt-2">Select options below to download your report</p>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Report Type:</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:cursor-pointer transition">
                <option value="volunteer-history">Volunteer Participation History</option>
                <option value="event-summary">Event Summary with Assignments</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {reportType === 'volunteer-history' 
                  ? "Shows complete history of volunteer participation" 
                  : "Summarizes event details and volunteer assignments"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Format:</label>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setFormat('pdf')} className={`hover:cursor-pointer py-2 px-4 rounded-lg border ${format === 'pdf' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <div className="space-x-2">
                    <span>PDF</span>
                  </div>
                </button>
                <button onClick={() => setFormat('csv')} className={`hover:cursor-pointer py-2 px-4 rounded-lg border ${format === 'csv' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <div className="space-x-2">
                    <span>CSV</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button onClick={handleDownload} disabled={isGenerating}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:cursor-pointer transition ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}