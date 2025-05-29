import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaBars, FaUsers, FaChartBar, FaFileAlt, FaMoneyBillWave, FaUserShield, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Card, Statistic, Row, Col, Input, Badge } from 'antd';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Base API URL
const API_BASE_URL = 'http://localhost:4000/api';

// Modern color palette
const colors = {
  primary: '#6a11cb',
  primaryLight: '#805ad5',
  primaryDark: '#553c9a',
  secondary: '#8338ec',
  accent: '#764ba2',
  background: '#f8f9fa',
  cardBg: '#ffffff',
  success: '#38b2ac',
  error: '#e53e3e',
  warning: '#dd6b20',
  info: '#3182ce',
  text: {
    primary: '#1a202c',
    secondary: '#4a5568',
    light: '#a0aec0',
  },
  chart: {
    primary: '#6a11cb',
    secondary: '#8338ec',
    tertiary: '#764ba2',
    quaternary: '#9f7aea',
    gradient: ['#764ba2', '#667eea'],
  },
};

// CoursesTable Component
const CoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/courses`)
      .then((response) => {
        setCourses(response.data);
        setFilteredCourses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading courses:', error);
        setError('Error loading courses');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`${API_BASE_URL}/courses/${id}`);
        setCourses(courses.filter((course) => course._id !== id));
        setFilteredCourses(filteredCourses.filter((course) => course._id !== id));
      } catch (err) {
        console.error('Error deleting course:', err);
        setError('Error deleting course');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-purple-200 mb-4"></div>
        <p className="text-purple-600 font-medium">Loading courses...</p>
      </div>
    </div>
  );

  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Courses List</h2>
        <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md">
          <FaPlus className="mr-2" /> Add Course
        </button>
      </div>
      <div className="overflow-hidden bg-white rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{course.nom}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{course.description.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge count={course.file.length} className="bg-purple-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge count={course.comments.length} className="bg-blue-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// CourseStatistics Component
const CourseStatistics = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    fileTypeDistribution: [],
    commentsByCourse: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/courses/stats`)
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading course statistics:', error);
        setError('Error loading course statistics');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-purple-200 mb-4"></div>
        <p className="text-purple-600 font-medium">Loading statistics...</p>
      </div>
    </div>
  );

  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>;

  const fileTypeDoughnutData = {
    labels: stats.fileTypeDistribution.map((type) => type._id),
    datasets: [
      {
        data: stats.fileTypeDistribution.map((type) => type.count),
        backgroundColor: [colors.chart.primary, colors.chart.secondary, colors.chart.tertiary],
        hoverBackgroundColor: [colors.chart.quaternary, '#9333ea', '#7e22ce'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 12, family: "'Poppins', sans-serif" }, color: colors.text.secondary }
      },
      tooltip: {
        backgroundColor: colors.primaryDark,
        titleFont: { size: 14, family: "'Poppins', sans-serif" },
        bodyFont: { size: 12, family: "'Poppins', sans-serif" }
      }
    },
    maintainAspectRatio: false,
    animation: { animateScale: true, animateRotate: true }
  };

  const commentsBarData = {
    labels: stats.commentsByCourse.map((course) => course.nom),
    datasets: [
      {
        label: 'Number of Comments',
        data: stats.commentsByCourse.map((course) => course.commentCount),
        backgroundColor: colors.chart.primary,
        borderColor: colors.chart.secondary,
        borderWidth: 1,
        borderRadius: 8,
        maxBarThickness: 40
      }
    ]
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: colors.text.secondary }
      },
      x: {
        grid: { display: false },
        ticks: { color: colors.text.secondary }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: colors.primaryDark,
        titleFont: { size: 14, family: "'Poppins', sans-serif" },
        bodyFont: { size: 12, family: "'Poppins', sans-serif" }
      }
    },
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeOutQuart' }
  };

