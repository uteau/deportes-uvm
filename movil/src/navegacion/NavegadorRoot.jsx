import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import { useAuth } from "../contexto/AuthContext";
import { Colors } from '../tema';

import PantallaFeed from '../pantallas/publico/PantallaFeed';
import PantallaDetalleEvento from '../pantallas/publico/PantallaDetalleEvento';
import PantallaDetallePartido from '../pantallas/publico/PantallaDetallePartido';
import PantallaCalendario from '../pantallas/publico/PantallaCalendario';
import PantallaLogin from '../pantallas/publico/PantallaLogin';
import PantallaInicioSeluvm from '../pantallas/seluvm/PantallaInicioSeluvm';
import PantallaContactos from '../pantallas/seluvm/PantallaContactosSeluvm';
import PantallaAnunciosSeluvm from '../pantallas/seluvm/PantallaAnunciosSeluvm';
import PantallaFeedSeluvm from '../pantallas/seluvm/PantallaFeedSeluvm';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabsPublico() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                // Ícono según la pestaña activa o inactiva
                tabBarIcon: ({ focused, color, size }) => {
                    const iconos = {
                        Feed:       focused ? 'home'           : 'home-outline',
                        Calendario: focused ? 'calendar'       : 'calendar-outline',
                    };
                    return <Ionicons name={iconos[route.name]} size={size} color={color} />;
                },
                // Paleta UVM para el tab bar
                tabBarStyle:            { backgroundColor: Colors.secondary },
                tabBarActiveTintColor:  Colors.white,
                tabBarInactiveTintColor: Colors.primary,
                tabBarLabelStyle:       { fontFamily: 'Lato_400Regular', fontSize: 11 },
            })}
        >
            <Tab.Screen name="Feed"       component={PantallaFeed} />
            <Tab.Screen name="Calendario" component={PantallaCalendario} />
        </Tab.Navigator>
    );
}

function NavegadorPublico() {
    const { iniciarSesion } = useAuth();
    return (
        <Stack.Navigator screenOptions={{ headerShown : false }}>
            <Stack.Screen name="TabsPublico" component={TabsPublico} />
            <Stack.Screen 
                name="DetalleEvento"
                component={PantallaDetalleEvento}
                options={{
                    headerShown: true,
                    title: 'Evento',
                    headerBackTitle: 'Volver',
                    headerStyle: { backgroundColor: Colors.secondary , height : 100},
                    headerTintColor: Colors.white,       // color del texto y flecha de volver
                    headerTitleStyle: { fontFamily: 'Oswald_400Regular' , fontSize: 20},
                }}
            /><Stack.Screen 
                name="DetallePartido"
                component={PantallaDetallePartido}
                options={{
                    headerShown: true,
                    title: 'Partido',
                    headerBackTitle: 'Volver',
                    headerStyle: { backgroundColor: Colors.secondary , height : 100},
                    headerTintColor: Colors.white,       // color del texto y flecha de volver
                    headerTitleStyle: { fontFamily: 'Oswald_400Regular' , fontSize: 20},
                }}
            />
            <Stack.Screen
                name="Login"
                component={PantallaLogin}
                options={{
                    headerShown: true,
                    title: 'Iniciar sesión',
                    headerBackTitle: 'Volver',
                    headerStyle: { backgroundColor: Colors.secondary , height : 100},
                    headerTintColor: Colors.white,
                    headerTitleStyle: { fontFamily: 'Oswald_400Regular' , fontSize: 20},
                }}
            />
        </Stack.Navigator>
    )
}

function NavegadorSeluvm() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Hub principal */}
            <Stack.Screen name="InicioSeluvm" component={PantallaInicioSeluvm} />

            {/* Pantallas internas con header de vuelta */}
            <Stack.Screen
                name="AnunciosSeluvm"
                component={PantallaAnunciosSeluvm}
                options={{
                headerShown: true,
                title: 'Anuncios SelUVM',
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: Colors.white,
                headerTitleStyle: { fontFamily: 'Oswald_400Regular' },
                }}
            />
            <Stack.Screen
                name="Contactos"
                component={PantallaContactos}
                options={{
                headerShown: true,
                title: 'Contactos',
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: Colors.white,
                headerTitleStyle: { fontFamily: 'Oswald_400Regular' },
                }}
            />
            <Stack.Screen
            name="FeedEstudiante"
            component={PantallaFeedSeluvm}
            options={{
                headerShown: true,
                title: 'Feed deportivo',
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: Colors.white,
                headerTitleStyle: { fontFamily: 'Oswald_400Regular' },
            }}
            />
        </Stack.Navigator>
    );
}

function TabsAdmin() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    return <Ionicons name={'home'} size={size} color={color} />;
                },
                tabBarStyle: { backgroundColor: Colors.secondary },
                tabBarActiveTintColor: Colors.white,
                tabBarInactiveTintColor: Colors.primary,
            }}
            >
            <Tab.Screen name="Feed" component={PantallaFeed} />
        </Tab.Navigator>
    );
}

function NavegadorAdmin() {
  return (
        <Stack.Navigator screenOptions={{ headerShown : false }}>
            <Stack.Screen name="TabsAdmin" component={TabsAdmin} />
            <Stack.Screen 
                name="DetalleEvento"
                component={PantallaDetalleEvento}
                options={{
                    headerShown: true,
                    title: 'Evento',
                    headerBackTitle: 'Volver',
                    headerStyle: { backgroundColor: Colors.secondary , height : 100},
                    headerTintColor: Colors.white,       // color del texto y flecha de volver
                    headerTitleStyle: { fontFamily: 'Oswald_400Regular' , fontSize: 20},
                }}
            />
            <Stack.Screen 
                name="DetallePartido"
                component={PantallaDetallePartido}
                options={{
                    headerShown: true,
                    title: 'Partido',
                    headerBackTitle: 'Volver',
                    headerStyle: { backgroundColor: Colors.secondary , height : 100},
                    headerTintColor: Colors.white,       // color del texto y flecha de volver
                    headerTitleStyle: { fontFamily: 'Oswald_400Regular' , fontSize: 20},
                }}
            />
        </Stack.Navigator>
  );
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