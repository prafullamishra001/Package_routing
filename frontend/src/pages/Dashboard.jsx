import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Package, ArrowRight, Plus, Upload, Clock } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Route Parcel', icon: Plus, path: '/parcel-routing', color: 'blue' },
    { label: 'Batch Upload', icon: Upload, path: '/batch-upload', color: 'green' },
    { label: 'View History', icon: Clock, path: '/routing-history', color: 'purple' },
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your parcel routing operations</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const colors = colorClasses[action.color];
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group text-left"
                >
                  <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    Get started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to ParcelFlow</h2>
              <p className="text-gray-600 mb-4">
                Start routing parcels by using the quick actions above. You can route individual parcels, 
                upload multiple parcels in batch, or view your routing history.
              </p>
              <button
                onClick={() => navigate('/parcel-routing')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Start routing
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
