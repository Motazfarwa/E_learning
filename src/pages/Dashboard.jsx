import React from 'react';
import { useNavigate } from 'react-router-dom';

// Example Card Component
const Card = ({ title, count, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between w-full md:w-64">
    <div>
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-3xl font-bold text-blue-600">{count}</p>
    </div>
    <div className="bg-blue-100 p-4 rounded-full">
      {icon}
    </div>
  </div>
);


const Dashboard = () => {
  const navigate= useNavigate();
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-blue-800 text-white w-64 p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <nav>
          <ul>
            <li className="mb-4 hover:bg-blue-700 p-2 rounded">
              <a href="#">Dashboard</a>
            </li>
            <li className="mb-4 hover:bg-blue-700 p-2 rounded">
              <a href="#">Users</a>
            </li>
            <li className="mb-4 hover:bg-blue-700 p-2 rounded">
              <a href="#">Settings</a>
            </li>
            <li className="mb-4 hover:bg-blue-700 p-2 rounded">
              <a href="#">Analytics</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-700">Welcome Back, Admin</h2>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={()=>navigate('/login')}>Logout</button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card title="Total Users" count={450} icon={<i className="fas fa-users text-4xl text-blue-600"></i>} />
          <Card title="Active Subscriptions" count={120} icon={<i className="fas fa-cogs text-4xl text-blue-600"></i>} />
          <Card title="Support Tickets" count={32} icon={<i className="fas fa-ticket-alt text-4xl text-blue-600"></i>} />
        </div>

        {/* Main Content: Charts or Other Components */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Site Analytics</h3>
          {/* Chart Placeholder */}
          <div className="h-64 bg-gray-300 rounded-lg">[Chart Placeholder]</div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">User Data</h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">John Doe</td>
                <td className="px-4 py-2">Admin</td>
                <td className="px-4 py-2 text-green-600">Active</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Jane Smith</td>
                <td className="px-4 py-2">User</td>
                <td className="px-4 py-2 text-yellow-600">Pending</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
              {/* More rows can be added here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
