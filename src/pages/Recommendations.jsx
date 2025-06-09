import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiMenu, FiX, FiCreditCard } from 'react-icons/fi';
import logo from "../assets/51031-removebg-preview.png";

// Background image array for a modern, beautiful landscape
const backgroundImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Beach sunset
  'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Mountain landscape
  'https://images.unsplash.com/photo-1472214103451-9374bd1c7983?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Forest path
  'https://images.unsplash.com/photo-1501854140801-50d01608902b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Coastal cliffs
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Snowy mountains
];

// Fade in animation variants
const fadeIn = (direction, delay) => ({
  hidden: {
    y: direction === 'up' ? 80 : direction === 'down' ? -80 : 0,
    opacity: 0,
    x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
  },
  show: {
    y: 0,
    x: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 0.8,
      delay: delay,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  },
});

const RecommendedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [paidCourses, setPaidCourses] = useState([]);
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Set random background image on load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImg(backgroundImages[randomIndex]);
  }, []);

  // Fetch recommended courses
  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      setError("Aucun utilisateur connecté. Veuillez vous connecter.");
      return;
    }

    const fetchRecommendedCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/recommendations/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API response:", response.data);
        setCourses(response.data.recommended || []);
        setUserSkills(response.data.userSkills || []);
        setError(null);
      } catch (err) {
        console.error("API error:", err);
        const errorMessage =
          err.response?.status === 401
            ? "Session expirée. Veuillez vous reconnecter."
            : err.response?.data?.message ||
              (err.message === "Network Error"
                ? "Impossible de se connecter au serveur. Vérifiez si le backend est en cours d'exécution."
                : "Échec de la récupération des recommandations");
        setError(errorMessage);
        if (err.response?.status === 401) {
          localStorage.removeItem("user_id");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, [userId, token, navigate]);

  // Fetch paid courses for the user
  useEffect(() => {
    if (!token) return;

    const fetchPaidCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/courses/paid', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaidCourses(response.data.paidCourseIds || []);
      } catch (error) {
        console.error('Error fetching paid courses:', error);
        setPaidCourses([]);
      }
    };

    fetchPaidCourses();
  }, [token]);

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handlePayment = (courseId) => {
    navigate(`/payment?courseId=${courseId}`);
  };

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (!userId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="alert alert-warning text-center max-w-md">
          <p>Veuillez vous connecter pour voir les recommandations.</p>
          <button onClick={() => navigate("/login")} className="btn btn-primary mt-4">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="alert alert-danger text-center max-w-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div className="w-full h-[400px] md:h-[550px] absolute top-0 left-0 opacity-30 overflow-hidden">
        {backgroundImg && (
          <img 
            src={backgroundImg} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute left-0 bottom-0 w-full h-[200px] bg-gradient-to-t from-purple-900 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 bg-white/95 backdrop-blur-md shadow-lg p-4 flex justify-between items-center w-full">
        <img className="w-14 h-10" src={logo} alt="Logo" />
        <button className="md:hidden text-gray-800 text-2xl" onClick={toggleMenu}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed top-16 left-0 h-full w-64 bg-white shadow-2xl p-6 z-30 md:hidden"
        >
          <ul className="space-y-6 text-gray-800">
            <li><a href="/Ajoutercour" className="block font-semibold hover:text-purple-600 transition-colors duration-300">Ajouter des cours</a></li>
            <li><a href="/cours" className="block font-semibold hover:text-purple-600 transition-colors duration-300">Détails de cours</a></li>
          </ul>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12"
        >
          Cours <span className="text-purple-600">Recommandés</span>
        </motion.h2>

        {userSkills.length > 0 ? (
          <motion.div
            variants={fadeIn('up', 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            className="mb-8"
          >
            <h5 className="text-xl font-semibold text-gray-900 mb-3">Basé sur vos compétences :</h5>
            <div className="flex flex-wrap gap-2">
              {userSkills.map((skill, index) => (
                <span key={index} className="badge bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeIn('up', 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            className="alert alert-info text-center max-w-md mx-auto mb-8"
          >
            Aucune compétence trouvée dans votre profil. Ajoutez des compétences pour obtenir des recommandations.
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <motion.div
                key={course._id}
                variants={fadeIn('up', 0.1 * index)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                {course.courseimagefile ? (
                  <img
                    src={`http://localhost:4000/uploads/${course.courseimagefile}`}
                    alt={course.nom}
                    className="w-full h-52 object-cover rounded-t-2xl"
                    onError={handleImageError}
                  />
                ) : imageError ? (
                  <div className="w-full h-52 flex items-center justify-center bg-gray-100 text-red-500 font-medium">
                    Image non disponible
                  </div>
                ) : (
                  <div className="w-full h-52 flex items-center justify-center bg-gray-100 text-gray-500 font-medium">
                    Aucune image
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.nom || "Nom non disponible"}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description || "Aucune description disponible"}</p>
                  <div className="mb-3">
                    <strong className="text-gray-800">Compétences requises :</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(course.requiredSkills || []).map((skill, i) => (
                        <span key={i} className="badge bg-secondary text-gray px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong className="text-gray-800">Prix :</strong>{" "}
                    {course.isPaid ? `${course.price} TND` : "Gratuit"}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {paidCourses.includes(course._id) || !course.isPaid ? (
                        <button
                          onClick={() => handleViewCourse(course._id)}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                        >
                          <FiEye size={16} />
                          Détails
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePayment(course._id)}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                        >
                          <FiCreditCard size={16} />
                          Payer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              variants={fadeIn('up', 0.3)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.1 }}
              className="text-gray-600 text-center col-span-full text-lg"
            >
              Aucun cours recommandé disponible. Essayez d'élargir votre profil de compétences !
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendedCourses;