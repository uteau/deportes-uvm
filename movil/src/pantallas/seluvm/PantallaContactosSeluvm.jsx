// PantallaContactos.jsx
// Lista de contactos relevantes del área de deportes (RF-21).
// Endpoint protegido con JWT de estudiante.
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Linking, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../tema';

export default function PantallaContactos() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);

  const cargarContactos = useCallback(async () => {
    try {
      setError(null);
      const respuesta = await api.get('/contactos');
      setContactos(respuesta.data);
    } catch (e) {
      setError('No se pudieron cargar los contactos.');
    }
  }, []);

  useEffect(() => {
    cargarContactos().finally(() => setCargando(false));
  }, [cargarContactos]);

  const onRefresh = useCallback(async () => {
    setRefrescando(true);
    await cargarContactos();
    setRefrescando(false);
  }, [cargarContactos]);

  const renderItem = ({ item }) => (
    <View style={styles.tarjeta}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      {item.rol ? <Text style={styles.rol}>{item.rol}</Text> : null}

      {item.email ? (
        <TouchableOpacity style={styles.fila} onPress={() => Linking.openURL(`mailto:${item.email}`)}>
          <Ionicons name="mail-outline" size={16} color={Colors.secondary} />
          <Text style={styles.dato}>{item.email}</Text>
        </TouchableOpacity>
      ) : null}

      {item.telefono ? (
        <TouchableOpacity style={styles.fila} onPress={() => Linking.openURL(`tel:${item.telefono}`)}>
          <Ionicons name="call-outline" size={16} color={Colors.secondary} />
          <Text style={styles.dato}>{item.telefono}</Text>
        </TouchableOpacity>
      ) : null}

      {item.descripcion_servicio ? (
        <Text style={styles.descripcion}>{item.descripcion_servicio}</Text>
      ) : null}
    </View>
  );

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      {error ? (
        <View style={styles.centrado}>
          <Text style={styles.errorTexto}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={contactos}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.centrado}>
              <Text style={styles.vacio}>No hay contactos disponibles.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.light },
  lista: { padding: Spacing.md },
  tarjeta: {
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md,
    marginBottom: Spacing.md, ...Shadow.card,
  },
  nombre: { fontFamily: Typography.heading, fontSize: FontSize.md, color: Colors.primary },
  rol: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.secondary, marginBottom: Spacing.xs },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dato: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.text },
  descripcion: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.text, marginTop: Spacing.xs },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  errorTexto: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.red, textAlign: 'center' },
  vacio: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.secondary, textAlign: 'center' },
});