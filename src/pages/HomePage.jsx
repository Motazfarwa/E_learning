
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiAward, FiUsers } from 'react-icons/fi';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">E-Learning Hub</h1>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium rounded-md transition"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium rounded-md transition"
            >
              Inscription
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Votre Chemin vers la Connaissance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Rejoignez notre plateforme d'apprentissage en ligne et accédez à des cours de qualité dispensés par des experts, adaptés à tous les niveaux.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Commencer l'Apprentissage
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">Découvrez Notre Plateforme</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center p-6 bg-gray-50 rounded-lg shadow-sm"
            >
              <FiBookOpen className="text-indigo-600 w-12 h-12 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Cours Variés</h4>
              <p className="text-gray-600">
                Des cours couvrant la programmation, le design, les affaires et plus encore, pour débutants et experts.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 bg-gray-50 rounded-lg shadow-sm"
            >
              <FiAward className="text-indigo-600 w-12 h-12 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Experts Renommés</h4>
              <p className="text-gray-600">
                Apprenez des instructeurs certifiés avec une expertise reconnue dans leurs domaines.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center p-6 bg-gray-50 rounded-lg shadow-sm"
            >
              <FiUsers className="text-indigo-600 w-12 h-12 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Communauté Engagée</h4>
              <p className="text-gray-600">
                Collaborez avec des apprenants du monde entier et partagez vos expériences.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-6"
          >
            Lancez-vous Aujourd'hui
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg mb-8 max-w-xl mx-auto"
          >
            Inscrivez-vous pour accéder à des cours qui transformeront vos compétences et votre carrière.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              S'inscrire Gratuitement
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2025 E-Learning Hub. Tous droits réservés.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link to="/about" className="text-gray-400 hover:text-white">À propos</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">Conditions d'utilisation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
