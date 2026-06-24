// PantallaAnunciosSeluvm.jsx
// Lista de anuncios exclusivos para Seleccionados UVM (RF-20).
// Ordenados por fecha de creación descendente, sin enlace a Instagram
// (eso solo aplica a anuncios públicos).
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import api from '../../api/client';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../tema';

export default function PantallaAnunciosSeluvm() {
  const [anuncios, setAnuncios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);

  const cargarAnuncios = useCallback(async () => {
    try {
      setError(null);
      const respuesta = await api.get('/anuncios/seluvm');
      setAnuncios(respuesta.data);
    } catch (e) {
      setError('No se pudieron cargar los anuncios.');
    }
  }, []);

  useEffect(() => {
    cargarAnuncios().finally(() => setCargando(false));
  }, [cargarAnuncios]);

  const onRefresh = useCallback(async () => {
    setRefrescando(true);
    await cargarAnuncios();
    setRefrescando(false);
  }, [cargarAnuncios]);

  const renderItem = ({ item }) => {
    const fecha = new Date(item.fecha_creacion).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
    return (
      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.contenido}>{item.contenido}</Text>
        <Text style={styles.fecha}>{fecha}</Text>
      </View>
    );
  };

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
          data={anuncios}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.centrado}>
              <Text style={styles.vacio}>No hay anuncios para seleccionados todavía.</Text>
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
    marginBottom: Spacing.md, borderLeftWidth: 4, borderLeftColor: Colors.orange, ...Shadow.card,
  },
  titulo: { fontFamily: Typography.heading, fontSize: FontSize.lg, color: Colors.primary, marginBottom: Spacing.xs },
  contenido: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.text, lineHeight: 20, marginBottom: Spacing.sm },
  fecha: { fontFamily: Typography.body, fontSize: FontSize.xs, color: Colors.secondary },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  errorTexto: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.red, textAlign: 'center' },
  vacio: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.secondary, textAlign: 'center' },
});