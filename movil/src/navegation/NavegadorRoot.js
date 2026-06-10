import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from "../context/AuthContext";

function NavegadorPublico() {
    const { iniciarSesion } = useAuth();
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/* Feed publico */}
        </View>
    )
}

function NavegadorSeluvm() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/* credencial y anucios seluv m*/}
        </View>
    )
}

function NavegadorAdmin() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/* admin movil */}
        </View>
    )
}

export default function NavegadorRoot() {
  // Leemos el estado global de autenticación
  const { token, rol, loading } = useAuth();

  // Mientras cargamos la sesión desde SecureStore, mostramos un spinner
  // Esto evita el parpadeo entre "no hay sesión" y "sí hay sesión"
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return(
    <NavigationContainer>
        {/* {sin token -> modulo publico} */}
        {/* {token seluvm -> modulo seluvm} */}
        {/* {token admin -> modulo admin} */}
        {!token && <NavegadorPublico />}
        {token && rol=== 'estudiante' && <NavegadorSeluvm />}
        {token && rol=== 'admin' && <NavegadorAdmin />}
    </NavigationContainer>
  )
}