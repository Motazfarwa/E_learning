import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus , FaBars } from 'react-icons/fa';

import { Card, Statistic, Row, Col, Input } from 'antd';
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

// Enregistrer les composants Chart.js
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

// URL de base de l'API
const API_BASE_URL = 'http://localhost:4000/api';

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
        console.error('Erreur lors du chargement des cours :', error);
        setError('Erreur lors du chargement des cours');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce cours ?')) {
      try {
        await axios.delete(`${API_BASE_URL}/courses/${id}`);
        setCourses(courses.filter((course) => course._id !== id));
        setFilteredCourses(filteredCourses.filter((course) => course._id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression du cours :', err);
        setError('Erreur lors de la suppression du cours');
      }
    }
  };

  if (loading) return <p className="text-center text-gray-600">Chargement des cours...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Liste des Cours</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left text-gray-600 font-semibold">Nom</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Description</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Fichiers</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Commentaires</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{course.nom}</td>
                  <td className="p-3">{course.description.substring(0, 50)}...</td>
                  <td className="p-3">{course.file.length} fichier(s)</td>
                  <td className="p-3">{course.comments.length}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  Aucun cours trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant CourseStatistics
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
        console.error('Erreur lors du chargement des statistiques des cours :', error);
        setError('Erreur lors du chargement des statistiques des cours');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-600">Chargement des statistiques...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const fileTypeDoughnutData = {
    labels: stats.fileTypeDistribution.map((type) => type._id),
    datasets: [
      {
        data: stats.fileTypeDistribution.map((type) => type.count),
        backgroundColor: ['#1890ff', '#cf1322', '#faad14'],
        hoverBackgroundColor: ['#40c4ff', '#ff4560', '#ffc107'],
        borderWidth: 1
      }
    ]
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 14 }, color: '#374151' }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 14 },
        bodyFont: { size: 12 }
      }
    },
    maintainAspectRatio: false,
    animation: { animateScale: true, animateRotate: true }
  };

  const commentsBarData = {
    labels: stats.commentsByCourse.map((course) => course.nom),
    datasets: [
      {
        label: 'Nombre de commentaires',
        data: stats.commentsByCourse.map((course) => course.commentCount),
        backgroundColor: '#1890ff',
        borderColor: '#096dd9',
        borderWidth: 1
      }
    ]
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de commentaires',
          font: { size: 14 },
          color: '#374151'
        },
        ticks: { color: '#374151' }
      },
      x: {
        title: {
          display: true,
          text: 'Cours',
          font: { size: 14 },
          color: '#374151'
        },
        ticks: { color: '#374151' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 14 },
        bodyFont: { size: 12 }
      }
    },
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeOutQuart' }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistiques des Cours</h2>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderRadius: '12px', textAlign: 'center' }}
          >
            <Statistic
              title="Total des Cours"
              value={stats.totalCourses}
              valueStyle={{ color: '#3f8600', fontSize: '2rem', fontWeight: 'bold' }}
              className="py-4"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Répartition des Types de Fichiers"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderRadius: '12px' }}
          >
            <div style={{ height: '300px', padding: '20px' }}>
              <Doughnut data={fileTypeDoughnutData} options={doughnutOptions} />
            </div>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title="Commentaires par Cours"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderRadius: '12px' }}
          >
            <div style={{ height: '300px', padding: '20px' }}>
              <Bar data={commentsBarData} options={barOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Composant TransactionsTable
const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/payments`)
      .then((response) => {
        setTransactions(response.data);
        setFilteredTransactions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des transactions :', error);
        setError('Erreur lors du chargement des transactions');
        setLoading(false);
      });
  }, []);

  // Filtrer les transactions par email
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

  if (loading) return <p className="text-center text-gray-600">Chargement des transactions...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h2>
      <div className="mb-4">
        <Input
          placeholder="Rechercher par email du client"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="w-full max-w-md p-2"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left text-gray-600 font-semibold">ID Paiement</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Montant (USD)</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Devise</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Nom Client</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Email Client</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Statut</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{transaction.paymentId}</td>
                  <td className="p-3">{transaction.amount.toFixed(2)}</td>
                  <td className="p-3">{transaction.currency.toUpperCase()}</td>
                  <td className="p-3">{transaction.customerName}</td>
                  <td className="p-3">{transaction.customerEmail}</td>
                  <td className="p-3">{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</td>
                  <td className="p-3">{new Date(transaction.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">
                  Aucune transaction trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant Statistics
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

        setPaymentStats(paymentResponse.data);

        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des statistiques :', error);
        setError('Erreur lors du chargement des statistiques');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-600">Chargement des statistiques...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const userDoughnutData = {
    labels: ['Apprenants', 'Instructeurs', 'Experts'],
    datasets: [
      {
        data: [userStats.apprenants, userStats.instructeurs, userStats.experts],
        backgroundColor: ['#1890ff', '#cf1322', '#faad14'],
        hoverBackgroundColor: ['#40c4ff', '#ff4560', '#ffc107'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14 },
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
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
        label: 'Nombre d’utilisateurs par rôle',
        data: [userStats.apprenants, userStats.instructeurs, userStats.experts],
        backgroundColor: ['#1890ff', '#cf1322', '#faad14'],
        borderColor: ['#096dd9', '#a8071a', '#d46b08'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre d’utilisateurs',
          font: { size: 14 },
          color: '#374151',
        },
        ticks: { color: '#374151' },
      },
      x: {
        title: {
          display: true,
          text: 'Rôles',
          font: { size: 14 },
          color: '#374151',
        },
        ticks: { color: '#374151' },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  const paymentDoughnutData = {
    labels: Object.keys(paymentStats.statusDistribution),
    datasets: [
      {
        data: Object.values(paymentStats.statusDistribution),
        backgroundColor: ['#2f9e44', '#e03131'],
        hoverBackgroundColor: ['#37b24d', '#f03e3e'],
        borderWidth: 1,
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
    const data = paymentStats.monthlyData.find(
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
        label: 'Montant des paiements',
        data: monthlyAmounts,
        fill: true,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: '#2f9e44',
        tension: 0.4,
        pointBackgroundColor: '#2f9e44',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2f9e44',
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Montant (USD)',
          font: { size: 14 },
          color: '#374151',
        },
        ticks: { color: '#374151' },
      },
      x: {
        title: {
          display: true,
          text: 'Mois',
          font: { size: 14 },
          color: '#374151',
        },
        ticks: { color: '#374151' },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14 },
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Statistiques</h2>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderRadius: '12px', textAlign: 'center' }}
          >
            <Statistic
              title="Total Utilisateurs"
              value={userStats.totalUsers}
              valueStyle={{ color: '#3f8600', fontSize: '2rem', fontWeight: 'bold' }}
              className="py-4"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderRadius: '12px', textAlign: 'center' }}
          >
            <Statistic
              title="Montant Total des Paiements (USD)"
              value={paymentStats.totalAmount.toFixed(2)}
              valueStyle={{ color: '#2f9e44', fontSize: '2rem', fontWeight: 'bold' }}
              className="py-2"
            />
            <Statistic
              title="Nombre de Paiements"
              value={paymentStats.totalCount}
              valueStyle={{ color: '#2f9e44', fontSize: '1.5rem' }}
              className="py-2"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Répartition des Rôles"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderRadius: '12px' }}
          >
            <div style={{ height: '300px', padding: '20px' }}>
              <Doughnut data={userDoughnutData} options={doughnutOptions} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Nombre par Rôle"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderRadius: '12px' }}
          >
            <div style={{ height: '300px', padding: '20px' }}>
              <Bar data={userBarData} options={barOptions} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Répartition des Statuts de Paiement"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderRadius: '12px' }}
          >
            <div style={{ height: '300px', padding: '20px' }}>
              <Doughnut data={paymentDoughnutData} options={doughnutOptions} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Évolution des Paiements"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ borderRadius: '12px' }}
          >
            <div style={{ height: '300px', padding: '20px' }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Composant Modal
const Modal = ({ isOpen, onClose, onSubmit, defaultValues, title, roleOptions, isEdit }) => {
  const [formData, setFormData] = useState(
    defaultValues || {
      FullName: '',
      email: '',
      password: '',
      role: roleOptions[0],
      profileImage: null,
    }
  );
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      setFormError('Veuillez entrer un email valide.');
      return;
    }
    if (!isEdit) {
      if (!formData.password) {
        setFormError('Le mot de passe est requis pour un nouvel utilisateur.');
        return;
      }
      if (formData.password.length < 6) {
        setFormError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
    }
    setFormError('');
    onSubmit(formData);
    setFormData({
      FullName: '',
      email: '',
      password: '',
      role: roleOptions[0],
      profileImage: null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {formError && <p className="text-red-600 mb-4">{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nom complet</label>
            <input
              type="text"
              value={formData.FullName}
              onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {!isEdit && (
            <div className="mb-4">
              <label className="block text-gray-700">Mot de passe</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 border rounded"
                required
                placeholder="Au moins 6 caractères"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Rôle</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image de profil</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant DataTable
const DataTable = ({ role, title }) => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState(null);
  const roleOptions = ['APPRENANT', 'INSTRUCTEUR', 'EXPERT'];

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users`)
      .then((response) => {
        const filteredData = response.data.filter((user) => user.role === role);
        setData(filteredData);
        setError(null);
      })
      .catch((error) => {
        console.error(`Erreur lors du chargement des ${title} :`, error);
        setError(
          error.response
            ? `Erreur serveur : ${error.response.status} - ${
                error.response.data.error || 'Inconnu'
              }`
            : 'Impossible de se connecter au serveur.'
        );
      });
  }, [role, title]);

  const handleAdd = (formData) => {
    const data = new FormData();
    data.append('FullName', formData.FullName);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);
    if (formData.profileImage) {
      data.append('profileImage', formData.profileImage);
    }

    axios
      .post(`${API_BASE_URL}/users`, data)
      .then((response) => {
        if (response.data.role === role) {
          setData([...data, response.data]);
        }
        setError(null);
      })
      .catch((error) => {
        console.error(`Erreur lors de l'ajout d'un ${title} :`, error);
        setError(
          error.response
            ? `Erreur : ${error.response.data.error || 'Ajout échoué'} (Statut ${error.response.status})`
            : 'Erreur réseau lors de l’ajout.'
        );
      });
  };

  const handleEdit = (formData) => {
    const data = new FormData();
    data.append('FullName', formData.FullName);
    data.append('email', formData.email);
    data.append('role', formData.role);
    if (formData.profileImage) {
      data.append('profileImage', formData.profileImage);
    }

    axios
      .put(`${API_BASE_URL}/users/${editData._id}`, data)
      .then((response) => {
        setData(
          data.map((item) => (item._id === editData._id ? response.data : item))
        );
        setError(null);
      })
      .catch((error) => {
        console.error(`Erreur lors de la modification d'un ${title} :`, error);
        setError(
          error.response
            ? `Erreur : ${error.response.data.error || 'Modification échouée'}`
            : 'Erreur réseau lors de la modification.'
        );
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      axios
        .delete(`${API_BASE_URL}/users/${id}`)
        .then(() => {
          setData(data.filter((item) => item._id !== id));
          setError(null);
        })
        .catch((error) => {
          console.error(`Erreur lors de la suppression d'un ${title} :`, error);
          setError(
            error.response
              ? `Erreur : ${error.response.data.error || 'Suppression échouée'}`
              : 'Erreur réseau lors de la suppression.'
          );
        });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" /> Ajouter
        </button>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left text-gray-600 font-semibold">Image</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Nom complet</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Email</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Rôle</th>
              <th className="p-3 text-left text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {item.profileImage ? (
                      <img
                        src={item.profileImage}
                        alt="Profil"
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
                      />
                    ) : (
                      'Aucune'
                    )}
                  </td>
                  <td className="p-3">{item.FullName || 'Non défini'}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditData(item);
                          setModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
          setError(null);
        }}
        onSubmit={editData ? handleEdit : handleAdd}
        defaultValues={
          editData
            ? {
                FullName: editData.FullName,
                email: editData.email,
                role: editData.role,
                profileImage: null,
              }
            : {
                FullName: '',
                email: '',
                password: '',
                role,
                profileImage: null,
              }
        }
        title={editData ? `Modifier ${title}` : `Ajouter ${title}`}
        roleOptions={roleOptions}
        isEdit={!!editData}
      />
    </div>
  );
};

