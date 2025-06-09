import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Upload, Button, message, Select, InputNumber } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import { RoleContext } from './RoleContext';
import logo from '../assets/51031-removebg-preview.png';
import ChatApp from "./chatboat";

// Background image array for a modern, beautiful landscape
const backgroundImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?ixlib=rb-4.3&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c7983?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01608902b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
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
    const { machineImage, file, description, nom, requiredSkills, price } = values;

    if (!machineImage || machineImage.length === 0) {
      message.error('Please upload an image for the course');
      return;
    }

    if (!file || file.length === 0) {
      message.error('Please upload a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('courseimagefile', machineImage[0].originFileObj);
    formData.append('requiredSkills', JSON.stringify(requiredSkills || []));
    formData.append('price', price || 0); // Default to 0 if not provided

    file.forEach((f) => {
      formData.append('file', f.originFileObj);
    });

    try {
      await axios.post('http://localhost:4000/api/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Course added successfully');
      form.resetFields();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      message.error('Failed to add course');
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
            <li><a href="/Ajoutercour" className="block font-semibold hover:text-purple-600 transition-colors duration-300">Add Courses</a></li>
            <li><a href="/cours/:id" className="block font-semibold hover:text-purple-600 transition-colors duration-300">Course Details</a></li>
            <li><a href="/getcours" className="block font-semibold hover:text-purple-600 transition-colors duration-300">Course List</a></li>
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
          Add a <span className="text-purple-600">New Course</span>
        </motion.h2>

        <motion.div
  variants={fadeIn('up', 0.3)}
  initial="hidden"
  whileInView="show"
  viewport={{ once: false, amount: 0.1 }}
  className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl mx-auto my-8"
>
  <Form
    form={form}
    onFinish={onFinish}
    layout="vertical"
    className="grid gap-6" // Changement ici pour utiliser grid
  >
    {/* Machine Image Upload */}
    <div className="col-span-full"> {/* Force le plein width */}
      <Form.Item
        name="machineImage"
        label={<span className="text-gray-800 font-medium text-lg">Course Image <span className="text-red-500">*</span></span>}
        rules={[{ required: true, message: 'Course image is required' }]}
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList || []}
      >
        <Upload
          listType="picture-card"
          beforeUpload={() => false}
          maxCount={1}
          className="w-full h-40 flex items-center justify-center" // Taille fixe pour l'upload
        >
          <div className="flex flex-col items-center text-purple-600 p-4">
            <PlusOutlined className="text-3xl" />
            <div className="mt-2 text-base">Upload</div>
          </div>
        </Upload>
      </Form.Item>
    </div>

    {/* Course Name */}
    <div className="col-span-full">
      <Form.Item
        label={<span className="text-gray-800 font-medium text-lg">Course Name <span className="text-red-500">*</span></span>}
        name="nom"
        rules={[{ required: true, message: 'Please enter the course name' }]}
      >
        <Input
          className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600 h-12 text-lg px-4"
          placeholder="Enter course name"
        />
      </Form.Item>
    </div>

    {/* Description */}
    <div className="col-span-full">
      <Form.Item
        label={<span className="text-gray-800 font-medium text-lg">Description <span className="text-red-500">*</span></span>}
        name="description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <Input.TextArea
          rows={5}
          className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600 text-lg p-4"
          placeholder="Describe the course"
        />
      </Form.Item>
    </div>

    {/* Deux champs côte à côte */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-full">
      {/* Required Skills */}
      <div className="col-span-1">
        <Form.Item
          label={<span className="text-gray-800 font-medium text-lg">Required Skills</span>}
          name="requiredSkills"
        >
          <Select
            mode="tags"
            placeholder="Skills (JavaScript, Python)"
            className="w-full text-lg h-12"
            tokenSeparators={[',']}
            dropdownStyle={{ zIndex: 2000 }}
          />
        </Form.Item>
      </div>

      {/* Price */}
      <div className="col-span-1">
        <Form.Item
          label={<span className="text-gray-800 font-medium text-lg">Price ($) <span className="text-red-500">*</span></span>}
          name="price"
          rules={[
            { required: true, message: 'Please enter the price' },
            { type: 'number', min: 0, message: 'Price must be positive' }
          ]}
        >
          <InputNumber
            min={0}
            className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600 h-12 text-lg"
            placeholder="0.00"
          />
        </Form.Item>
      </div>
    </div>

    {/* File Upload */}
    <div className="col-span-full">
      <Form.Item
        name="file"
        label={<span className="text-gray-800 font-medium text-lg">Course Files <span className="text-red-500">*</span></span>}
        rules={[{ required: true, message: 'Please upload files' }]}
        valuePropName="fileList"
        getValueFromEvent={(e) => e?.fileList || []}
      >
        <Upload
          beforeUpload={() => false}
          multiple
          className="w-full"
        >
          <Button
            icon={<UploadOutlined />}
            className="w-full flex items-center justify-center gap-2 rounded-lg border-gray-300 text-purple-600 hover:text-purple-700 hover:border-purple-600 h-12 text-lg"
            size="large"
          >
            Upload Files
          </Button>
        </Upload>
      </Form.Item>
      <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 text-base font-semibold transition-colors duration-200"
              >
                Add Course
              </Button>
    </div>

    {/* Submit Button */}
    
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
            <span>Back to Course List</span>
            <FiArrowRight size={16} />
          </a>
        </motion.div>
      </div>
       <ChatApp/>
    </div>
  );
};

export default Addcourseform;