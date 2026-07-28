import React, { useState } from 'react';
import { parcelAPI } from '../utils/api';
import Navbar from '../components/Navbar';

const BatchUpload = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const parsed = JSON.parse(jsonInput);
      const response = await parcelAPI.upload({ parcels: parsed });
      setResult(response.data.summary);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format');
      } else {
        setError(err.response?.data?.message || 'Upload failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    const example = [
      { weight: 0.5, value: 500, destinationCountry: 'Germany' },
      { weight: 5, value: 1500, destinationCountry: 'France' },
      { weight: 15, value: 800, destinationCountry: 'Switzerland' },
    ];
    setJsonInput(JSON.stringify(example, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Batch Upload</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <button
            onClick={loadExample}
            className="mb-4 text-blue-600 hover:underline"
          >
            Load Example JSON
          </button>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parcels (JSON)</label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 font-mono text-sm"
                placeholder='[{"weight": 0.5, "value": 500, "destinationCountry": "Germany"}]'
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Upload & Process'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
        )}

        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Upload Summary</h2>
            <div className="space-y-2">
              <p><strong>Processed:</strong> {result.processed}</p>
              <p><strong>Successful:</strong> {result.successful}</p>
              <p><strong>Failed:</strong> {result.failed}</p>
              {result.details.length > 0 && (
                <div className="mt-4">
                  <strong>Details:</strong>
                  <div className="mt-2 max-h-64 overflow-y-auto">
                    {result.details.map((detail, index) => (
                      <div key={index} className={`p-2 mb-1 rounded ${detail.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <span className="font-medium">#{detail.index + 1}:</span> {detail.status}
                        {detail.status === 'success' && <span className="ml-2">→ {detail.department}</span>}
                        {detail.status === 'failed' && <span className="ml-2 text-red-700">Error: {detail.error}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default BatchUpload;
