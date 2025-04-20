import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// URL de base de l'API
const API_BASE_URL = 'http://localhost:4000/api';

// Composant Modal
const Modal = ({ isOpen, onClose, onSubmit, defaultValues, title, roleOptions, isEdit }) => {
  const [formData, setFormData] = useState(
    defaultValues || {
      FullName: '',
      email: '',
      password: '',
      role: roleOptions[0],
      profileImage: '',
    }
  );
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!formData.email.includes('@')) {
      setFormError('Veuillez entrer un email valide.');
      return;
    }
    if (!isEdit) {
      // Pour ajout seulement
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
    console.log('Soumission formulaire :', { formData, isEdit });

    const data = new FormData();
    data.append('FullName', formData.FullName);
    data.append('email', formData.email);
    if (!isEdit) {
      data.append('password', formData.password);
    }
    data.append('role', formData.role);
    if (formData.profileImage) {
      data.append('profileImage', formData.profileImage);
    }
    
    onSubmit(formData);
    // Réinitialiser le formulaire
    setFormData({
      FullName: '',
      email: '',
      password: '',
      role: roleOptions[0],
      profileImage: '',
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
            <label className="block text-gray-700">Image de profil (URL)</label>
            <input
              type="file"
              accept="image/*"
              value={formData.profileImage}
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
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

// Composant Tableau générique
const DataTable = ({ role, title }) => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState(null);
  const roleOptions = ['APPRENANT', 'INSTRUCTEUR', 'EXPERT'];

  // Charger les données
  useEffect(() => {
    console.log(`Chargement des données pour ${title}`);
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

  // Ajouter un utilisateur
  const handleAdd = (formData) => {
    console.log('Ajout utilisateur - Données envoyées :', formData);
    axios
      .post(`${API_BASE_URL}/users`, formData)
      .then((response) => {
        console.log('Utilisateur ajouté avec succès :', response.data);
        if (response.data.role === role) {
          setData([...data, response.data]);
        }
        setError(null);
      })
      .catch((error) => {
        console.error(`Erreur lors de l'ajout d'un ${title} :`, error);
        const errorMessage = error.response
          ? `Erreur : ${error.response.data.error || 'Ajout échoué'} (Statut ${error.response.status})`
          : 'Erreur réseau lors de l’ajout.';
        console.log('Détails de l’erreur :', error.response?.data);
        setError(errorMessage);
      });
  };

  // Modifier un utilisateur
  const handleEdit = (formData) => {
    console.log('Modification utilisateur :', editData._id, formData);
    const { password, ...updateData } = formData;
    axios
      .put(`${API_BASE_URL}/users/${editData._id}`, updateData)
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

  // Supprimer un utilisateur
  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      console.log('Suppression utilisateur :', id);
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
                profileImage: editData.profileImage,
              }
            : {
                FullName: '',
                email: '',
                password: '',
                role,
                profileImage: '',
              }
        }
        title={editData ? `Modifier ${title}` : `Ajouter ${title}`}
        roleOptions={roleOptions}
        isEdit={!!editData}
      />
    </div>
  );
};

// Composant principal Dashboard (inchangé)
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold">E-Learning Admin</div>
        <nav className="flex-1 p-2">
          <div
            onClick={() => setActiveTab('dashboard')}
            className={`p-3 rounded-lg cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-blue-700'
            }`}
          >
            Dashboard
          </div>
        </nav>
      </div>
      <div className="flex-1 p-6">
        {activeTab === 'dashboard' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Tableau de bord
            </h1>
            <DataTable role="APPRENANT" title="Apprenants" />
            <DataTable role="INSTRUCTEUR" title="Instructeurs" />
            <DataTable role="EXPERT" title="Experts" />
          </>
        ) : (
          <p className="text-gray-600">Sélectionnez une option dans la sidebar.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;