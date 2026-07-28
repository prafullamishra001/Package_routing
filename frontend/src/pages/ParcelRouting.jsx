import React, { useState } from 'react';
import { parcelAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { Package, Scale, DollarSign, MapPin, AlertCircle, CheckCircle, Shield, Loader2, Building2 } from 'lucide-react';

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

  const getDepartmentColor = (department) => {
    if (department.includes('Mail')) return 'blue';
    if (department.includes('Regular')) return 'green';
    if (department.includes('Heavy')) return 'orange';
    return 'gray';
  };

  const departmentColors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Route Parcel</h1>
            <p className="text-gray-600 mt-2">Enter parcel details to determine the appropriate routing department</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Parcel Details
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter the weight in kilograms</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value (€)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter the declared value in euros</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination Country</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.destinationCountry}
                      onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Germany"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter the destination country name</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Routing...
                    </>
                  ) : (
                    'Route Parcel'
                  )}
                </button>
              </form>
            </div>

            {/* Result Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Routing Result
              </h2>

              {!result ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Enter parcel details to see routing result</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Department Badge */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Assigned Department</p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${departmentColors[getDepartmentColor(result.department)].bg} ${departmentColors[getDepartmentColor(result.department)].border}`}>
                      <Building2 className={`w-5 h-5 ${departmentColors[getDepartmentColor(result.department)].text}`} />
                      <span className={`font-semibold ${departmentColors[getDepartmentColor(result.department)].text}`}>
                        {result.department}
                      </span>
                    </div>
                  </div>

                  {/* Insurance Badge */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Insurance Status</p>
                    {result.insuranceRequired ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200">
                        <Shield className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-700">Insurance Required</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-700">No Insurance Required</span>
                      </div>
                    )}
                  </div>

                  {/* Routing Reasons */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Routing Decision</p>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      {result.routingReason.map((reason, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Parcel Summary */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600 mb-3">Parcel Summary</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Weight</p>
                        <p className="font-semibold text-gray-900">{result.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Value</p>
                        <p className="font-semibold text-gray-900">€{result.value}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Destination</p>
                        <p className="font-semibold text-gray-900">{result.destinationCountry}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelRouting;
