import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Form, Input, Alert, Spin, Card } from 'antd';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/51031-removebg-preview.png';

const API_BASE_URL = 'http://localhost:4000/api';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  // Get courseId from URL query
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('courseId');

  // Fetch course details
  useEffect(() => {
    if (!courseId) {
      setError('No course specified for payment');
      return;
    }

    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(response.data);
        form.setFieldsValue({ amount: response.data.price });
      } catch (err) {
        setError('Failed to load course details');
        console.error('Error fetching course:', err);
      }
    };

    fetchCourse();
  }, [courseId, form]);

  const handleSubmit = async (values) => {
    if (!stripe || !elements || loading || !course) {
      console.log('Submission blocked: Stripe not loaded, already loading, or no course');
      return;
    }

    if (course.price <= 0) {
      setError('Course is free or has an invalid price');
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

      // 1. Create Payment Intent
      console.log('Creating Payment Intent for course:', courseId);
      const response = await axios.post(
        `${API_BASE_URL}/payments/create-payment-intent`,
        {
          courseId,
          amount: course.price * 100, // Convert to cents
          currency: 'usd',
          description: `Payment for course: ${course.nom}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Create Payment Intent Response:', response.data);
      const { clientSecret } = response.data;
      if (!clientSecret) {
        throw new Error('No clientSecret in response');
      }
      console.log('Client Secret:', clientSecret);

      // 2. Confirm payment
      console.log('Confirming payment with clientSecret:', clientSecret);
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

      console.log('Payment Intent Status:', paymentIntent.status);
      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        form.resetFields();
        // 3. Confirm payment
        console.log('Sending payment confirmation for paymentId:', paymentIntent.id);
        const confirmResponse = await axios.post(
          `${API_BASE_URL}/payments/confirm-payment`,
          {
            paymentId: paymentIntent.id,
            courseId,
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
        console.log('Confirm Payment Response:', confirmResponse.data);
        setTimeout(() => navigate(`/courses/${courseId}`), 3000);
      }
    } catch (err) {
      const errorMessage = err.message || 'Payment failed';
      console.error('Payment error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!course && !error) {
    return <Spin tip="Loading course details..." />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full bg-black shadow-md fixed top-0 left-0 z-50 flex items-center justify-between px-6 py-4">
        <img className="w-13 h-9" src={logo} alt="Logo" />
        <div className="cursor-pointer flex flex-col space-y-1" onClick={() => setIsOpen(!isOpen)}>
          <span
            className={`block w-8 h-1 bg-white transition-transform duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-8 h-1 bg-white transition-opacity duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block w-8 h-1 bg-white transition-transform duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black p-6 pb-6 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        <ul className="text-white space-y-12">
          <li>
            <a href="/Ajoutercour" className="block hover:text-gray-300 font-bold">
              Ajouter des cours
            </a>
          </li>
          <li>
            <a href="/getcours" className="block hover:text-gray-300 font-bold">
              Liste des cours
            </a>
          </li>
        </ul>
      </div>
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Paiement Sécurisé</h2>
        {success ? (
          <Alert
            message="Paiement Réussi !"
            description={`Votre paiement pour "${course?.nom}" a été effectué avec succès. Redirection vers le cours...`}
            type="success"
            showIcon
          />
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
            <Form.Item
              label="Nom Complet"
              name="name"
              rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
            >
              <Input placeholder="John Doe" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: 'email', required: true, message: 'Veuillez entrer un email valide' }]}
            >
              <Input placeholder="john.doe@example.com" className="w-full" />
            </Form.Item>
            <Form.Item label="Cours">
              <Input value={course?.nom} disabled className="w-full" />
            </Form.Item>
            <Form.Item label="Montant (USD)">
              <Input value={course?.price?.toFixed(2)} disabled className="w-full" />
            </Form.Item>
            <Form.Item label="Description du Paiement" name="description">
              <Input.TextArea placeholder="Détails du paiement (facultatif)" className="w-full" />
            </Form.Item>
            <Form.Item label="Détails de la Carte" required>
              <div className="border border-gray-300 p-2 rounded">
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
            {error && <Alert message={error} type="error" showIcon className="mb-4" />}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!stripe || loading || !course}
                block
                className="text-lg font-medium"
              >
                {loading ? <Spin /> : 'Payer Maintenant'}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default PaymentForm;