import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import NavegadorRoot from './src/navegation/NavegadorRoot';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';

export default function App() {
  return (
    <AuthProvider>
      <NavegadorRoot />
    </AuthProvider>
  );
}

registerRootComponent(App);