"use client"
import React, { useState } from 'react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="fixed w-64 h-full bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="text-2xl font-bold text-blue-600">CivicConnect</div>
        </div>
        <nav className="mt-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full px-6 py-3 flex items-center ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={`w-full px-6 py-3 flex items-center ${activeTab === 'report' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Report Issue
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full px-6 py-3 flex items-center ${activeTab === 'history' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'overview' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-sm text-gray-500 mb-2">Total Reports</div>
                <div className="text-3xl font-bold text-gray-900">12</div>
                <div className="text-sm text-green-600 mt-2">+2 this month</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-sm text-gray-500 mb-2">Resolved Issues</div>
                <div className="text-3xl font-bold text-gray-900">8</div>
                <div className="text-sm text-blue-600 mt-2">66% resolution rate</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-sm text-gray-500 mb-2">In Progress</div>
                <div className="text-3xl font-bold text-gray-900">4</div>
                <div className="text-sm text-orange-600 mt-2">Avg 3 days to resolve</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <div className="font-medium">Pothole Report #123</div>
                    <div className="text-sm text-gray-500">Main Street, Downtown</div>
                  </div>
                  <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">Resolved</div>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <div className="font-medium">Streetlight #456</div>
                    <div className="text-sm text-gray-500">Park Avenue</div>
                  </div>
                  <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">In Progress</div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">Garbage Collection #789</div>
                    <div className="text-sm text-gray-500">Riverside Area</div>
                  </div>
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">Under Review</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Report an Issue</h1>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Select issue type</option>
                    <option>Road/Pothole</option>
                    <option>Streetlight</option>
                    <option>Garbage Collection</option>
                    <option>Public Safety</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter address or use current location"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Describe the issue in detail"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos (optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-gray-500">Drop files here or click to upload</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600" />
                  <label className="ml-2 text-sm text-gray-600">
                    Submit anonymously
                  </label>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Report History</h1>
            
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <input 
                    type="text"
                    placeholder="Search reports..."
                    className="p-2 border border-gray-300 rounded-lg w-64"
                  />
                  <select className="p-2 border border-gray-300 rounded-lg">
                    <option>All Status</option>
                    <option>Resolved</option>
                    <option>In Progress</option>
                    <option>Under Review</option>
                  </select>
                </div>
                
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-4">Report ID</th>
                      <th className="pb-4">Issue Type</th>
                      <th className="pb-4">Location</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4">#123</td>
                      <td>Pothole</td>
                      <td>Main Street</td>
                      <td>
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                          Resolved
                        </span>
                      </td>
                      <td>2025-02-01</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4">#456</td>
                      <td>Streetlight</td>
                      <td>Park Avenue</td>
                      <td>
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                          In Progress
                        </span>
                      </td>
                      <td>2025-02-05</td>
                    </tr>
                    <tr>
                      <td className="py-4">#789</td>
                      <td>Garbage Collection</td>
                      <td>Riverside Area</td>
                      <td>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                          Under Review
                        </span>
                      </td>
                      <td>2025-02-08</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;