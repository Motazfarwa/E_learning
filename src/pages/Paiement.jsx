
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Form, Input, Alert, Spin, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/51031-removebg-preview.png';

const API_BASE_URL = 'http://localhost:4000/api';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    if (!stripe || !elements || loading) {
      console.log('Submission blocked: Stripe not loaded or already loading');
      return;
    }

    if (values.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');
<<<<<<< HEAD
=======
    
    try {
      // 1. Create Payment Intent on backend
      const { data: { clientSecret } } = await axios.post('http://localhost:4000/api/create-payment-intent', {
        amount: values.amount * 100, // Convert to cents
        currency: 'usd',
        description: values.description
      });
      console.log('client secret', clientSecret);
>>>>>>> 196da81653af86ca12f9682d46bb5cc04e061311

    try {
      const token = localStorage.getItem('token');
      console.log('JWT Token:', token ? 'Present' : 'Missing');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      // 1. Create Payment Intent
      console.log('Creating Payment Intent with values:', values);
      const response = await axios.post(
        `${API_BASE_URL}/create-payment-intent`,
        {
          amount: values.amount * 100,
          currency: 'usd',
          description: values.description || '',
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
          `${API_BASE_URL}/confirm_payment`,
          {
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            metadata: values,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Confirm Payment Response:', confirmResponse.data);
        setTimeout(() => navigate('/profile'), 3000);
      }
    } catch (err) {
      const errorMessage = err.message || 'Payment failed';
      console.error('Payment error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-2xl font-semibold text-center mb-4">Secure Payment</h2>
        {success ? (
          <Alert
            message="Payment Successful!"
            description="Your transaction has been completed successfully."
            type="success"
            showIcon
          />
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: 'email', required: true, message: 'Please enter a valid email' }]}
            >
              <Input placeholder="john.doe@example.com" />
            </Form.Item>
            <Form.Item
              label="Amount (USD)"
              name="amount"
              rules={[{ required: true, message: 'Please enter amount' }]}
            >
              <Input type="number" min="1" step="0.01" placeholder="Enter amount" />
            </Form.Item>
            <Form.Item label="Payment Description" name="description">
              <Input.TextArea placeholder="Enter payment details (optional)" />
            </Form.Item>
            <Form.Item label="Card Details" required>
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
            {error && <Alert message={error} type="error" showIcon className="mb-3" />}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!stripe || loading}
                block
                className="text-lg font-medium"
              >
                {loading ? <Spin /> : 'Pay Now'}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default PaymentForm;
