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
  const navigate = useNavigate();
  const BACKEND_URL = 'http://localhost:4000'; // Base URL for the backend

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/users/profile', {
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
        console.error('Error fetching user data:', error);
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
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('FullName', editForm.fullName);
      formData.append('bio', editForm.bio);
      formData.append('skills', editForm.skills);
      if (editForm.profileImage) {
        formData.append('profileImage', editForm.profileImage);
      }

      const response = await axios.put('http://localhost:4000/api/users/profile', formData, {
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
        profileImage: null // Reset file input after submission
      });
      setViewMode('view');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm({ ...editForm, profileImage: file });
    }
  };

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'APPRENANT': return 'Apprenant';
      case 'INSTRUCTEUR': return 'Instructeur';
      case 'EXPERT': return 'Expert';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profil non disponible</h2>
          <p className="text-gray-600 mb-6">Nous n'avons pas pu charger les informations de votre profil.</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <div className="flex items-center mb-8">
          <FiUser className="w-8 h-8 text-indigo-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <nav className="flex-1">
          <button
            onClick={() => setViewMode('view')}
            className={`w-full flex items-center p-3 mb-2 rounded-lg ${viewMode === 'view' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FiUser className="w-5 h-5 mr-2" />
            Voir Profil
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`w-full flex items-center p-3 mb-2 rounded-lg ${viewMode === 'edit' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FiEdit className="w-5 h-5 mr-2" />
            Modifier Profil
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="w-full flex items-center p-3 text-red-600 hover:bg-red-100 rounded-lg"
          >
            <FiLogOut className="w-5 h-5 mr-2" />
            Déconnexion
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {viewMode === 'view' && (
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow p-6 mb-6"
            >
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                  {user.profileImage ? (
                    <img src={`${BACKEND_URL}${user.profileImage}`} alt={user.FullName} className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{user.FullName}</h1>
                  <p className="text-indigo-600">{getRoleDisplay(user.role)}</p>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <nav className="flex border-b border-gray-200 mb-4">
                {['overview', 'activity', 'courses'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 mr-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                  >
                    {tab === 'overview' ? 'Aperçu' : tab === 'activity' ? 'Activité' : user.role === 'APPRENANT' ? 'Mes Cours' : 'Mes Cours Créés'}
                  </button>
                ))}
              </nav>

              {activeTab === 'overview' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="text-indigo-600 font-semibold flex items-center">
                        {user.role === 'APPRENANT' ? 'Cours Suivis' : 'Cours Créés'}
                        <FiBook className="ml-2" />
                      </div>
                      <div className="text-2xl font-bold">{user.stats.courses}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-purple-600 font-semibold flex items-center">
                        Contributions
                        <FiBookOpen className="ml-2" />
                      </div>
                      <div className="text-2xl font-bold">{user.stats.contributions}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-green-600 font-semibold flex items-center">
                        Badges
                        <FiAward className="ml-2" />
                      </div>
                      <div className="text-2xl font-bold">{user.stats.badges}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Réalisations récentes</h3>
                    {user.recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-start mb-2">
                        <FiAward className="w-5 h-5 text-indigo-600 mr-2" />
                        <div>
                          <p>{activity.action}</p>
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
                    <div key={activity.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="font-medium">{activity.action}</div>
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
                          <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <div className="font-medium">Cours #{index + 1}</div>
                            <div className="text-sm text-gray-500">ID: {course}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-2">Aucun cours suivi</div>
                        <button 
                          onClick={() => navigate('/getcours')}
                          className="text-indigo-600 font-medium hover:text-indigo-800"
                        >
                          Parcourir les cours disponibles
                        </button>
                      </div>
                    )
                  ) : (
                    user.profile?.coursesCreated?.length > 0 ? (
                      <div className="space-y-4">
                        {user.profile.coursesCreated.map((course, index) => (
                          <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <div className="font-medium">Cours #{index + 1}</div>
                            <div className="text-sm text-gray-500">ID: {course}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-2">Aucun cours créé</div>
                        <button 
                          onClick={() => navigate('/create-course')}
                          className="text-indigo-600 font-medium hover:text-indigo-800"
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
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-2">À propos</h3>
                <p className="text-gray-600">{user.profile?.bio || 'Aucune bio disponible'}</p>
                <div className="flex items-center text-gray-600 mt-4">
                  <FiMail className="mr-2 text-indigo-500" />
                  <span>{user.email}</span>
                </div>
              </div>
              {user.profile?.skills?.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold text-lg mb-2">Compétences</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="font-semibold text-lg mb-4">Badges</h3>
              <div className="flex flex-wrap gap-4">
                {user.stats?.badges > 0 ? (
                  Array.from({ length: user.stats.badges }).map((_, index) => (
                    <div key={index} className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
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
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Modifier le Profil</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Image de Profil</label>
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                    {editForm.profileImage ? (
                      <img src={URL.createObjectURL(editForm.profileImage)} alt="Preview" className="w-full h-full object-cover" />
                    ) : user.profileImage ? (
                      <img src={`${BACKEND_URL}${user.profileImage}`} alt={user.FullName} className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <label className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700">
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
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Nom Complet</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Compétences (séparées par des virgules)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('view')}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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