import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Recommendations.css'; // Reusing your existing CSS

const SkillBasedRecommendations = () => {
  const [userId, setUserId] = useState(null); // null indicates loading
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user details
  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Veuillez vous connecter pour voir les recommandations');
        setUserId('');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:4000/ajouter/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.data._id) {
        setUserId(response.data.data._id);
      } else {
        setError('Impossible de récupérer les informations de l’utilisateur');
        setUserId('');
        alert('Impossible de récupérer les informations de l’utilisateur');
      }
    } catch (err) {
      setError('Erreur lors de la récupération de l’utilisateur');
      setUserId('');
      alert('Erreur lors de la récupération de l’utilisateur');
    }
  }, []);

  // Fetch skill-based recommendations
  const fetchRecommendations = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:4000/ajouter/recommendations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: {
          userId,
          type: 'skill-based',
          limit: 10,
        },
      });

      if (response.data.success) {
        setCourses(response.data.data);
      } else {
        setError(response.data.message || 'Erreur lors du chargement des recommandations');
        alert(response.data.message || 'Erreur lors du chargement des recommandations');
      }
    } catch (err) {
      setError('Erreur lors du chargement des recommandations');
      alert('Erreur lors du chargement des recommandations');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Handle user interactions (enroll, purchase, view)
  const trackInteraction = useCallback(
    async (courseId, interactionType) => {
      try {
        const response = await axios.post(
          'http://localhost:4000/ajouter/track-interaction',
          {
            userId,
            courseId,
            interactionType,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        if (response.data.success) {
          alert(`Action "${interactionType}" enregistrée avec succès`);
          if (['enroll', 'purchase'].includes(interactionType)) {
            fetchRecommendations();
          }
        } else {
          alert(response.data.message || 'Erreur lors de l’enregistrement de l’interaction');
        }
      } catch (err) {
        alert('Erreur lors de l’enregistrement de l’interaction');
      }
    },
    [userId, fetchRecommendations]
  );

  // Fetch user on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Fetch recommendations when userId changes
  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId, fetchRecommendations]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="title text-3xl font-bold text-gray-800 mb-6">
        Recommandations Basées sur Vos Compétences
      </h2>

      {/* User Status */}
      {userId === null ? (
        <p className="text-center text-gray-600">Vérification de l’authentification...</p>
      ) : userId === '' ? (
        <p className="text-center text-red-600">Veuillez vous connecter pour voir les recommandations.</p>
      ) : (
        <p className="p-2 bg-gray-200 rounded-md mb-6">Connecté en tant que User ID: {userId}</p>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Recommendations List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <p className="no-recommendations col-span-full text-center text-gray-600">
            {loading ? 'Chargement des recommandations...' : 'Aucune recommandation disponible.'}
          </p>
        ) : (
          courses.map(({ course, reason, type, score }) => (
            <div key={course._id} className="card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <img
                src={course.courseimagefile || 'https://via.placeholder.com/300'}
                alt={course.title || course.nom}
                className="card-image w-full h-48 object-cover rounded-md mb-4"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
              />
              <h3 className="card-title text-lg font-semibold text-gray-800">
                {course.title || course.nom}
              </h3>
              <p className="card-description text-gray-600 mt-2">{course.description}</p>
              <p className="card-skills text-sm text-gray-500 mt-2">
                Compétences Requises : {course.requiredSkills?.join(', ') || 'Non spécifié'}
              </p>
              <p className="text-sm text-gray-500 mt-2">Raison : {reason}</p>
              <p className="text-sm text-gray-500">Score : {(score * 100).toFixed(2)}%</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => trackInteraction(course._id, 'view')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Voir
                </button>
                <button
                  onClick={() => trackInteraction(course._id, 'enroll')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  S’inscrire
                </button>
                <button
                  onClick={() => trackInteraction(course._id, 'purchase')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Acheter
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SkillBasedRecommendations;