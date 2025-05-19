
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiMail, FiAward, FiBook, FiBookOpen, FiEdit, FiUpload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'edit'
  const [editForm, setEditForm] = useState({ fullName: '', bio: '', skills: '', profileImage: null });
  const [error, setError] = useState(''); // Added for error handling
  const navigate = useNavigate();
  const BACKEND_URL = 'http://localhost:4000';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`${BACKEND_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const enrichedUser = {
          ...response.data,
          stats: {
            courses: response.data.role === 'APPRENANT'
              ? (response.data.profile?.coursesEnrolled?.length || 0)
              : (response.data.profile?.coursesCreated?.length || 0),
            contributions: response.data.role === 'APPRENANT' ? 0 : 15,
            badges: 3
          },
          recentActivity: [
            { id: 1, action: 'A complété un cours', time: '2 hours ago' },
            { id: 2, action: 'A gagné un badge', time: '1 day ago' },
            { id: 3, action: 'A posé une question', time: '3 days ago' }
          ]
        };

        setUser(enrichedUser);
        setEditForm({
          fullName: enrichedUser.FullName || '',
          bio: enrichedUser.profile?.bio || '',
          skills: enrichedUser.profile?.skills?.join(', ') || '',
          profileImage: null
        });
      } catch (error) {
        setError('Failed to load profile. Please try again.');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('FullName', editForm.fullName);
      formData.append('bio', editForm.bio);
      formData.append('skills', editForm.skills);
      if (editForm.profileImage) {
        formData.append('profileImage', editForm.profileImage);
      }

      const response = await axios.put(`${BACKEND_URL}/api/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser({
        ...user,
        FullName: editForm.fullName,
        profileImage: response.data.profileImage || user.profileImage,
        profile: {
          ...user.profile,
          bio: editForm.bio,
          skills: editForm.skills.split(',').map(skill => skill.trim())
        }
      });
      setEditForm({
        ...editForm,
        profileImage: null
      });
      setViewMode('view');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm({ ...editForm, profileImage: file });
    }
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'APPRENANT': return 'Apprenant';
      case 'INSTRUCTEUR': return 'Instructeur';
      case 'EXPERT': return 'Expert';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl">
          <svg className="w-12 h-12 animate-spin text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profil non disponible</h2>
          <p className="text-gray-600 mb-6">Nous n'avons pas pu charger les informations de votre profil.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="md:w-64 bg-white bg-opacity-10 backdrop-blur-lg border-r border-gray-200/20 p-6 flex flex-col shadow-lg"
        style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
      >
        <div className="flex items-center mb-8">
          <FiUser className="w-8 h-8 text-purple-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Profil</h2>
        </div>
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setViewMode('view')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${
              viewMode === 'view'
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            <FiUser className="w-5 h-5 mr-2" />
            Voir Profil
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${
              viewMode === 'edit'
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            <FiEdit className="w-5 h-5 mr-2" />
            Modifier Profil
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <FiLogOut className="w-5 h-5 mr-2" />
            Déconnexion
          </button>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        {viewMode === 'view' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-6"
              style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={`${BACKEND_URL}${user.profileImage}`}
                      alt={user.FullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{user.FullName}</h1>
                  <p className="text-purple-600">{getRoleDisplay(user.role)}</p>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
              <nav className="flex border-b border-gray-200/50 mb-4">
                {['overview', 'activity', 'courses'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 mr-2 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-b-2 border-purple-600 text-purple-600'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    {tab === 'overview'
                      ? 'Aperçu'
                      : tab === 'activity'
                      ? 'Activité'
                      : user.role === 'APPRENANT'
                      ? 'Mes Cours'
                      : 'Mes Cours Créés'}
                  </button>
                ))}
              </nav>

              {activeTab === 'overview' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-purple-50 bg-opacity-50 p-4 rounded-lg">
                      <div className="text-purple-600 font-semibold flex items-center">
                        {user.role === 'APPRENANT' ? 'Cours Suivis' : 'Cours Créés'}
                        <FiBook className="ml-2" />
                      </div>
                      <div className="text-2xl font-bold">{user.stats.courses}</div>
                    </div>
                    <div className="bg-purple-50 bg-opacity-50 p-4 rounded-lg">
                      <div className="text-purple-600 font-semibold flex items-center">
                        Contributions
                        <FiBookOpen className="ml-2" />
                      </div>
                      <div className="text-2xl font-bold">{user.stats.contributions}</div>
                    </div>
                    <div className="bg-purple-50 bg-opacity-50 p-4 rounded-lg">
                      <div className="text-purple-600 font-semibold flex items-center">
                        Badges
                        <FiAward className="ml-2" />
                      </div>
                      <div className="text-2xl font-bold">{user.stats.badges}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800">Réalisations récentes</h3>
                    {user.recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-start mb-2">
                        <FiAward className="w-5 h-5 text-purple-600 mr-2" />
                        <div>
                          <p className="text-gray-700">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  {user.recentActivity.map(activity => (
                    <div key={activity.id} className="border-b border-gray-200/50 pb-4 last:border-0 last:pb-0">
                      <div className="font-medium text-gray-700">{activity.action}</div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'courses' && (
                <div>
                  {user.role === 'APPRENANT' ? (
                    user.profile?.coursesEnrolled?.length > 0 ? (
                      <div className="space-y-4">
                        {user.profile.coursesEnrolled.map((course, index) => (
                          <div key={index} className="border-b border-gray-200/50 pb-4 last:border-0 last:pb-0">
                            <div className="font-medium text-gray-700">Cours #{index + 1}</div>
                            <div className="text-sm text-gray-500">ID: {course}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-2">Aucun cours suivi</div>
                        <button
                          onClick={() => navigate('/getcours')}
                          className="text-purple-600 font-medium hover:text-purple-800"
                        >
                          Parcourir les cours disponibles
                        </button>
                      </div>
                    )
                  ) : (
                    user.profile?.coursesCreated?.length > 0 ? (
                      <div className="space-y-4">
                        {user.profile.coursesCreated.map((course, index) => (
                          <div key={index} className="border-b border-gray-200/50 pb-4 last:border-0 last:pb-0">
                            <div className="font-medium text-gray-700">Cours #{index + 1}</div>
                            <div className="text-sm text-gray-500">ID: {course}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-2">Aucun cours créé</div>
                        <button
                          onClick={() => navigate('/create-course')}
                          className="text-purple-600 font-medium hover:text-purple-800"
                        >
                          Créer un nouveau cours
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* About and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">À propos</h3>
                <p className="text-gray-600">{user.profile?.bio || 'Aucune bio disponible'}</p>
                <div className="flex items-center text-gray-600 mt-4">
                  <FiMail className="mr-2 text-purple-600" />
                  <span>{user.email}</span>
                </div>
              </div>
              {user.profile?.skills?.length > 0 && (
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Compétences</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Badges</h3>
              <div className="flex flex-wrap gap-4">
                {user.stats?.badges > 0 ? (
                  Array.from({ length: user.stats.badges }).map((_, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center"
                    >
                      <FiAward className="text-yellow-500 w-8 h-8" />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Aucun badge pour le moment</p>
                )}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'edit' && (
          <div className="max-w-2xl mx-auto bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Modifier le Profil</h2>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-1">Image de Profil</label>
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                    {editForm.profileImage ? (
                      <img
                        src={URL.createObjectURL(editForm.profileImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : user.profileImage ? (
                      <img
                        src={`${BACKEND_URL}${user.profileImage}`}
                        alt={user.FullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <label className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg cursor-pointer hover:from-purple-700 hover:to-purple-800">
                    <FiUpload className="w-5 h-5 mr-2" />
                    Choisir une image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Nom Complet</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white bg-opacity-50 text-gray-800 placeholder-gray-400 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white bg-opacity-50 text-gray-800 placeholder-gray-400 transition-all"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Compétences (séparées par des virgules)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white bg-opacity-50 text-gray-800 placeholder-gray-400 transition-all"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('view')}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