return (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-800 mb-6">Course Statistics</h2>
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card
          className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          style={{ borderRadius: '1rem', border: 'none' }}
          bodyStyle={{ padding: '1.5rem' }}
        >
          <div className="flex items-center justify-center flex-col">
            <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
              <FaFileAlt className="text-2xl text-purple-600" />
            </div>
            <Statistic
              title={<span className="text-gray-500">Total Courses</span>}
              value={stats?.totalCourses ?? 0}
              valueStyle={{ color: colors.primary, fontSize: '2.5rem', fontWeight: 'bold' }}
              className="py-2"
            />
          </div>
        </Card>
      </Col>

      <Col span={12}>
        <Card
          title={<span className="text-gray-700 font-medium">File Type Distribution</span>}
          className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          style={{ borderRadius: '1rem', border: 'none' }}
          headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '1rem 1.5rem' }}
          bodyStyle={{ padding: '1.5rem' }}
        >
          <div style={{ height: '300px', padding: '10px' }}>
            {fileTypeDoughnutData ? (
              <Doughnut data={fileTypeDoughnutData} options={doughnutOptions} />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </Card>
      </Col>

      <Col span={24}>
        <Card
          title={<span className="text-gray-700 font-medium">Comments per Course</span>}
          className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          style={{ borderRadius: '1rem', border: 'none' }}
          headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '1rem 1.5rem' }}
          bodyStyle={{ padding: '1.5rem' }}
        >
          <div style={{ height: '300px', padding: '10px' }}>
            {commentsBarData ? (
              <Bar data={commentsBarData} options={barOptions} />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  </div>
);

};

