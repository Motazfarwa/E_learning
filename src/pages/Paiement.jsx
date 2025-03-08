import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Form, Input, Alert, Spin, Card } from 'antd';
import axios from 'axios';
import logo from "../assets/51031-removebg-preview.png";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
   const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (values) => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');
    
    try {
      // 1. Create Payment Intent on backend
      const { data: { clientSecret } } = await axios.post('http://localhost:4000/api/create-payment-intent', {
        amount: values.amount * 100, // Convert to cents
        currency: 'usd',
        description: values.description
      });

      // 2. Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: values.name,
            email: values.email
          }
        }
      });

      if (stripeError) throw stripeError;
      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        // 3. Send confirmation to backend
        await axios.post('http://localhost:4000/api/confirm_payment', {
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          metadata: values
        });
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
       {/* Top Navigation */}
   <div className="w-full bg-black shadow-md fixed top-0 left-0 z-50 flex items-center justify-between px-6 py-4">
   <img className="w-13 h-9" src={logo} alt="Logo" />
  
  <div className="cursor-pointer flex flex-col space-y-1" onClick={() => setIsOpen(!isOpen)}>
    <span className={`block w-8 h-1 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
    <span className={`block w-8 h-1 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
    <span className={`block w-8 h-1 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
  </div>
</div>


     {/* Sidebar Navigation */}
    <div className={`fixed top-0 left-0 h-full w-64 bg-black p-6 pb-6 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-64'}`}>
    <ul className="text-white space-y-12">
    <li><a href="/Ajoutercour" className="block hover:text-gray-300 font-bold">Ajouter des cours</a></li>
    <li><a href="/Ajoutercour" className="block hover:text-gray-300 font-bold">Ajouter des cours</a></li>
    <li><a href="/getcours" className="block hover:text-gray-300 font-bold">List des cours</a></li>
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
          <Form layout="vertical" onFinish={handleSubmit}>
            {/* Customer Information */}
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: "email", required: true, message: "Please enter a valid email" }]}
            >
              <Input placeholder="john.doe@example.com" />
            </Form.Item>

            {/* Payment Details */}
            <Form.Item
              label="Amount (USD)"
              name="amount"
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <Input type="number" min="1" step="0.01" placeholder="Enter amount" />
            </Form.Item>

            <Form.Item label="Payment Description" name="description">
              <Input.TextArea placeholder="Enter payment details (optional)" />
            </Form.Item>

            {/* Stripe Card Element */}
            <Form.Item label="Card Details" required>
              <div className="border border-gray-300 p-2 rounded">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": { color: "#aab7c4" },
                      },
                      invalid: { color: "#9e2146" },
                    },
                  }}
                />
              </div>
            </Form.Item>

            {/* Error Message */}
            {error && <Alert message={error} type="error" showIcon className="mb-3" />}

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!stripe || loading}
                block
                className="text-lg font-medium"
              >
                {loading ? <Spin /> : "Pay Now"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default PaymentForm;