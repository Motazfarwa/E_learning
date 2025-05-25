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
          <motion.div
            variants={fadeIn('left', 0.1)}
            initial='hidden'
            whileInView='show'
            viewport={{ once: false, amount: 0.1 }}
            className="mb-4"
          >
            <Link to="/become-instructor" className="group inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-sm rounded-full text-purple-700 hover:bg-white transition-all duration-300">
              <span>Devenez instructeur</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
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
            <Link
              to="/courses"
              className="px-6 py-3 bg-white text-purple-700 rounded-md hover:bg-purple-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Explorer les cours
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
                <Link
                  to="/about"
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors shadow-md"
                >
                  En savoir plus
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
                    <div className="flex justify-end">
                      {paidCourses.includes(course._id) ? (
                        <button
                          onClick={() => navigate(`/courses/${course._id}`)}
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
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full text-lg">Aucun cours disponible.</p>
            )}
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors shadow-md"
            >
              <span>Explorer tous les cours</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              variants={fadeIn('right', 0.1)}
              initial='hidden'
              whileInView='show'
              viewport={{ once: false, amount: 0.1 }}
              className="w-full lg:w-1/2"
            >
              <img 
                src="https://via.placeholder.com/600x400?text=Learning+Journey" 
                alt="Learning Journey" 
                className="w-full rounded-xl shadow-lg" 
              />
            </motion.div>
            
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
              
              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-block px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors shadow-md"
                >
                  En savoir plus
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Nos Instructeurs Experts</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Apprenez des meilleurs dans leur domaine. Nos instructeurs sont des professionnels expérimentés passionnés par le partage de leurs connaissances.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Sophie Laurent', role: 'Développement Web', image: 'https://via.placeholder.com/150?text=SL' },
              { name: 'Marc Dubois', role: 'Design UX/UI', image: 'https://via.placeholder.com/150?text=MD' },
              { name: 'Emma Bernard', role: 'Marketing Digital', image: 'https://via.placeholder.com/150?text=EB' },
              { name: 'Thomas Moreau', role: 'Science des Données', image: 'https://via.placeholder.com/150?text=TM' }
            ].map((instructor, index) => (
              <motion.div
                key={index}
                variants={fadeIn('up', 0.1 * index)}
                initial='hidden'
                whileInView='show'
                viewport={{ once: false, amount: 0.1 }}
                className="text-center"
              >
                <div className="mb-4 relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={instructor.image} 
                    alt={instructor.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">{instructor.name}</h4>
                <p className="text-purple-600">{instructor.role}</p>
                <div className="mt-2 flex justify-center space-x-2">
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Ce que disent nos apprenants</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Découvrez les expériences de nos étudiants et comment nos cours ont transformé leur parcours professionnel.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: 'Julie Martin', 
                role: 'Développeuse Frontend',
                image: 'https://via.placeholder.com/80?text=JM',
                quote: 'Les cours d\'Eduki m\'ont permis de changer complètement de carrière et de trouver un emploi que j\'adore en tant que développeuse web.',
                stars: 5
              },
              { 
                name: 'Nicolas Petit', 
                role: 'Designer UX',
                image: 'https://via.placeholder.com/80?text=NP',
                quote: 'La qualité des cours et le soutien des instructeurs ont dépassé toutes mes attentes. Je recommande vivement Eduki à tous ceux qui souhaitent progresser.',
                stars: 5
              },
              { 
                name: 'Céline Dupont', 
                role: 'Analyste de données',
                image: 'https://via.placeholder.com/80?text=CD',
                quote: 'Grâce à la flexibilité des cours en ligne d\'Eduki, j\'ai pu me former tout en continuant à travailler. Le contenu est à jour et pertinent.',
                stars: 4
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeIn('up', 0.1 * index)}
                initial='hidden'
                whileInView='show'
                viewport={{ once: false, amount: 0.1 }}
                className="bg-purple-50 p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-14 h-14 rounded-full object-cover" 
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-purple-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`${i < testimonial.stars ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Restez informé</h3>
          <p className="text-purple-100 mb-8">Inscrivez-vous à notre newsletter pour recevoir des conseils d'apprentissage, des offres spéciales et les dernières actualités.</p>
          
          <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="px-4 py-3 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-purple-300"
              required 
            />
            <button 
              className="px-6 py-3 bg-purple-800 text-white rounded-md hover:bg-purple-900 transition-colors shadow-md"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold text-purple-400 mb-4">Eduki</h4>
              <p className="text-gray-400 mb-4">Votre plateforme d'apprentissage en ligne pour acquérir les compétences de demain.</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            
            
            
            
            <div>
              <h5 className="font-bold text-white mb-4">Contactez-nous</h5>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>contact@eduki.fr</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>123 Avenue des Champs-Élysées, Paris</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+33 1 23 45 67 89</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">© 2025 Eduki. Tous droits réservés.</p>
            
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default HomePage;