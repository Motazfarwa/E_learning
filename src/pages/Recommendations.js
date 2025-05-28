import React, { useEffect, useState } from 'react';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const userId = localStorage.getItem('user_id'); // or get it from context/auth

      const response = await fetch(`http://localhost:4000/ajouter/recommendations?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const result = await response.json();
      setRecommendations(result.data); // access `.data` because backend wraps it
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchRecommendations();
}, []);


  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Recommended Courses</h2>
      <ul>
        {recommendations.length === 0 ? (
          <li>No recommendations available.</li>
        ) : (
          recommendations.map(course => (
            <li key={course._id}>
              <strong>{course.title}</strong> - {course.category}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Recommendations;
