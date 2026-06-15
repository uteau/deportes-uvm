// PantallaFeed.jsx
// Pantalla principal del módulo público.
// Consume GET /api/feed y renderiza la tarjeta correcta según tipo_item.
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
import TarjetaEvento from './componentes/feed/TarjetaEvento';
import TarjetaPartido from './componentes/feed/TarjetaPartido';
import TarjetaAnuncio from './componentes/feed/TarjetaAnuncio';
import { Colors, Typography, FontSize, Spacing } from '../../tema';

export default function PantallaFeed() {
  // items: array con los elementos del feed mezclados
  const [items, setItems] = useState([]);
  // cargando: true en la primera carga
  const [cargando, setCargando] = useState(true);
  // refrescando: true cuando el usuario hace pull-to-refresh
  const [refrescando, setRefrescando] = useState(false);
  // error: mensaje de error si la petición falla
  const [error, setError] = useState(null);

  // Función que carga el feed desde la API
  const cargarFeed = useCallback(async () => {
    try {
        setError(null);
        const respuesta = await api.get('/feed');
        console.log('Total items:', respuesta.data.length);
        console.log('Primer item:', JSON.stringify(respuesta.data[0], null, 2));
        setItems(respuesta.data);
    } catch (e) {
        console.log('URL base:', process.env.EXPO_PUBLIC_API_URL);
        console.log('Error completo:', e.message);
        console.log('Error response:', e.response?.data);
        console.log('Error status:', e.response?.status);
        setError('No se pudo cargar el feed. Intenta de nuevo.');
    }
  }, []);

  // Carga inicial al montar la pantalla
  useEffect(() => {
    cargarFeed().finally(() => setCargando(false));
  }, [cargarFeed]);

  // Pull-to-refresh: muestra el spinner nativo de refresco
  const onRefresh = useCallback(async () => {
    setRefrescando(true);
    await cargarFeed();
    setRefrescando(false);
  }, [cargarFeed]);

  // Decide qué tarjeta renderizar según el campo tipo_item del backend
  const renderItem = ({ item }) => {
    if (item.tipo_item === 'evento')  return <TarjetaEvento  item={item} />;
    if (item.tipo_item === 'partido') return <TarjetaPartido item={item} />;
    if (item.tipo_item === 'anuncio') return <TarjetaAnuncio item={item} />;
    // Si el backend devuelve un tipo desconocido, no renderizamos nada
    return null;
  };

  // ── Estado para el filtro activo ──────────────────────────-------------------------------------------------
  // 'todos' | 'evento' | 'partido' | 'anuncio'
  const [filtro, setFiltro] = useState('todos');

  // Filtra los items según la pestaña seleccionada
  const itemsFiltrados = filtro === 'todos'
    ? items
    : items.filter(item => item.tipo_item === filtro);

  // Pantalla de carga inicial
  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={Colors.light} />
      </View>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.errorTexto}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      {/* Header de la pantalla */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>DEPORTES UVM</Text>
        <Text style={styles.headerSubtitulo}>Actividad deportiva universitaria</Text>
      </View>
      
      {/* Barra de filtros horizontales */}
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
            style={[
              styles.filtroBotón,
              filtro === f.key && styles.filtroBotónActivo,
            ]}
          >
            <Text style={[
              styles.filtroTexto,
              filtro === f.key && styles.filtroTextoActivo,
            ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista del feed */}
      <FlatList
        data={itemsFiltrados}
        keyExtractor={(item) => `${item.tipo_item}-${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        // Pull-to-refresh nativo
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        // Mensaje cuando no hay contenido
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
  contenedor: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  header: {
    backgroundColor: Colors.secondary,
    paddingTop: 56, // espacio para la status bar
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  headerTitulo: {
    fontFamily: Typography.heading,
    fontSize: FontSize.xxl,
    color: Colors.light,
    letterSpacing: 2,
  },
  headerSubtitulo: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.border,
    marginTop: 2,
  },
  lista: {
    padding: Spacing.md,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.md,
    color: Colors.red,
    textAlign: 'center',
  },
  vacio: {
    fontFamily: Typography.body,
    fontSize: FontSize.md,
    color: Colors.secondary,
    textAlign: 'center',
  },
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
  filtroBotónActivo: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  filtroTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.secondary,
  },
  filtroTextoActivo: {
    color: Colors.white,
  },
});