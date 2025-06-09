
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLogOut, FiMail, FiEdit, FiUpload, FiBook, FiBookOpen, FiCalendar , FiMessageSquare } from 'react-icons/fi';
import logo from "../assets/51031-removebg-preview.png";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'edit'
  const [editForm, setEditForm] = useState({ fullName: '', bio: '', skills: '', profileImage: null });
  const [error, setError] = useState('');
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
          }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center">
          <svg className="w-10 h-10 animate-spin text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Profil non disponible</h2>
          <p className="text-gray-600 mb-4">Nous n'avons pas pu charger les informations de votre profil.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center fixed w-full top-0 z-20">
        <img className="w-10 h-7" src={logo} alt="Logo" />
        
      </header>

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 fixed top-14 left-0 h-[calc(100vh-56px)] z-10 hidden md:block">
        
        <nav className="space-y-2">
          <button
            onClick={() => setViewMode('view')}
            className={`w-full flex items-center p-2 rounded-lg ${
              viewMode === 'view' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiUser className="w-5 h-5 mr-2" /> Voir Profil
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`w-full flex items-center p-2 rounded-lg ${
              viewMode === 'edit' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiEdit className="w-5 h-5 mr-2" /> Modifier
          </button>
          {user.role === 'APPRENANT' && (
  <>
    <Link
      to="/studentcalendar"
      className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 mb-1"
    >
      <FiCalendar className="w-5 h-5 mr-3 text-purple-500" />
      <span>Calendrier Apprenant</span>
    </Link>
    
    <Link
      to="/chat"
      className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
    >
      <FiMessageSquare className="w-5 h-5 mr-3 text-purple-500" />
      <span>Chat Room</span>
    </Link>
    <Link
      to="/skill"
      className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
    >
      <FiMessageSquare className="w-5 h-5 mr-3 text-purple-500" />
      <span>Cours recommnadés</span>
    </Link>
  </>
)}
          {user.role === 'EXPERT' && (
            <Link
              to="/calendar"
              className="w-full flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <FiCalendar className="w-5 h-5 mr-2" /> Calendrier Expert
            </Link>
          )}
          {user.role === 'INSTRUCTEUR' && (
            <Link
              to="/chat"
              className="w-full flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <FiCalendar className="w-5 h-5 mr-2" /> Chat Room
            </Link>
          )}
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <FiLogOut className="w-5 h-5 mr-2" /> Déconnexion
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-16 pl-0 md:pl-64 p-6 max-w-4xl mx-auto">
        {viewMode === 'view' && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
                  <h1 className="text-2xl font-semibold text-gray-800">{user.FullName}</h1>
                  <p className="text-purple-600 text-sm">{getRoleDisplay(user.role)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-gray-600">
                <FiMail className="w-5 h-5 mr-2 text-purple-600" />
                <span>{user.email}</span>
              </div>
            </div>

           

            {/* About and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">À propos</h3>
                <p className="text-gray-600">{user.profile?.bio || 'Aucune bio disponible'}</p>
              </div>
              {user.profile?.skills?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Compétences</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Courses */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                {user.role === 'APPRENANT' ? 'Mes Cours' : 'Mes Cours Créés'}
              </h2>
              {user.role === 'APPRENANT' ? (
                user.profile?.coursesEnrolled?.length > 0 ? (
                  <div className="space-y-2">
                    {user.profile.coursesEnrolled.map((course, index) => (
                      <div key={index} className="text-gray-700">Cours #{index + 1} (ID: {course})</div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">Aucun cours suivi</p>
                    <button
                      onClick={() => navigate('/cours')}
                      className="text-purple-600 font-medium hover:text-purple-800"
                    >
                      Parcourir les cours
                    </button>
                  </div>
                )
              ) : (
                user.profile?.coursesCreated?.length > 0 ? (
                  <div className="space-y-2">
                    {user.profile.coursesCreated.map((course, index) => (
                      <div key={index} className="text-gray-700">Cours #{index + 1} (ID: {course})</div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">Aucun cours créé</p>
                    <button
                      onClick={() => navigate('/Ajoutercour')}
                      className="text-purple-600 font-medium hover:text-purple-800"
                    >
                      Créer un cours
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {viewMode === 'edit' && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Modifier le Profil</h2>
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
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-6">
  {/* Image de Profil - Version haute */}
  <div className="flex flex-col gap-4">
    <label className="text-lg font-medium text-gray-800">Image de Profil</label>
    <div className="flex items-center gap-6">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
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
          <FiUser className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <label className="flex items-center px-4 py-3 bg-purple-600 text-white rounded-xl cursor-pointer hover:bg-purple-700 transition-colors">
        <FiUpload className="w-6 h-6 mr-3" />
        <span className="text-lg">Choisir une image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>
  </div>

  {/* Nom Complet - Version haute */}
  <div className="flex flex-col gap-2">
    <label className="text-lg font-medium text-gray-800">Nom Complet</label>
    <input
      type="text"
      value={editForm.fullName}
      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
      className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-800"
      required
    />
  </div>

  {/* Bio - Version haute */}
  <div className="flex flex-col gap-2">
    <label className="text-lg font-medium text-gray-800">Bio</label>
    <textarea
      value={editForm.bio}
      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
      className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-800 min-h-[150px]"
      rows="4"
    />
  </div>

  {/* Compétences - Version haute */}
  <div className="flex flex-col gap-2">
    <label className="text-lg font-medium text-gray-800">Compétences (séparées par des virgules)</label>
    <input
      type="text"
      value={editForm.skills}
      onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
      className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-800"
    />
  </div>

  {/* Boutons - Version haute */}
  <div className="flex justify-end gap-4 mt-6">
    <button
      type="button"
      onClick={() => setViewMode('view')}
      className="px-6 py-3 bg-gray-200 text-gray-800 text-lg font-medium rounded-xl hover:bg-gray-300 transition-colors"
    >
      Annuler
    </button>
    <button
      type="submit"
      className="px-6 py-3 bg-purple-600 text-white text-lg font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-md"
    >
      Enregistrer les modifications
    </button>
  </div>
</form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;