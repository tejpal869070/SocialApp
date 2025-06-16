import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([
    { email: 'test', password: '123456', username: 'TestUser' },
  ]);

  const login = async (email, password) => { 
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid email or password');
  };

  const signUp = async (email, password, username) => {
    if (users.some((u) => u.email === email)) {
      throw new Error('Email already exists');
    }
    const newUser = { email, password, username };
    setUsers([...users, newUser]);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ login, signUp, logout, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);