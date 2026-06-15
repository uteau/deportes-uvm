import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from "../contexto/AuthContext";
import {createStackNavigator} from '@react-navigation/stack'
import { Colors } from '../tema';
import PantallaFeed from '../pantallas/publico/PantallaFeed';
import PantallaDetalleEvento from '../pantallas/publico/PantallaDetalleEvento';
import PantallaDetallePartido from '../pantallas/publico/PantallaDetallePartido';
import PantallaCalendario from '../pantallas/publico/PantallaCalendario';

const Stack = createStackNavigator();

function NavegadorPublico() {
    const { iniciarSesion } = useAuth();
    return (
        <Stack.Navigator screenOptions={{ headerShown : false }}>
            <Stack.Screen name="Feed" component={PantallaFeed} />
            <Stack.Screen 
                name="DetalleEvento"
                component={PantallaDetalleEvento}
                options={{
                    headerShown: true,
                    title: 'Evento',
                    headerStyle: { backgroundColor: Colors.secondary },
                    headerTintColor: Colors.white,       // color del texto y flecha de volver
                    headerTitleStyle: { fontFamily: 'Oswald_400Regular' },
                }}
            /><Stack.Screen 
                name="DetallePartido"
                component={PantallaDetallePartido}
                options={{
                    headerShown: true,
                    title: 'Partido',
                    headerStyle: { backgroundColor: Colors.secondary },
                    headerTintColor: Colors.white,       // color del texto y flecha de volver
                    headerTitleStyle: { fontFamily: 'Oswald_400Regular' },
                }}
            />
            <Stack.Screen 
                name="calendario" 
                component={PantallaCalendario}
                options={{
                    headerShown: true,
                    title:'Calendario',
                    headerStyle: { backgroundColor: Colors.secondary },
                    headerTintColor: Colors.white,       // color del texto y flecha de volver
                    headerTitleStyle: { fontFamily: 'Oswald_400Regular' },
                }}
            >
            </Stack.Screen>
        </Stack.Navigator>
    )
}

function NavegadorSeluvm() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.light}}>
            {/* credencial y anucios seluv m*/}
        </View>
    )
}

function NavegadorAdmin() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.light}}>
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color={Colors.light}/>
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