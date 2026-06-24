// PantallaLogin.jsx
// Pantalla de inicio de sesión para estudiantes y administradores.
// Tras un login exitoso, el AuthContext actualiza token/rol y
// NavegadorRoot redirige automáticamente al módulo correcto.
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import api from '../../api/client';
import { useAuth } from '../../contexto/AuthContext';
import { Colors, Typography, FontSize, Spacing, Radius } from '../../tema';

export default function PantallaLogin() {
  const { iniciarSesion } = useAuth();

  // Campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // enviando: true mientras esperamos la respuesta del backend (deshabilita el botón)
  const [enviando, setEnviando] = useState(false);

  // error: mensaje a mostrar si el login falla
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    // Validación mínima en cliente antes de llamar a la API
    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setError(null);
    setEnviando(true);

    try {
      // POST /api/auth/login — el backend valida credenciales y devuelve { accessToken, rol }
      const respuesta = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const { accessToken, rol } = respuesta.data;

      // Guarda el token en SecureStore y actualiza el estado global.
      // NavegadorRoot reacciona solo: no hace falta navigation.navigate() aquí.
      await iniciarSesion(accessToken, rol);
    } catch (e) {
      // El backend responde 401 tanto si el email no existe como si la
      // contraseña es incorrecta (RF-01/RF-02: no revelar cuál de las dos falló)
      if (e.response?.status === 401) {
        setError('Credenciales incorrectas.');
      } else {
        setError('No se pudo iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    // KeyboardAvoidingView evita que el teclado tape los inputs en iOS
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.titulo}>DEPORTES UVM</Text>
        <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>

        {/* Input de email */}
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor={Colors.secondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        {/* Input de contraseña */}
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={Colors.secondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Mensaje de error, solo si existe */}
        {error && <Text style={styles.errorTexto}>{error}</Text>}

        {/* Botón de envío — deshabilitado mientras se espera respuesta */}
        <TouchableOpacity
          style={[styles.boton, enviando && styles.botonDeshabilitado]}
          onPress={handleLogin}
          disabled={enviando}
          activeOpacity={0.85}
        >
          {enviando
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.botonTexto}>Ingresar</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  titulo: {
    fontFamily: Typography.heading,
    fontSize: FontSize.xl,
    color: Colors.primary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: Typography.body,
    fontSize: FontSize.md,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  errorTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.red,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  boton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonTexto: {
    fontFamily: Typography.bodyBold,
    fontSize: FontSize.md,
    color: Colors.white,
  },
});