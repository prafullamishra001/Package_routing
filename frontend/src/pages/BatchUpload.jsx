import React, { useState } from 'react';
import { parcelAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { Upload, FileText, AlertCircle, CheckCircle, XCircle, Loader2, Sparkles, FileJson, ArrowRight, Shield } from 'lucide-react';

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

  const clearInput = () => {
    setJsonInput('');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Batch Upload</h1>
            <p className="text-gray-600 mt-2">Upload multiple parcels in JSON format for bulk routing</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileJson className="w-5 h-5" />
                  JSON Input
                </h2>
                <button
                  onClick={loadExample}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  Load Example
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parcels Data (JSON)</label>
                  <div className="relative">
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm bg-slate-50"
                      placeholder='[
  {
    "weight": 0.5,
    "value": 500,
    "destinationCountry": "Germany"
  }
]'
                      rows={12}
                      required
                    />
                    {jsonInput && (
                      <button
                        type="button"
                        onClick={clearInput}
                        className="absolute top-3 right-3 p-1.5 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <XCircle className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Format: Array of objects with weight, value, and destinationCountry
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !jsonInput}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload & Process
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Result Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload Summary
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {!result && !error && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Upload JSON data to see processing summary</p>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{result.processed}</p>
                      <p className="text-xs text-gray-600 mt-1">Processed</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-green-700">{result.successful}</p>
                      <p className="text-xs text-green-600 mt-1">Successful</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-red-700">{result.failed}</p>
                      <p className="text-xs text-red-600 mt-1">Failed</p>
                    </div>
                  </div>

                  {/* Details */}
                  {result.details && result.details.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Processing Details</p>
                      <div className="max-h-80 overflow-y-auto space-y-2">
                        {result.details.map((detail, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border flex items-center justify-between ${
                              detail.status === 'success'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {detail.status === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                              )}
                              <div>
                                <p className="font-medium text-sm text-gray-900">Parcel #{index + 1}</p>
                                {detail.status === 'success' && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-gray-600">{detail.department}</p>
                                    {detail.insuranceRequired && (
                                      <div className="flex items-center gap-1 text-xs text-red-600">
                                        <Shield className="w-3 h-3" />
                                        <span>Insurance Required</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {detail.status === 'failed' && (
                                  <p className="text-xs text-red-600">{detail.error}</p>
                                )}
                              </div>
                            </div>
                            <ArrowRight className={`w-4 h-4 ${detail.status === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {result.failed === 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-700 font-medium">All parcels processed successfully!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchUpload;
