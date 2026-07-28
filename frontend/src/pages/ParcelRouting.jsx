import React, { useState } from 'react';
import { parcelAPI } from '../utils/api';
import Navbar from '../components/Navbar';

const ParcelRouting = () => {
  const [formData, setFormData] = useState({ weight: '', value: '', destinationCountry: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await parcelAPI.route({
        weight: parseFloat(formData.weight),
        value: parseFloat(formData.value),
        destinationCountry: formData.destinationCountry,
      });
      setResult(response.data.parcel);
    } catch (err) {
      setError(err.response?.data?.message || 'Routing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Parcel Routing</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination Country</label>
              <input
                type="text"
                value={formData.destinationCountry}
                onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Routing...' : 'Route Parcel'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
        )}

        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Routing Result</h2>
            <div className="space-y-2">
              <p><strong>Department:</strong> {result.department}</p>
              <p><strong>Insurance Required:</strong> {result.insuranceRequired ? 'Yes' : 'No'}</p>
              <div>
                <strong>Reason:</strong>
                <ul className="list-disc list-inside mt-1">
                  {result.routingReason.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ParcelRouting;
