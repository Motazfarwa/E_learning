import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaBars } from 'react-icons/fa';
import { Card, Button, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RoleContext } from './RoleContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:4000/api';

const ProfilePage = () => {
  const { user, setUser } = useContext(RoleContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    FullName: user?.FullName || '',
    email: user?.email || '',
    profileImage: null,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Débogage : Afficher la valeur de user
  useEffect(() => {
    console.log('RoleContext user:', user);
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditSubmit = async () => {
    const data = new FormData();
    data.append('FullName', formData.FullName);
    data.append('email', formData.email);
    if (formData.profileImage) {
      data.append('profileImage', formData.profileImage);
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/users/${user._id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil :', err);
      setError('Erreur lors de la mise à jour du profil');
    }
  };

  // Afficher un message de chargement ou d'erreur si user est null
  if (!user) {
    return <div className="text-center p-6">Chargement du profil...</div>;
  }

  // Vérifier si l'utilisateur est un APPRENANT
  if (user.role !== 'APPRENANT') {
    return <div className="text-center p-6 text-red-600">Accès réservé aux apprenants</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-blue-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:static md:translate-x-0 md:w-64`}
      >
        <div className="p-4 text-2xl font-bold flex justify-between items-center">
          E-Learning
          <button className="md:hidden text-white" onClick={toggleSidebar}>
            <FaBars className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-2">
          <div
            onClick={() => {
              navigate('/getcours');
              setIsSidebarOpen(false);
            }}
            className="p-3 rounded-lg cursor-pointer hover:bg-blue-700"
          >
            Cours
          </div>
          <div
            onClick={() => {
              navigate('/profile');
              setIsSidebarOpen(false);
            }}
            className="p-3 rounded-lg cursor-pointer bg-blue-600"
          >
            Profil
          </div>
        </nav>
      </div>

      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 p-6">
        <button
          className="md:hidden p-2 text-gray-800 focus:outline-none"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <FaBars className="w-6 h-6" />
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profil de l'Apprenant</h1>

        <Card className="shadow-lg max-w-2xl mx-auto" style={{ borderRadius: '12px' }}>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {!isEditing ? (
            <div className="flex flex-col items-center">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profil"
                  className="w-24 h-24 rounded-full object-cover mb-4"
                  onError={(e) => (e.target.src = '/placeholder-profile.png')}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-gray-500">Aucune image</span>
                </div>
              )}
              <h2 className="text-xl font-semibold">{user?.FullName || 'Non défini'}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-600 capitalize">{user?.role}</p>
              <Button
                type="primary"
                icon={<FaEdit />}
                className="mt-4"
                onClick={() => setIsEditing(true)}
              >
                Modifier le profil
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Nom complet</label>
                <Input
                  value={formData.FullName}
                  onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Image de profil</label>
                <Upload
                  beforeUpload={() => false}
                  onChange={(info) => setFormData({ ...formData, profileImage: info.file })}
                  accept="image/*"
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Choisir une image</Button>
                </Upload>
                {formData.profileImage && (
                  <p className="text-gray-600 mt-2">{formData.profileImage.name}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsEditing(false)}>Annuler</Button>
                <Button type="primary" onClick={handleEditSubmit}>
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Section pour les cours suivis */}
        <Card
          title="Cours suivis"
          className="shadow-lg max-w-2xl mx-auto mt-6"
          style={{ borderRadius: '12px' }}
        >
          <p className="text-gray-600">
            (À implémenter : Liste des cours suivis par l'apprenant)
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;