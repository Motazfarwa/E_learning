import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import { RoleContext } from './RoleContext';
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

const Addcourseform = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const role = useContext(RoleContext);

  // Set random background image on load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImg(backgroundImages[randomIndex]);
  }, []);

  const onFinish = async (values) => {
    const { machineImage, file, nom, description } = values;
  
    if (!machineImage || machineImage.length === 0) {
      message.error('Veuillez uploader une image pour le cours');
      return;
    }
  
    if (!file || file.length === 0) {
      message.error('Veuillez uploader un fichier');
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('courseimagefile', machineImage[0].originFileObj);
  
    file.forEach((f) => {
      formData.append('file', f.originFileObj);
    });
  
    try {
      await axios.post('http://localhost:4000/api/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Cours ajouté avec succès');
      form.resetFields();
    } catch (error) {
      console.error('Erreur:', error);
      message.error('Échec de l\'ajout du cours');
    } finally {
      setLoading(false);
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
          <a href="/cours/:id" className="text-gray-800 font-semibold hover:text-purple-600 transition-colors duration-300">Détails de cours</a>
          <a href="/getcours" className="text-gray-800 font-semibold hover:text-purple-600 transition-colors duration-300">Liste des cours</a>
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
            <li><a href="/cours/:id" className="block font-semibold hover:text-purple-600 transition-colors duration-300">Détails de cours</a></li>
            <li><a href="/getcours" className="block font-semibold hover:text-purple-600 transition-colors duration-300">Liste des cours</a></li>
          </ul>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-16 max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12"
        >
          Ajouter un <span className="text-purple-600">Nouveau Cours</span>
        </motion.h2>

        <motion.div
          variants={fadeIn('up', 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="space-y-6"
          >
            {/* Machine Image Upload */}
            <Form.Item
              name="machineImage"
              label={<span className="text-gray-800 font-medium">Image du Cours <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: 'L\'image du cours est requise' }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList || []}
            >
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                maxCount={1}
                className="upload-custom"
              >
                <div className="flex flex-col items-center text-purple-600">
                  <PlusOutlined className="text-2xl" />
                  <div className="mt-2 text-sm">Uploader</div>
                </div>
              </Upload>
            </Form.Item>

            {/* Course Name */}
            <Form.Item
              label={<span className="text-gray-800 font-medium">Nom du Cours <span className="text-red-500">*</span></span>}
              name="nom"
              rules={[{ required: true, message: 'Veuillez entrer le nom du cours' }]}
            >
              <Input
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
                placeholder="Entrez le nom du cours"
              />
            </Form.Item>

            {/* Description */}
            <Form.Item
              label={<span className="text-gray-800 font-medium">Description <span className="text-red-500">*</span></span>}
              name="description"
              rules={[{ required: true, message: 'Veuillez entrer une description' }]}
            >
              <Input.TextArea
                rows={4}
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
                placeholder="Décrivez le cours"
              />
            </Form.Item>

            {/* File Upload for Documents and Videos */}
            <Form.Item
              name="file"
              label={<span className="text-gray-800 font-medium">Fichiers du Cours <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: 'Veuillez uploader un fichier' }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList || []}
            >
              <Upload
                beforeUpload={() => false}
                multiple
                className="upload-custom"
              >
                <Button
                  icon={<UploadOutlined />}
                  className="flex items-center gap-2 rounded-lg border-gray-300 text-purple-600 hover:text-purple-700 hover:border-purple-600 transition-colors duration-200"
                >
                  Uploader plusieurs fichiers
                </Button>
              </Upload>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 text-base font-semibold transition-colors duration-200"
              >
                Ajouter le cours
              </Button>
            </Form.Item>
          </Form>
        </motion.div>

        {/* Back to Courses Link */}
        <motion.div
          variants={fadeIn('up', 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="text-center mt-8"
        >
          <a
            href="/getcours"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
          >
            <span>Retour à la liste des cours</span>
            <FiArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Addcourseform;