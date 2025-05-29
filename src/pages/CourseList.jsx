import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Input, Form, Button } from 'antd';
import { motion } from 'framer-motion';
import { FiTrash2, FiEdit, FiEye, FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
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

const CourseList = () => {
  const [machines, setMachines] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const navigate = useNavigate();

  // Set random background image on load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImg(backgroundImages[randomIndex]);
  }, []);

  // Fetch machines from the backend
  useEffect(() => {  
    axios.get('http://localhost:4000/api/courses')
      .then((res) => {
        setMachines(res.data);
      })
      .catch((error) => console.error('Error fetching machines:', error));
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this course?');
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:4000/api/courses/${id}`);
        if (response.status === 200) {
          setMachines((prevMachines) => prevMachines.filter((machine) => machine._id !== id));
        } else {
          console.error('Error deleting course', response);
        }
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleUpdate = (machine) => {
    setCurrentMachine(machine);
    setShowModal(true);
  };

  const handleFormSubmit = async (values) => {
    if (!currentMachine?._id) {
      alert('Error: Machine ID is missing!');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('nom', values.nom);
      formData.append('description', values.description);
  
      if (newFile) formData.append('file', newFile);
      if (newImageFile !== undefined && newImageFile !== null) {
        formData.append('courseimagefile', newImageFile);
      }
  
      const response = await axios.put(`http://localhost:4000/api/courses/${currentMachine._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 200) {
        alert('Machine updated successfully!');
        setMachines((prevMachines) =>
          prevMachines.map((machine) => (machine._id === currentMachine._id ? response.data.machine : machine))
        );
        setShowModal(false);
      } else {
        alert('Error updating machine');
      }
    } catch (error) {
      console.error('Error updating machine:', error);
      alert('Error updating machine');
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
        <nav className="hidden md:flex space-x-8">
          <a href="/Ajoutercour" className="text-gray-800 font-semibold hover:text-purple-600 transition-colors duration-300">Ajouter des cours</a>
          <a href="/cours" className="text-gray-800 font-semibold hover:text-purple-600 transition-colors duration-300">Détails de cours</a>
        </nav>
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
          Découvrez Nos <span className="text-purple-600">Cours</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.length > 0 ? (
            machines.map((machine, index) => (
              <motion.div
                key={machine._id}
                variants={fadeIn('up', 0.1 * index)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                {machine.courseimagefile ? (
                  <img
                    src={`http://localhost:4000/uploads/${machine.courseimagefile}`}
                    alt={machine.nom}
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{machine.nom}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{machine.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/cours/${machine._id}`)}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <FiEye size={16} />
                        Détails
                      </button>
                      <button
                        onClick={() => handleUpdate(machine)}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <FiEdit size={16} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(machine._id)}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <FiTrash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full text-lg">Aucun cours disponible.</p>
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          variants={fadeIn('up', 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="text-center mt-12"
        >
          <a
            href="/Ajoutercour"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <span>Ajouter un nouveau cours</span>
            <FiArrowRight size={16} />
          </a>
        </motion.div>
      </div>

      {/* Modal for updating machine */}
      <Modal
        title={<span className="text-2xl font-bold text-gray-900">Modifier le Cours</span>}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        className="rounded-2xl"
      >
        <Form
          initialValues={{
            nom: currentMachine?.nom,
            description: currentMachine?.description,
          }}
          onFinish={handleFormSubmit}
          className="space-y-6 p-4"
        >
          <Form.Item label={<span className="text-gray-800 font-medium">Nom du Cours</span>} name="nom">
            <Input
              defaultValue={currentMachine?.nom}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
            />
          </Form.Item>
          <Form.Item label={<span className="text-gray-800 font-medium">Description</span>} name="description">
            <Input.TextArea
              defaultValue={currentMachine?.description}
              rows={4}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
            />
          </Form.Item>
          <Form.Item label={<span className="text-gray-800 font-medium">Image du Cours</span>} name="courseimagefile">
            <input
              type="file"
              onChange={(e) => setNewImageFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition-colors duration-200"
            />
          </Form.Item>
          <Form.Item label={<span className="text-gray-800 font-medium">Fichier du Cours</span>} name="file">
            <input
              type="file"
              onChange={(e) => setNewFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition-colors duration-200"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 text-base font-semibold transition-colors duration-200"
            >
              Mettre à jour le cours
            </Button>
          </Form.Item>
          
        </Form>
      </Modal>
    </div>
  );
};

export default CourseList;