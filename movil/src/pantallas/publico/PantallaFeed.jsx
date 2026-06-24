// PantallaFeed.jsx
// Pantalla del feed. Sirve tanto al módulo público (esAdmin=false)
// como al módulo admin (esAdmin=true), reutilizando el mismo componente.
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import api from '../../api/client';
import TarjetaEvento from './componentes/feed/TarjetaEvento';
import TarjetaPartido from './componentes/feed/TarjetaPartido';
import TarjetaAnuncio from './componentes/feed/TarjetaAnuncio';
import HojaFormulario from '../admin/HojaFormulario';
import { Colors, Typography, FontSize, Spacing } from '../../tema';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { useAuth } from '../../contexto/AuthContext';

export default function PantallaFeed() {
  const navigation = useNavigation();
  const { rol, cerrarSesion } = useAuth();
  const esAdmin = rol === 'admin';

  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  // ── Estado del formulario en el bottom sheet ──────────────────────────────
  // refSheet controla abrir/cerrar el BottomSheet desde fuera del componente
  const refSheet = useRef(null);
  // tipoFormulario: 'evento' | 'partido' | 'anuncio' | null (null = sheet cerrado)
  const [tipoFormulario, setTipoFormulario] = useState(null);
  // itemFormulario: el item a editar, o null si estamos creando uno nuevo
  const [itemFormulario, setItemFormulario] = useState(null);
  // tipoAnuncioNuevo: solo aplica cuando tipoFormulario es 'anuncio' y es creación;
  // indica si el nuevo anuncio será 'publico' o 'seluvm'
  const [tipoAnuncioNuevo, setTipoAnuncioNuevo] = useState('publico');

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

  // ── Abrir el sheet en modo edición ────────────────────────────────────────
  // tipo viene de item.tipo_item ('evento' | 'partido' | 'anuncio')
  const editarItem = (item) => {
    setTipoFormulario(item.tipo_item);
    setItemFormulario(item);
    refSheet.current?.expand();
  };

  // ── Eliminar con confirmación explícita (RF-04/RF-05/RF-06/RF-07) ─────────
  const eliminarItem = (item) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Seguro que quieres eliminar "${item.nombre || item.titulo}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Endpoint admin según el tipo de recurso
              const rutas = {
                evento: `/admin/eventos/${item.id}`,
                partido: `/admin/partidos/${item.id}`,
                anuncio: `/admin/anuncios/${item.id}`,
              };
              await api.delete(rutas[item.tipo_item]);
              // Refresca el feed para que el item eliminado desaparezca de inmediato
              cargarFeed();
            } catch (e) {
              Alert.alert('Error', 'No se pudo eliminar. Intenta de nuevo.');
            }
          },
        },
      ]
    );
  };

  // ── Abrir el sheet en modo creación ───────────────────────────────────────
  // tipo: 'evento' | 'partido' | 'anuncio-publico' | 'anuncio-seluvm'
  const crearPublicacion = (tipo) => {
    setItemFormulario(null); // sin item = modo creación

    if (tipo === 'anuncio-publico' || tipo === 'anuncio-seluvm') {
      setTipoFormulario('anuncio');
      setTipoAnuncioNuevo(tipo === 'anuncio-publico' ? 'publico' : 'seluvm');
    } else {
      setTipoFormulario(tipo);
    }
    refSheet.current?.expand();
  };

  // Se llama cuando el formulario terminó de guardar (POST o PUT exitoso)
  const handleGuardado = () => {
    refSheet.current?.close();
    cargarFeed(); // refresca para mostrar el cambio en el feed
  };

  const handleCancelar = () => {
    refSheet.current?.close();
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

          {esAdmin ? (
            <TouchableOpacity onPress={cerrarSesion} style={styles.botonLogin} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={28} color={Colors.light} />
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
              <MenuOption onSelect={() => crearPublicacion('anuncio-publico')}>
                <Text style={styles.menuTexto}>Nuevo anuncio público</Text>
              </MenuOption>
              <MenuOption onSelect={() => crearPublicacion('anuncio-seluvm')}>
                <Text style={styles.menuTexto}>Nuevo anuncio SelUVM</Text>
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

      {/* Bottom sheet de creación/edición — solo se monta si es admin */}
      {esAdmin && (
        <HojaFormulario
          ref={refSheet}
          tipo={tipoFormulario}
          item={itemFormulario}
          tipoAnuncioNuevo={tipoAnuncioNuevo}
          onGuardado={handleGuardado}
          onCancelar={handleCancelar}
        />
      )}
    </View>
  );
}

const menuCrearEstilos = {
  optionsContainer: { borderRadius: 8, paddingVertical: 4, width: 200 },
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