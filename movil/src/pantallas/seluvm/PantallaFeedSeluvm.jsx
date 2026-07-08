// PantallaFeedSeluvm.jsx
// Feed del Módulo Seleccionado UVM. Ahora es la pantalla raíz del tab "Feed"
// (ya no existe PantallaInicioSeluvm). Por eso este header asume el acceso
// a la credencial digital y el logout, que antes vivían en el hub.
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import TarjetaEvento from '../publico/componentes/feed/TarjetaEvento';
import TarjetaPartido from '../publico/componentes/feed/TarjetaPartido';
import TarjetaAnuncio from '../publico/componentes/feed/TarjetaAnuncio';
import HojaCredencial from './HojaCredencial';
import { useAuth } from '../../contexto/AuthContext';
import { Colors, Typography, FontSize, Spacing } from '../../tema';

export default function PantallaFeedSeluvm() {
  const { cerrarSesion } = useAuth();
  // refCredencial controla el bottom sheet de credencial, igual que
  // antes lo hacía PantallaInicioSeluvm.
  const refCredencial = useRef(null);

  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  const cargarFeed = useCallback(async () => {
    try {
      setError(null);
      // /feed/seluvm: eventos + partidos + anuncios (público Y seluvm), activos.
      const respuesta = await api.get('/feed/seluvm');
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

  // Solo lectura: sin props de admin hacia las tarjetas.
  const renderItem = ({ item }) => {
    if (item.tipo_item === 'evento')  return <TarjetaEvento  item={item} />;
    if (item.tipo_item === 'partido') return <TarjetaPartido item={item} />;
    if (item.tipo_item === 'anuncio') return <TarjetaAnuncio item={item} />;
    return null;
  };

  // "Anuncios" = solo tipo publico. "Anun Sel" = solo tipo seluvm.
  // Por eso el filtro mira item.tipo además de item.tipo_item.
  const itemsFiltrados = items.filter(item => {
    if (filtro === 'todos')       return true;
    if (filtro === 'evento')      return item.tipo_item === 'evento';
    if (filtro === 'partido')     return item.tipo_item === 'partido';
    if (filtro === 'anuncio')     return item.tipo_item === 'anuncio' && item.tipo === 'publico';
    if (filtro === 'anuncio_sel') return item.tipo_item === 'anuncio' && item.tipo === 'seluvm';
    return true;
  });

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

      {/* Header con íconos de credencial y logout */}
      <View style={styles.header}>
        <View style={styles.headerFila}>
          <View>
            <Text style={styles.headerTitulo}>DEPORTES UVM</Text>
            <Text style={styles.headerSubtitulo}>Actividad deportiva universitaria</Text>
          </View>

          <View style={styles.headerIconos}>
            <TouchableOpacity
              onPress={() => refCredencial.current?.expand()}
              style={styles.iconoBoton}
              activeOpacity={0.7}
            >
              <Ionicons name="id-card-outline" size={28} color={Colors.light} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={cerrarSesion}
              style={styles.iconoBoton}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={28} color={Colors.light} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filtros — scroll horizontal: con 5 opciones ya no caben cómodos
          en pantallas angostas (320-375px, ver RNF-05) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}  
        contentContainerStyle={styles.filtros}
      >
        {[
          { key: 'todos',       label: 'Todos' },
          { key: 'evento',      label: 'Eventos' },
          { key: 'partido',     label: 'Partidos' },
          { key: 'anuncio',     label: 'Anuncios' },
          { key: 'anuncio_sel', label: 'Anun Sel' },
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
      </ScrollView>

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

      {/* Bottom sheet de credencial — se dispara desde el ícono de arriba */}
      <HojaCredencial ref={refCredencial} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.light },
  header: {
    backgroundColor: Colors.secondary,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  headerFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitulo: { fontFamily: Typography.heading, fontSize: FontSize.xxl, color: Colors.light, letterSpacing: 2 },
  headerSubtitulo: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.border, marginTop: 2 },
  headerIconos: { flexDirection: 'row', gap: Spacing.sm },
  iconoBoton: { padding: 4 },
  lista: { padding: Spacing.md },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  errorTexto: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.red, textAlign: 'center' },
  vacio: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.secondary, textAlign: 'center' },
  filtrosScroll: {
    flexGrow: 0,           // evita que el ScrollView se estire/colapse raro en el eje vertical
    flexShrink: 0,
    backgroundColor: Colors.white,
  },
  filtros: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 8,
    alignItems: 'center',   // 👈 esto es lo que faltaba
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
  filtroTexto: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.secondary, lineHeight: FontSize.sm * 1.3 },
  filtroTextoActivo: { color: Colors.white },
});