// Composant principal Dashboard
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // État pour la sidebar

  // Fonction pour basculer la sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-blue-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:static md:translate-x-0 md:w-64`} // Toujours visible sur md et plus
      >
        <div className="p-4 text-2xl font-bold">E-Learning Admin</div>
        <nav className="flex-1 p-2">
          <div
            onClick={() => {
              setActiveTab('dashboard');
              setIsSidebarOpen(false); // Ferme la sidebar sur mobile après clic
            }}
            className={`p-3 rounded-lg cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-blue-700'
            }`}
          >
            Les utilisateurs
          </div>
          <div
            onClick={() => {
              setActiveTab('statistics');
              setIsSidebarOpen(false);
            }}
            className={`p-3 rounded-lg cursor-pointer ${
              activeTab === 'statistics' ? 'bg-blue-600' : 'hover:bg-blue-700'
            }`}
          >
            Statistiques
          </div>
          <div
            onClick={() => {
              setActiveTab('transactions');
              setIsSidebarOpen(false);
            }}
            className={`p-3 rounded-lg cursor-pointer ${
              activeTab === 'transactions' ? 'bg-blue-600' : 'hover:bg-blue-700'
            }`}
          >
            Transactions
          </div>
          <div
            onClick={() => {
              setActiveTab('courses');
              setIsSidebarOpen(false);
            }}
            className={`p-3 rounded-lg cursor-pointer ${
              activeTab === 'courses' ? 'bg-blue-600' : 'hover:bg-blue-700'
            }`}
          >
            Cours
          </div>
        </nav>
      </div>

      {/* Overlay pour mobile (ferme la sidebar en cliquant à l'extérieur) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 p-6">
        {/* Bouton Hamburger (visible uniquement sur mobile) */}
        <button
          className="md:hidden p-2 text-gray-800 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars className="w-6 h-6" />
        </button>

        {/* Contenu du tableau de bord */}
        {activeTab === 'dashboard' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Tableau de bord
            </h1>
            <DataTable role="APPRENANT" title="Apprenants" />
            <DataTable role="INSTRUCTEUR" title="Instructeurs" />
            <DataTable role="EXPERT" title="Experts" />
          </>
        ) : activeTab === 'statistics' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Statistiques
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
              Gestion des Cours
            </h1>
            <CoursesTable />
            <CourseStatistics />
          </>
        ) : (
          <p className="text-gray-600">Sélectionnez une option dans la sidebar.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;