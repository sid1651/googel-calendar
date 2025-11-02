import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const Login = () => {
    const {login}=useAuth();
    const navigate=useNavigate();


  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential; // Google ID token
    console.log('🟢 Google ID Token:', token);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', { token });
      const {user,jwtToken}=res.data;
      login(user,jwtToken);
      navigate('/calendar');
      alert('Login Successful!');
    } catch (err) {
      console.error('❌ Error:', err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h1>Login with Google</h1>
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />
    </div>
  );
};

export default Login;
