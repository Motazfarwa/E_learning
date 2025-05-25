import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recommendations.css'; // Fichier CSS personnalisé

const Recommendations = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/recommendations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des recommandations');
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) return <div className="text-center">Chargement...</div>;
  if (error) return <div className="text-center error">{error}</div>;

  return (
    <div className="container">
      <h2 className="title">Cours Recommandés</h2>
      <div className="grid">
        {courses.length === 0 ? (
          <p className="no-recommendations">Aucune recommandation disponible.</p>
        ) : (
          courses.map(course => (
            <div key={course._id} className="card">
              <img
                src={course.courseimagefile || 'https://via.placeholder.com/300'}
                alt={course.nom}
                className="card-image"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
              />
              <h3 className="card-title">{course.nom}</h3>
              <p className="card-description">{course.description}</p>
              <p className="card-skills">
                Compétences : {course.requiredSkills?.join(', ') || 'Non spécifié'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Recommendations;