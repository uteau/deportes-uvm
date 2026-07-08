// App.js
import { registerRootComponent } from 'expo';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

// Importamos el hook de carga de fuentes y las variantes que usaremos
import { useFonts } from 'expo-font';
import { Oswald_400Regular, Oswald_600SemiBold } from '@expo-google-fonts/oswald';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';

import { AuthProvider } from './src/contexto/AuthContext';
import NavegadorRoot from './src/navegacion/NavegadorRoot';
import { Colors } from './src/tema';
import { MenuProvider } from 'react-native-popup-menu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

function App() {
  // useFonts carga las fuentes de Google Fonts de forma asíncrona.
  // Devuelve [fontsLoaded, error].
  // Hasta que carguen, no renderizamos nada para evitar texto sin fuente.
  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
    Oswald_600SemiBold,
    Lato_400Regular,
    Lato_700Bold,
  });

  // Spinner de carga mientras las fuentes se descargan
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <MenuProvider>
          <AuthProvider>
            <NavegadorRoot />
          </AuthProvider>
        </MenuProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);