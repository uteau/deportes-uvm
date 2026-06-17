// PantallaFeed.jsx
// Pantalla del feed. Sirve tanto al módulo público (esAdmin=false)
// como al módulo admin (esAdmin=true), reutilizando el mismo componente.
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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { useAuth } from '../../contexto/AuthContext';

export default function PantallaFeed() {
  const navigation = useNavigation();
  // rol viene del AuthContext: 'admin' | 'estudiante' | null
  const { rol, cerrarSesion } = useAuth();
  const esAdmin = rol === 'admin';

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

  // Placeholder por ahora: en el Paso C conectamos los formularios reales
  const editarItem = (item) => {
    console.log('Editar', item.tipo_item, item.id);
  };

  // Placeholder por ahora: en el Paso D conectamos la llamada DELETE real
  const eliminarItem = (item) => {
    console.log('Eliminar', item.tipo_item, item.id);
  };

  // Placeholder por ahora: en el Paso C navega al formulario de creación
  const crearPublicacion = (tipo) => {
    console.log('Crear nuevo', tipo);
  };

  // Cada tarjeta recibe esAdmin y los callbacks; solo importan si esAdmin=true
  const renderItem = ({ item }) => {
    const propsAdmin = { esAdmin, onEditar: editarItem, onEliminar: eliminarItem };
    if (item.tipo_item === 'evento')  return <TarjetaEvento  item={item} {...propsAdmin} />;
    if (item.tipo_item === 'partido') return <TarjetaPartido item={item} {...propsAdmin} />;
    if (item.tipo_item === 'anuncio') return <TarjetaAnuncio item={item} {...propsAdmin} />;
    return null;
  };

  const itemsFiltrados = filtro === 'todos'
    ? items
    : items.filter(item => item.tipo_item === filtro);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={Colors.light} />
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
      {/* Header de la pantalla */}
      <View style={styles.header}>
        <View style={styles.headerFila}>
          <View>
            <Text style={styles.headerTitulo}>DEPORTES UVM</Text>
            <Text style={styles.headerSubtitulo}>
              {esAdmin ? 'Panel de administración' : 'Actividad deportiva universitaria'}
            </Text>
          </View>

          {/* Sin sesión: ícono para ir a Login. Con sesión admin: ícono para cerrar sesión */}
          {esAdmin ? (
            <TouchableOpacity
              onPress={cerrarSesion}
              style={styles.botonLogin}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={28} color={Colors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.botonLogin}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle-outline" size={28} color={Colors.light} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Barra de filtros + botón de crear (solo admin) */}
      <View style={styles.filtros}>
        {esAdmin && (
          <Menu>
            <MenuTrigger style={styles.botonCrear}>
              <Ionicons name="add-circle" size={28} color={Colors.primary} />
            </MenuTrigger>
            <MenuOptions customStyles={menuCrearEstilos}>
              <MenuOption onSelect={() => crearPublicacion('evento')}>
                <Text style={styles.menuTexto}>Nuevo evento</Text>
              </MenuOption>
              <MenuOption onSelect={() => crearPublicacion('partido')}>
                <Text style={styles.menuTexto}>Nuevo partido</Text>
              </MenuOption>
              <MenuOption onSelect={() => crearPublicacion('anuncio')}>
                <Text style={styles.menuTexto}>Nuevo anuncio</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}

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

const menuCrearEstilos = {
  optionsContainer: {
    borderRadius: 8,
    paddingVertical: 4,
    width: 160,
  },
};

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
  botonLogin: { padding: 4 },
  lista: { padding: Spacing.md },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  errorTexto: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.red, textAlign: 'center' },
  vacio: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.secondary, textAlign: 'center' },
  filtros: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 8,
    alignItems: 'center',
  },
  botonCrear: { marginRight: 4 },
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
  menuTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.text,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});