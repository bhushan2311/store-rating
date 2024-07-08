import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Form = styled.form`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const {setStoreOwnerData, setUserData} = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url;
      if (role === 'user') {
        url = 'http://localhost:5000/auth/login';
      } 
      else if (role === 'store owner') {
        url = 'http://localhost:5000/store/login';
      } 
      else if (role === 'admin') {
        url = 'http://localhost:5000/admin/login';
      }
      const response = await axios.post(url, { email, password, role });

      const { token, user } = response.data;
      console.log(user, token);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      
      // Navigate based on role
      if (user.role === 'admin') navigate('/admin-dashboard');

      else if (user.role === 'storeOwner'){ 
        // setStoreOwnerData(response.data.storeOwnerData);
        localStorage.setItem('storeOwnerData', JSON.stringify(response.data.storeOwnerData));
        navigate('/store-owner-dashboard');
      }

      else {
        // setUserData(user);
        localStorage.setItem('userData', JSON.stringify(user));
        navigate('/user-dashboard')
      };
    } catch (error) {
      alert("Invalid credentials");
      console.error('Error signing in', error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Sign In</Title>
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="store owner">Store Owner</option>
          <option value="admin">Admin</option>
        </Select>
        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <Button type="submit">Sign In</Button>
        <p>New user? <Link to="/signup">Sign Up</Link></p>
      </Form>
    </Container>
  );
};

export default SignIn;
