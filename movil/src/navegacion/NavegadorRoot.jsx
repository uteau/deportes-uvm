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
import PantallaContactos from '../pantallas/seluvm/PantallaContactosSeluvm';
import PantallaFeedSeluvm from '../pantallas/seluvm/PantallaFeedSeluvm';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabsPublico() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    const iconos = {
                        Feed:       focused ? 'home'           : 'home-outline',
                        Calendario: focused ? 'calendar'       : 'calendar-outline',
                    };
                    return <Ionicons name={iconos[route.name]} size={size} color={color} />;
                },
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
                    headerTintColor: Colors.white,
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
                    headerTintColor: Colors.white,
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

// ── Módulo Seleccionado UVM ────────────────────────────────────────────────
// Ya no hay pantalla Inicio/hub: el tab "Feed" asume credencial + logout.
function TabsSeluvm() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    const iconos = {
                        Feed:       focused ? 'home'      : 'home-outline',
                        Calendario: focused ? 'calendar'  : 'calendar-outline',
                        Contactos:  focused ? 'people'    : 'people-outline',
                    };
                    return <Ionicons name={iconos[route.name]} size={size} color={color} />;
                },
                tabBarStyle:             { backgroundColor: Colors.secondary },
                tabBarActiveTintColor:   Colors.white,
                tabBarInactiveTintColor: Colors.primary,
                tabBarLabelStyle:        { fontFamily: 'Lato_400Regular', fontSize: 11 },
            })}
        >
            <Tab.Screen name="Feed"       component={PantallaFeedSeluvm} />
            {/* Se reutiliza el mismo componente que el módulo público:
                consume /eventos y /partidos, endpoints ya públicos,
                así que funciona igual estando autenticado. */}
            <Tab.Screen name="Calendario" component={PantallaCalendario} />
            <Tab.Screen name="Contactos"  component={PantallaContactos} />
        </Tab.Navigator>
    );
}

function NavegadorSeluvm() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TabsSeluvm" component={TabsSeluvm} />

            {/* Las tarjetas del feed navegan a estas rutas por nombre
                (ver TarjetaEvento/TarjetaPartido), así que deben existir
                en este mismo Stack, igual que en NavegadorPublico. */}
            <Stack.Screen
                name="DetalleEvento"
                component={PantallaDetalleEvento}
                options={{
                    headerShown: true,
                    title: 'Evento',
                    headerBackTitle: 'Volver',
                    headerStyle: { backgroundColor: Colors.secondary , height : 100},
                    headerTintColor: Colors.white,
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
                    headerTintColor: Colors.white,
                    headerTitleStyle: { fontFamily: 'Oswald_400Regular' , fontSize: 20},
                }}
            />
        </Stack.Navigator>
    );
}

// ── Módulo Admin (sin cambios) ─────────────────────────────────────────────
function TabsAdmin() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    const iconos = {
                        Feed:       focused ? 'home'           : 'home-outline',
                        Calendario: focused ? 'calendar'       : 'calendar-outline',
                    };
                    return <Ionicons name={iconos[route.name]} size={size} color={color} />;
                },
                tabBarStyle:            { backgroundColor: Colors.secondary },
                tabBarActiveTintColor:  Colors.white,
                tabBarInactiveTintColor: Colors.primary,
                tabBarLabelStyle:       { fontFamily: 'Lato_400Regular', fontSize: 11 },
            })}
        >
            <Tab.Screen name="Feed" component={PantallaFeed} />
            <Tab.Screen name="Calendario" component={PantallaCalendario} />
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
                    headerTintColor: Colors.white,
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
                    headerTintColor: Colors.white,
                    headerTitleStyle: { fontFamily: 'Oswald_400Regular' , fontSize: 20},
                }}
            />
        </Stack.Navigator>
  );
}

export default function NavegadorRoot() {
  const { token, rol, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color={Colors.light}/>
      </View>
    );
  }

  return(
    <NavigationContainer>
        {!token && <NavegadorPublico />}
        {token && rol=== 'estudiante' && <NavegadorSeluvm />}
        {token && rol=== 'admin' && <NavegadorAdmin />}
    </NavigationContainer>
  )
}