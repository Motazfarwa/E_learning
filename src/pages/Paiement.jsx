import React, { useState, useEffect, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Form, Input, Button, Alert, Spin, Card, message } from 'antd';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import logo from '../assets/51031-removebg-preview.png';
import { RoleContext } from './RoleContext';
import ChatApp from "./chatboat";

const API_BASE_URL = 'http://localhost:4000/api';

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

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const role = useContext(RoleContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  // Set random background image on load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImg(backgroundImages[randomIndex]);
  }, []);

  const handleSubmit = async (values) => {
    if (!stripe || !elements || loading) {
      console.log('Submission blocked: Stripe not loaded, already loading');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      console.log('JWT Token:', token ? 'Present' : 'Missing');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
      const amountInCents = Math.round(parseFloat(values.amount)) * 100;
      // 1. Create Payment Intent
      const response = await axios.post(
        `${API_BASE_URL}/create-payment-intent`,
        {
          amount: amountInCents, // Convert to cents
          currency: 'usd',
          description: `Payment for course`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const { clientSecret } = response.data;
      if (!clientSecret) {
        throw new Error('No clientSecret in response');
      }

      // 2. Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: values.name,
            email: values.email,
          },
        },
      });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        throw new Error(`Payment failed: ${stripeError.message}`);
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        form.resetFields();
        
        // 3. Confirm payment
        await axios.post(
          `${API_BASE_URL}/confirm_payment`,
          {
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            metadata: {
              name: values.name,
              email: values.email,
              description: values.description,
            },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        message.success('Payment successful!');
      }
    } catch (err) {
      const errorMessage = err.message || 'Payment failed';
      console.error('Payment error:', err);
      setError(errorMessage);
      message.error(errorMessage);
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
          Secure <span className="text-purple-600">Payment</span>
        </motion.h2>

        <motion.div
          variants={fadeIn('up', 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl mx-auto my-8"
        >
          {success ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
              <Button
                type="primary"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-3 text-base font-semibold transition-colors duration-200"
                onClick={() => navigate('/getcours')}
              >
                Back to Courses
              </Button>
            </div>
          ) : (
            <Form form={form} onFinish={handleSubmit} layout="vertical" className="grid gap-6">
              <div className="col-span-full">
                <Form.Item
                  label={<span className="text-gray-800 font-medium text-lg">Full Name <span className="text-red-500">*</span></span>}
                  name="name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600 h-12 text-lg px-4"
                    placeholder="John Doe"
                  />
                </Form.Item>
              </div>

              <div className="col-span-full">
                <Form.Item
                  label={<span className="text-gray-800 font-medium text-lg">Email <span className="text-red-500">*</span></span>}
                  name="email"
                  rules={[{ type: 'email', required: true, message: 'Please enter a valid email' }]}
                >
                  <Input
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600 h-12 text-lg px-4"
                    placeholder="john.doe@example.com"
                  />
                  
                </Form.Item>
              </div>

              <div className="col-span-full">
  <Form.Item
    label={<span className="text-gray-800 font-medium text-lg">Amount (USD) <span className="text-red-500">*</span></span>}
    name="amount"
    rules={[
      { required: true, message: 'Please enter the amount' },
      { 
        validator: (_, value) => 
          value && !isNaN(value) && parseFloat(value) > 0 ? 
          Promise.resolve() : 
          Promise.reject(new Error('Please enter a valid positive number'))
      }
    ]}
  >
    <Input
      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600 h-12 text-lg px-4"
      placeholder="100.00"
      type="number"
      min="1"
      step="0.01"
    />
  </Form.Item>
</div>

              <div className="col-span-full">
                <Form.Item
                  label={<span className="text-gray-800 font-medium text-lg">Payment Description</span>}
                  name="description"
                >
                  <Input.TextArea
                    rows={3}
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600 text-lg p-4"
                    placeholder="Payment details (optional)"
                  />
                </Form.Item>
              </div>

              <div className="col-span-full">
                <Form.Item
                  label={<span className="text-gray-800 font-medium text-lg">Card Details <span className="text-red-500">*</span></span>}
                  required
                >
                  <div className="border border-gray-300 rounded-lg p-4">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': { color: '#aab7c4' },
                          },
                          invalid: { color: '#9e2146' },
                        },
                      }}
                    />
                  </div>
                </Form.Item>
              </div>

              {error && (
                <div className="col-span-full">
                  <Alert message={error} type="error" showIcon />
                </div>
              )}

              <div className="col-span-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={!stripe}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 text-lg font-semibold transition-colors duration-200 h-12"
                >
                  {loading ? <Spin /> : 'Pay Now'}
                </Button>
              </div>
            </Form>
          )}
        </motion.div>

        {/* Back to Courses Link */}
        <motion.div
          variants={fadeIn('up', 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="text-center mt-8"
        >
          <Button
            onClick={() => navigate('/cours')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
          >
            <span>Back to Course List</span>
            <FiArrowRight size={16} />
          </Button>
        </motion.div>
      </div>
      <ChatApp />
    </div>
  );
};

export default PaymentForm;