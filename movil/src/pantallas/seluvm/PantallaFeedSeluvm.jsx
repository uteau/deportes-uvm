// PantallaFeedEstudiante.jsx
// Copia de solo-lectura del feed para estudiantes seleccionados.
// Sin lógica de admin, sin botón de login.
// El botón de volver al hub lo provee el Stack header de NavegadorSeluvm.
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import api from '../../api/client';
import TarjetaEvento from '../publico/componentes/feed/TarjetaEvento';
import TarjetaPartido from '../publico/componentes/feed/TarjetaPartido';
import TarjetaAnuncio from '../publico/componentes/feed/TarjetaAnuncio';
import { Colors, Typography, FontSize, Spacing } from '../../tema';

export default function PantallaFeedSeluvm() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  const cargarFeed = useCallback(async () => {
    try {
      setError(null);
      const respuesta = await api.get('/feed');
      setItems(respuesta.data);
    } catch (e) {
      setError('No se pudo cargar el feed. Intenta de nuevo.');
    }
  }, []);

  useEffect(() => {
    cargarFeed().finally(() => setCargando(false));
  }, [cargarFeed]);

  const onRefresh = useCallback(async () => {
    setRefrescando(true);
    await cargarFeed();
    setRefrescando(false);
  }, [cargarFeed]);

  // Sin props de admin: las tarjetas se renderizan en modo solo-lectura
  const renderItem = ({ item }) => {
    if (item.tipo_item === 'evento')  return <TarjetaEvento  item={item} />;
    if (item.tipo_item === 'partido') return <TarjetaPartido item={item} />;
    if (item.tipo_item === 'anuncio') return <TarjetaAnuncio item={item} />;
    return null;
  };

  const itemsFiltrados = filtro === 'todos'
    ? items
    : items.filter(item => item.tipo_item === filtro);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.errorTexto}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>

      {/* Header propio de la pantalla — el botón volver viene del Stack */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>DEPORTES UVM</Text>
        <Text style={styles.headerSubtitulo}>Actividad deportiva universitaria</Text>
      </View>

      {/* Filtros de tipo de publicación */}
      <View style={styles.filtros}>
        {[
          { key: 'todos',   label: 'Todos' },
          { key: 'evento',  label: 'Eventos' },
          { key: 'partido', label: 'Partidos' },
          { key: 'anuncio', label: 'Anuncios' },
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFiltro(f.key)}
            style={[styles.filtroBotón, filtro === f.key && styles.filtroBotónActivo]}
          >
            <Text style={[styles.filtroTexto, filtro === f.key && styles.filtroTextoActivo]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista del feed */}
      <FlatList
        data={itemsFiltrados}
        keyExtractor={item => `${item.tipo_item}-${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.centrado}>
            <Text style={styles.vacio}>No hay publicaciones disponibles.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.light },
  header: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  headerTitulo: { fontFamily: Typography.heading, fontSize: FontSize.xxl, color: Colors.light, letterSpacing: 2 },
  headerSubtitulo: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.border, marginTop: 2 },
  filtros: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 8,
  },
  filtroBotón: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filtroBotónActivo: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  filtroTexto: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.secondary },
  filtroTextoActivo: { color: Colors.white },
  lista: { padding: Spacing.md },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  errorTexto: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.red, textAlign: 'center' },
  vacio: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.secondary, textAlign: 'center' },
});