// TransactionsTable Component
const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    axios.get("http://localhost:4000/api/payments")
      .then((response) => {
        console.log('Payments API response:', response);
        // Check if data is in the expected format
        const paymentsData = Array.isArray(response.data) ? response.data : 
                            (response.data.payments || []);
        setTransactions(paymentsData);
        setFilteredTransactions(paymentsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading transactions:', error);
        setError('Error loading transactions: ' + (error.response?.data?.message || error.message));
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchEmail.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter((transaction) =>
          transaction.customerEmail.toLowerCase().includes(searchEmail.toLowerCase())
        )
      );
    }
  }, [searchEmail, transactions]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-purple-200 mb-4"></div>
        <p className="text-purple-600 font-medium">Loading transactions...</p>
      </div>
    </div>
  );

  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Transactions</h2>
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by client email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-colors shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div className="overflow-hidden bg-white rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.paymentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.amount.toFixed(2)} {transaction.currency.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.customerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{transaction.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Statistics Component
const Statistics = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    apprenants: 0,
    instructeurs: 0,
    experts: 0,
  });
  const [paymentStats, setPaymentStats] = useState({
    totalAmount: 0,
    totalCount: 0,
    averageAmount: 0,
    statusDistribution: {},
    monthlyData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchUserStats = axios.get(`${API_BASE_URL}/users`);
    const fetchPaymentStats = axios.get(`${API_BASE_URL}/payments/stats`);

    Promise.all([fetchUserStats, fetchPaymentStats])
      .then(([userResponse, paymentResponse]) => {
        console.log('User stats response:', userResponse.data);
        console.log('Payment stats response:', paymentResponse.data);
        
        const users = userResponse.data;
        const totalUsers = users.length;
        const apprenants = users.filter((user) => user.role === 'APPRENANT').length;
        const instructeurs = users.filter((user) => user.role === 'INSTRUCTEUR').length;
        const experts = users.filter((user) => user.role === 'EXPERT').length;

        setUserStats({
          totalUsers,
          apprenants,
          instructeurs,
          experts,
        });

        // Ensure payment stats has the expected structure
          const payStats = paymentResponse.data || {};
           const stats = payStats.stats || {};
        console.log('payStats', payStats);
          setPaymentStats({
      totalAmount: Number(stats.totalAmount),
      totalCount: Number(stats.totalCount),
      averageAmount: Number(stats.averageAmount),
      statusDistribution: stats.statusDistribution || {},
      monthlyData: stats.monthlyData || [],
    });
 


        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading statistics:', error);
        setError('Error loading statistics');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-purple-200 mb-4"></div>
        <p className="text-purple-600 font-medium">Loading statistics...</p>
      </div>
    </div>
  );

  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>;

  const userDoughnutData = {
    labels: ['Apprenants', 'Instructeurs', 'Experts'],
    datasets: [
      {
        data: [userStats.apprenants, userStats.instructeurs, userStats.experts],
        backgroundColor: [colors.chart.primary, colors.chart.secondary, colors.chart.tertiary],
        hoverBackgroundColor: [colors.primaryLight, colors.secondary, colors.accent],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12, family: "'Poppins', sans-serif" },
          color: colors.text.secondary
        },
      },
      tooltip: {
        backgroundColor: colors.primaryDark,
        titleFont: { size: 14, family: "'Poppins', sans-serif" },
        bodyFont: { size: 12, family: "'Poppins', sans-serif" },
      },
    },
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const userBarData = {
    labels: ['Apprenants', 'Instructeurs', 'Experts'],
    datasets: [
      {
        label: 'Number of Users by Role',
        data: [userStats.apprenants, userStats.instructeurs, userStats.experts],
        backgroundColor: [colors.primaryLight, colors.primary, colors.primaryDark],
        borderColor: [colors.primaryLight, colors.primary, colors.primaryDark],
        borderWidth: 1,
        borderRadius: 8,
        maxBarThickness: 40
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: colors.text.secondary }
      },
      x: {
        grid: { display: false },
        ticks: { color: colors.text.secondary }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: colors.primaryDark,
        titleFont: { size: 14, family: "'Poppins', sans-serif" },
        bodyFont: { size: 12, family: "'Poppins', sans-serif" },
      },
    },
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeOutQuart' },
  };

const paymentDoughnutData = {
  labels: Object.keys(paymentStats?.statusDistribution || {}).map(key => 
    key.charAt(0).toUpperCase() + key.slice(1)
  ),
  datasets: [
    {
      data: Object.values(paymentStats?.statusDistribution || []),
      backgroundColor: [colors.success, colors.warning],
      hoverBackgroundColor: ['#4fd1c5', '#f6ad55'],
      borderWidth: 2,
      borderColor: '#ffffff',
    },
  ],
};

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 11 + i);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });

  const monthlyAmounts = months.map((month) => {
    const [year, monthNum] = month.split('-').map(Number);
    // Add null check for monthlyData
    const data = paymentStats.monthlyData && paymentStats.monthlyData.find(
      (item) => item.year === year && item.month === monthNum
    );
    return data ? data.totalAmount : 0;
  });

  const lineData = {
    labels: months.map((month) => {
      const [year, monthNum] = month.split('-');
      return new Date(year, monthNum - 1).toLocaleString('fr-FR', { month: 'short', year: '2-digit' });
    }),
    datasets: [
      {
        label: 'Payment Amount',
        data: monthlyAmounts,
        fill: true,
        backgroundColor: 'rgba(106, 17, 203, 0.1)',
        borderColor: colors.primary,
        tension: 0.4,
        pointBackgroundColor: colors.primary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors.primary,
        pointRadius: 4,
        pointHoverRadius: 6
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { 
          color: colors.text.secondary,
          callback: function(value) {
            return value + ' €';
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: colors.text.secondary }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: colors.primaryDark,
        titleFont: { size: 14, family: "'Poppins', sans-serif" },
        bodyFont: { size: 12, family: "'Poppins', sans-serif" },
        callbacks: {
          label: function(context) {
            return `${context.formattedValue} €`;
          }
        }
      },
    },
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeOutQuart' },
  };
const formatAmount = (amount) =>
  typeof amount === 'number' && !isNaN(amount) ? amount.toFixed(2) : '0.00';
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card
            className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ border: 'none' }}
            bodyStyle={{ padding: '1.5rem' }}
          >
            <div className="flex items-center mb-2">
              <FaUsers className="text-2xl mr-2 text-purple-200" />
              <h3 className="text-lg font-medium">Users</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{userStats.totalUsers || 0}</div>
            <div className="text-sm text-purple-200">Total registered users</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            className="bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ border: 'none' }}
            bodyStyle={{ padding: '1.5rem' }}
          >
            <div className="flex items-center mb-2">
              <FaMoneyBillWave className="text-2xl mr-2 text-violet-200" />
              <h3 className="text-lg font-medium">Payments</h3>
            </div>
          <div className="text-3xl font-bold mb-1">{paymentStats.totalCount || 0}</div>
            <div className="text-sm text-violet-200">Total transactions</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            className="bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ border: 'none' }}
            bodyStyle={{ padding: '1.5rem' }}
          >
            <div className="flex items-center mb-2">
              <FaChartBar className="text-2xl mr-2 text-teal-200" />
              <h3 className="text-lg font-medium">Revenue</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{(paymentStats.totalAmount || 0).toFixed(2)} €</div>
            <div className="text-sm text-teal-200">Total revenue</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ border: 'none' }}
            bodyStyle={{ padding: '1.5rem' }}
          >
            <div className="flex items-center mb-2">
              <FaUserShield className="text-2xl mr-2 text-indigo-200" />
              <h3 className="text-lg font-medium">Average Payment</h3>
            </div>
          {paymentStats?.averageAmount != null ? paymentStats.averageAmount.toFixed(2) + ' €' : 'N/A'}
            <div className="text-sm text-indigo-200">Average transaction value</div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={<span className="text-gray-700 font-medium">User Role Distribution</span>}
            className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            style={{ borderRadius: '1rem', border: 'none' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '1rem 1.5rem' }}
            bodyStyle={{ padding: '1.5rem' }}
          >
            <div style={{ height: '300px', padding: '10px' }}>
              <Doughnut data={userDoughnutData} options={doughnutOptions} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={<span className="text-gray-700 font-medium">Users by Role</span>}
            className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            style={{ borderRadius: '1rem', border: 'none' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '1rem 1.5rem' }}
            bodyStyle={{ padding: '1.5rem' }}
          >
            <div style={{ height: '300px', padding: '10px' }}>
              <Bar data={userBarData} options={barOptions} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={<span className="text-gray-700 font-medium">Payment Status Distribution</span>}
            className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            style={{ borderRadius: '1rem', border: 'none' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '1rem 1.5rem' }}
            bodyStyle={{ padding: '1.5rem' }}
          >
            <div style={{ height: '300px', padding: '10px' }}>
              <Doughnut data={paymentDoughnutData} options={doughnutOptions} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={<span className="text-gray-700 font-medium">Payment Trends</span>}
            className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            style={{ borderRadius: '1rem', border: 'none' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '1rem 1.5rem' }}
            bodyStyle={{ padding: '1.5rem' }}
          >
            <div style={{ height: '300px', padding: '10px' }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// AdminModal Component
const AdminModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    FullName: '',
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      setFormError('Please enter a valid email.');
      return;
    }
    if (!formData.password) {
      setFormError('Password is required.');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    setFormError('');
    onSubmit(formData);
    setFormData({
      FullName: '',
      email: '',
      password: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-fade-in">
        <div className="relative p-6">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-2xl p-4 -m-6 mb-4">
            <h2 className="text-xl font-bold text-white">Add Admin</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors"
            title="Close"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {formError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="fullName"
                  type="text"
                  value={formData.FullName}
                  onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Enter full name"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="At least 6 characters"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// DataTable Component


const DataTable = ({ role, title }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users`)
      .then((response) => {
        const filteredData = response.data.filter((user) => user.role === role);
        setData(filteredData);
        setError(null);
      })
      .catch((error) => {
        console.error(`Error loading ${title}:`, error);
        setError(
          error.response
            ? `Server error: ${error.response.status} - ${error.response.data.error || 'Unknown'}`
            : 'Unable to connect to the server.'
        );
      });
  }, [role, title]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`${API_BASE_URL}/users/${id}`)
        .then(() => {
          setData(data.filter((item) => item._id !== id));
          setError(null);
        })
        .catch((error) => {
          console.error(`Error deleting ${title}:`, error);
          setError(
            error.response
              ? `Error: ${error.response.data.error || 'Deletion failed'}`
              : 'Network error during deletion.'
          );
        });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{title}</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="overflow-hidden bg-white rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.FullName || 'Not defined'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
// AdminTable Component

const AdminTable = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users`)
      .then((response) => {
        const filteredData = response.data.filter((user) => user.role === 'ADMIN');
        setData(filteredData);
        setError(null);
      })
      .catch((error) => {
        console.error('Error loading Admins:', error);
        setError(
          error.response
            ? `Server error: ${error.response.status} - ${error.response.data.error || 'Unknown'}`
            : 'Unable to connect to the server.'
        );
      });
  }, []);

  const handleAdd = (formData) => {
    const data = {
      FullName: formData.FullName,
      email: formData.email,
      password: formData.password,
      role: 'ADMIN',
    };

    axios
      .post(`${API_BASE_URL}/users`, data)
      .then((response) => {
        setData([...data, response.data]);
        setError(null);
      })
      .catch((error) => {
        console.error("Error adding Admin:", error);
        setError(
          error.response
            ? `Error: ${error.response.data.error || 'Addition failed'} (Status ${error.response.status})`
            : 'Network error during addition.'
        );
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this administrator?')) {
      axios
        .delete(`${API_BASE_URL}/users/${id}`)
        .then(() => {
          setData(data.filter((item) => item._id !== id));
          setError(null);
        })
        .catch((error) => {
          console.error("Error deleting Admin:", error);
          setError(
            error.response
              ? `Error: ${error.response.data.error || 'Deletion failed'}`
              : 'Network error during deletion.'
          );
        });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Admins</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
        >
          <FaPlus className="mr-2" /> Add
        </button>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="overflow-hidden bg-white rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.FullName || 'Not defined'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AdminModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setError(null);
        }}
        onSubmit={handleAdd}
      />
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfile = () => {
    setIsSidebarOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    // Clear authentication token (adjust key based on your setup)
    localStorage.removeItem('authToken');
    setIsSidebarOpen(false);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-purple-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:static md:translate-x-0 md:w-64`}
      >
        <div className="p-4 text-2xl font-bold">Eduki</div>
        <nav className="flex-1 p-2">
          <div
            onClick={() => {
              setActiveTab('dashboard');
              setIsSidebarOpen(false);
            }}
            className={`p-3 rounded-lg cursor-pointer flex items-center ${
              activeTab === 'dashboard' ? 'bg-purple-600' : 'hover:bg-purple-700'
            }`}
          >
            <FaUsers className="mr-2" /> Users
          </div>
          <div
            onClick={() => {
              setActiveTab('statistics');
              setIsSidebarOpen(false);
            }}
            className={`p-3 rounded-lg cursor-pointer flex items-center ${
              activeTab === 'statistics' ? 'bg-purple-600' : 'hover:bg-purple-700'
            }`}
          >
            <FaChartBar className="mr-2" /> Statistics
          </div>
          <div
            onClick={() => {
              setActiveTab('transactions');
              setIsSidebarOpen(false);
            }}
            className={`p-3 rounded-lg cursor-pointer flex items-center ${
              activeTab === 'transactions' ? 'bg-purple-600' : 'hover:bg-purple-700'
            }`}
          >
            <FaMoneyBillWave className="mr-2" /> Transactions
          </div>
          <div
            onClick={() => {
              setActiveTab('courses');
              setIsSidebarOpen(false);
            }}
            className={`p-3 rounded-lg cursor-pointer flex items-center ${
              activeTab === 'courses' ? 'bg-purple-600' : 'hover:bg-purple-700'
            }`}
          >
            <FaFileAlt className="mr-2" /> Courses
          </div>
          <div
            onClick={handleProfile}
            className={`p-3 rounded-lg cursor-pointer flex items-center ${
              activeTab === 'profile' ? 'bg-purple-600' : 'hover:bg-purple-700'
            }`}
          >
            <FaUser className="mr-2" /> Profile
          </div>
        </nav>
        <div className="p-2">
          <div
            onClick={handleLogout}
            className="p-3 rounded-lg cursor-pointer flex items-center bg-red-600 hover:bg-red-700"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className="flex-1 p-6">
        <button
          className="md:hidden p-2 text-gray-800 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars className="w-6 h-6" />
        </button>

        {activeTab === 'dashboard' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Dashboard
            </h1>
            <AdminTable />
            <DataTable role="APPRENANT" title="Apprenants" />
            <DataTable role="INSTRUCTEUR" title="Instructeurs" />
            <DataTable role="EXPERT" title="Experts" />
          </>
        ) : activeTab === 'statistics' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Statistics
            </h1>
            <Statistics />
          </>
        ) : activeTab === 'transactions' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Transactions
            </h1>
            <TransactionsTable />
          </>
        ) : activeTab === 'courses' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Course Management
            </h1>
            <CoursesTable />
            <CourseStatistics />
          </>
        ) : (
          <p className="text-gray-600">Select an option from the sidebar.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;