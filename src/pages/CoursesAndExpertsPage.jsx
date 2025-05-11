
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUser, FiLogOut, FiBook, FiAward } from 'react-icons/fi';

const CoursesAndExpertsPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Aucun token trouvé. Veuillez vous connecter.');
          navigate('/login');
          return;
        }

        // Fetch Courses
        const coursesResponse = await axios.get('http://localhost:4000/api/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Courses API Response:', coursesResponse.data);

        if (coursesResponse.data.success && coursesResponse.data.data?.courses) {
          setCourses(coursesResponse.data.data.courses);
        } else {
          setError('Réponse API invalide : données des cours manquantes.');
        }

        // Fetch Experts
        const expertsResponse = await axios.get('http://localhost:4000/api/experts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Experts API Response:', expertsResponse.data);

        if (expertsResponse.data.success && expertsResponse.data.data?.experts) {
          setExperts(expertsResponse.data.data.experts);
        } else {
          setError((prev) => prev || 'Réponse API invalide : données des experts manquantes.');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(error.response?.data?.message || 'Erreur lors du chargement des données.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">E-Learning Hub</h1>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium rounded-md transition"
            >
              <FiUser className="mr-2" />
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-100 font-medium rounded-md transition"
            >
              <FiLogOut className="mr-2" />
              Déconnexion
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Courses Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Explorez Nos Cours</h2>
          {courses.length === 0 ? (
            <p className="text-gray-600 text-center">Aucun cours disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={`http://localhost:4000${course.courseimagefile}`}
                    alt={course.nom}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Image+Indisponible')}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.nom}</h3>
                    <Link
                      to={`/courses/${course._id}`}
                      className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                      Voir le Cours
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Experts Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Rencontrez Nos Experts</h2>
          {experts.length === 0 ? (
            <p className="text-gray-600 text-center">Aucun expert disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert) => (
                <motion.div
                  key={expert._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={expert.profileImage ? `http://localhost:4000${expert.profileImage}` : 'https://via.placeholder.com/300x200?text=Expert'}
                    alt={expert.FullName}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Expert')}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{expert.FullName}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{expert.profile.bio || 'Aucune description disponible.'}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {expert.profile.skills.length > 0 ? (
                        expert.profile.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">Aucune compétence listée</span>
                      )}
                    </div>
                    <Link
                      to={`/experts/${expert._id}`}
                      className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                      Voir le Profil
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CoursesAndExpertsPage;
