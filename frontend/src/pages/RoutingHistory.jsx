import React, { useState, useEffect } from 'react';
import { parcelAPI } from '../utils/api';
import Navbar from '../components/Navbar';

const RoutingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await parcelAPI.getHistory();
      setHistory(response.data.history);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Routing History</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
        )}

        {history.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">No routing history available.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value (€)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(parcel.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.weight}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{parcel.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.destinationCountry}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parcel.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {parcel.insuranceRequired ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default RoutingHistory;
