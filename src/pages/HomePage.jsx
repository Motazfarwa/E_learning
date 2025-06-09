import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiEdit, FiStar, FiMenu, FiX, FiArrowRight, FiEye, FiCreditCard } from 'react-icons/fi';
import axios from 'axios';

// Fade in animation variants
const fadeIn = (direction, delay) => {
  return {
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
  };
};

// Background image array
const backgroundImages = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [courses, setCourses] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [paidCourses, setPaidCourses] = useState([]);
  const navigate = useNavigate();

  // Set random background image on load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImg(backgroundImages[randomIndex]);
  }, []);

  // Fetch courses from the backend
  useEffect(() => {  
    axios.get('http://localhost:4000/api/courses')
      .then((res) => {
        setCourses(res.data);
      })
      .catch((error) => console.error('Error fetching courses:', error));
  }, []);

  // Fetch paid courses for the user
  useEffect(() => {
    const fetchPaidCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/courses/paid', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPaidCourses(response.data.paidCourseIds || []);
      } catch (error) {
        console.error('Error fetching paid courses:', error);
        setPaidCourses([]);
      }
    };

    fetchPaidCourses();
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePayment = (courseId) => {
    navigate(`/payment?courseId=${courseId}`);
  };

  return (
    <React.Fragment>
      {/* Random Background Image with Overlay */}
      <div>
        <div className="w-full h-[450px] md:h-[650px] absolute top-0 left-0 opacity-[0.3] overflow-hidden object-cover">
          {backgroundImg && (
            <img 
              src={backgroundImg} 
              alt="Background" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute left-0 bottom-0 w-full h-[250px] bg-gradient-to-t from-purple-900 to-transparent"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-sm shadow-md p-4 flex justify-between items-center w-full">
        <div className="text-2xl font-bold text-purple-700">Eduki</div>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:inline-block px-4 py-2 text-purple-700 hover:text-purple-800 transition-colors">Connexion</Link>
          <Link to="/register" className="hidden md:inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">Inscription</Link>
          <button className="md:hidden text-gray-700 text-2xl" onClick={toggleMenu}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="fixed top-16 right-4 bg-white shadow-md p-4 rounded-md z-20 md:hidden">
            <Link to="/" className="block text-gray-700 hover:text-purple-700 mb-2">Accueil</Link>
            <Link to="/courses" className="block text-gray-700 hover:text-purple-700 mb-2">Cours</Link>
            <Link to="/blog" className="block text-gray-700 hover:text-purple-700 mb-2">Blog</Link>
            <Link to="/about" className="block text-gray-700 hover:text-purple-700 mb-2">À propos</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-purple-700 mb-2">Contact</Link>
            <hr className="my-2" />
            <Link to="/login" className="block text-gray-700 hover:text-purple-700 mb-2">Connexion</Link>
            <Link to="/register" className="block text-purple-700 font-bold hover:text-purple-800">Inscription</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 flex items-center justify-center min-h-[450px] md:min-h-[550px]">
        <div className="text-center max-w-4xl px-4">
          
          
          <motion.h2
            variants={fadeIn('left', 0.2)}
            initial='hidden'
            whileInView='show'
            viewport={{ once: false, amount: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Élevez Votre Potentiel avec <span className="text-purple-600">l'Apprentissage en Ligne</span>
          </motion.h2>
          
          <motion.p
            variants={fadeIn('right', 0.3)}
            initial='hidden'
            whileInView='show'
            viewport={{ once: false, amount: 0.1 }}
            className="text-base md:text-lg text-gray-700 mb-8 max-w-3xl mx-auto"
          >
            Avec nos cours en ligne, vous pouvez apprendre à votre propre rythme, de n'importe où dans le monde, et accéder à une multitude de ressources, y compris des projets pratiques, des quiz et des retours personnalisés de nos instructeurs.
          </motion.p>
          
          <motion.div
            variants={fadeIn('up', 0.4)}
            initial='hidden'
            whileInView='show'
            viewport={{ once: false, amount: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Rejoignez-nous
            </Link>
            
          </motion.div>
        </div>
      </section>

      {/* Code Block Section */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <motion.div
              variants={fadeIn('right', 0.1)}
              initial='hidden'
              whileInView='show'
              viewport={{ once: false, amount: 0.1 }}
              className="w-full lg:w-1/2"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Débloquez Votre <span className="text-purple-600">Potentiel d'Apprentissage</span> avec nos cours en ligne
              </h3>
              <p className="text-gray-600 mb-6">
                Nos cours sont conçus et enseignés par des experts de l'industrie qui ont des années d'expérience et sont passionnés par le partage de leurs connaissances avec vous.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors shadow-md"
                >
                  Essayez par vous-même
                </Link>
                
              </div>
            </motion.div>
            
            <motion.div
              variants={fadeIn('left', 0.2)}
              initial='hidden'
              whileInView='show'
              viewport={{ once: false, amount: 0.1 }}
              className="w-full lg:w-1/2"
            >
              <div className="bg-gray-900 rounded-lg shadow-xl p-4 overflow-hidden text-sm font-mono">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <pre className="text-yellow-300 overflow-x-auto">
{`<!DOCTYPE html>
<html>
<head>
  <title>Eduki Learning</title>
</head>
<body>
  <h1>
    <a href="/">Eduki</a>
  </h1>
  <nav>
    <a href="courses/">Cours</a>
    <a href="blog/">Blog</a>
    <a href="contact/">Contact</a>
  </nav>
</body>
</html>`}
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Cours Populaires 🔥</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Découvrez nos cours les plus suivis et rejoignez des milliers d'apprenants qui transforment leur vie grâce à l'acquisition de nouvelles compétences.</p>
          </div>
          
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
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{course.nom}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                    
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full text-lg">Aucun cours disponible.</p>
            )}
          </div>
          
         
        </div>
      </section>

      {/* Learning Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            
            <motion.div
              variants={fadeIn('left', 0.2)}
              initial='hidden'
              whileInView='show'
              viewport={{ once: false, amount: 0.1 }}
              className="w-full lg:w-1/2"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Obtenez les compétences dont vous avez besoin pour un 
                <span className="text-purple-600"> emploi recherché</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <FiBook className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Apprentissage interactif</h4>
                    <p className="text-gray-600">Engagez-vous dans un apprentissage actif avec des quiz, des projets et des exercices pratiques qui renforcent vos compétences.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <FiEdit className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Feedback personnalisé</h4>
                    <p className="text-gray-600">Recevez des commentaires détaillés de nos instructeurs experts pour vous aider à progresser rapidement.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <FiStar className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">Certifications reconnues</h4>
                    <p className="text-gray-600">Obtenez des certifications qui valoriseront votre CV et vous distingueront sur le marché du travail.</p>
                  </div>
                </div>
              </div>
              
              
            </motion.div>
          </div>
        </div>
      </section>


      

      

      
      
    </React.Fragment>
  );
};

export default HomePage;