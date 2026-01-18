// src/service/auth.js
import API from './api';
import jwt_decode from 'jwt-decode';

export const register = async (payload) => {
  const response = await API.post('/auth/register', payload);
  return response.data;
};

export const login = async (payload) => {
  const response = await API.post('/auth/login', payload);
  const { token } = response.data;
  localStorage.setItem('token', token);
  const user = jwt_decode(token);
  return { token, ...user };
};

export const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwt_decode(token);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!localStorage.getItem('token');

export const isAdmin = () => {
  const user = getUser();
  return user?.isAdmin === true;
};

export const logout = () => {
  localStorage.removeItem('token');
};


export const getCurrentUserId = () => {
  const user = getUser();
  return user?.id || null;
};
