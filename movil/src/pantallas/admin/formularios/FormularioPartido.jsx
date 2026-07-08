// FormularioPartido.jsx
// Formulario de creación/edición de Partido (incluye equipos, marcador y deporte).
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../../api/client';
import { Colors, Typography, FontSize, Spacing, Radius } from '../../../tema';

export default function FormularioPartido({ partido, onGuardado, onCancelar }) {
  // ── Estados del formulario ──
  const [nombre, setNombre] = useState(partido?.nombre || '');
  const [descripcion, setDescripcion] = useState(partido?.descripcion || '');
  const [lugar, setLugar] = useState(partido?.lugar || '');
  const [equipoLocal, setEquipoLocal] = useState(partido?.equipo_local || '');
  const [equipoVisita, setEquipoVisita] = useState(partido?.equipo_visita || '');
  const [resulLocal, setResulLocal] = useState(partido?.resul_local?.toString() || '');
  const [resulVisita, setResulVisita] = useState(partido?.resul_visita?.toString() || '');
  const [fecha, setFecha] = useState(
    partido?.fecha_partido ? new Date(partido.fecha_partido) : new Date()
  );
  const [mostrarPicker, setMostrarPicker] = useState(false);

  // ── Estado para el deporte ──
  const [deportes, setDeportes] = useState([]);
  const [deporteSeleccionado, setDeporteSeleccionado] = useState(null); // objeto completo
  const [modalVisible, setModalVisible] = useState(false);

  // ── Estado de envío ──
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  // ── Cargar deportes ──
  useEffect(() => {
    const cargarDeportes = async () => {
      try {
        const res = await api.get('/admin/deportes');
        setDeportes(res.data);
        // Si estamos editando y el partido tiene deporte, preseleccionarlo
        if (partido?.deporte) {
          const encontrado = res.data.find(d => d.id === partido.deporte.id);
          if (encontrado) setDeporteSeleccionado(encontrado);
        }
      } catch (e) {
        console.error('Error al cargar deportes:', e);
      }
    };
    cargarDeportes();
  }, [partido]);

  // ── Formatear fecha para mostrar ──
  const fechaTexto = fecha.toLocaleString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const onCambiarFecha = (event, fechaSeleccionada) => {
    setMostrarPicker(Platform.OS === 'ios');
    if (fechaSeleccionada) setFecha(fechaSeleccionada);
  };

  // ── Seleccionar deporte desde el modal ──
  const seleccionarDeporte = (deporte) => {
    setDeporteSeleccionado(deporte);
    setModalVisible(false);
  };

  // ── Guardar ──
  const handleGuardar = async () => {
    // Validaciones
    if (!nombre.trim() || !lugar.trim() || !equipoLocal.trim() || !equipoVisita.trim()) {
      setError('Nombre, lugar y ambos equipos son obligatorios.');
      return;
    }
    if (!deporteSeleccionado) {
      setError('Debes seleccionar un deporte.');
      return;
    }

    setError(null);
    setEnviando(true);

    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      fecha_partido: fecha.toISOString(),
      lugar: lugar.trim(),
      equipo_local: equipoLocal.trim(),
      equipo_visita: equipoVisita.trim(),
      deporte_id: deporteSeleccionado.id, // ← se envía el ID del deporte
      resul_local: resulLocal !== '' ? parseInt(resulLocal, 10) : null,
      resul_visita: resulVisita !== '' ? parseInt(resulVisita, 10) : null,
    };

    try {
      if (partido) {
        await api.put(`/admin/partidos/${partido.id}`, payload);
      } else {
        await api.post('/admin/partidos', payload);
      }
      onGuardado();
    } catch (e) {
      setError(e.response?.data?.error?.message || 'No se pudo guardar el partido.');
    } finally {
      setEnviando(false);
    }
  };

  // ── Render ──
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{partido ? 'Editar partido' : 'Nuevo partido'}</Text>

      {/* Nombre */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del partido"
        placeholderTextColor={Colors.secondary}
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Descripción */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción (opcional)"
        placeholderTextColor={Colors.secondary}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={2}
      />

      {/* Fecha */}
      <TouchableOpacity style={styles.input} onPress={() => setMostrarPicker(true)}>
        <Text style={styles.textoFecha}>{fechaTexto}</Text>
      </TouchableOpacity>
      {mostrarPicker && (
        <DateTimePicker value={fecha} mode="datetime" display="default" onChange={onCambiarFecha} />
      )}

      {/* Lugar */}
      <TextInput
        style={styles.input}
        placeholder="Lugar"
        placeholderTextColor={Colors.secondary}
        value={lugar}
        onChangeText={setLugar}
      />

      {/* Deporte - campo que abre el modal */}
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
        <Text style={[styles.textoFecha, !deporteSeleccionado && styles.placeholder]}>
          {deporteSeleccionado ? deporteSeleccionado.nombre : 'Seleccionar deporte'}
        </Text>
      </TouchableOpacity>

      {/* Equipos en fila */}
      <View style={styles.filaDos}>
        <TextInput
          style={[styles.input, styles.mitad]}
          placeholder="Equipo local"
          placeholderTextColor={Colors.secondary}
          value={equipoLocal}
          onChangeText={setEquipoLocal}
        />
        <TextInput
          style={[styles.input, styles.mitad]}
          placeholder="Equipo visita"
          placeholderTextColor={Colors.secondary}
          value={equipoVisita}
          onChangeText={setEquipoVisita}
        />
      </View>

      {/* Marcador en fila */}
      <View style={styles.filaDos}>
        <TextInput
          style={[styles.input, styles.mitad]}
          placeholder="Marcador local (opcional)"
          placeholderTextColor={Colors.secondary}
          value={resulLocal}
          onChangeText={setResulLocal}
          keyboardType="number-pad"
        />
        <TextInput
          style={[styles.input, styles.mitad]}
          placeholder="Marcador visita (opcional)"
          placeholderTextColor={Colors.secondary}
          value={resulVisita}
          onChangeText={setResulVisita}
          keyboardType="number-pad"
        />
      </View>

      {error && <Text style={styles.errorTexto}>{error}</Text>}

      {/* Botones */}
      <View style={styles.filaBotones}>
        <TouchableOpacity style={styles.botonCancelar} onPress={onCancelar}>
          <Text style={styles.botonCancelarTexto}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonGuardar, enviando && styles.botonDeshabilitado]}
          onPress={handleGuardar}
          disabled={enviando}
        >
          <Text style={styles.botonGuardarTexto}>{enviando ? 'Guardando…' : 'Guardar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para seleccionar deporte */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Seleccionar deporte</Text>
            <FlatList
              data={deportes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.opcionDeporte}
                  onPress={() => seleccionarDeporte(item)}
                >
                  <Text style={styles.nombreDeporte}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separador} />}
              ListEmptyComponent={<Text style={styles.vacio}>No hay deportes disponibles</Text>}
            />
            <TouchableOpacity style={styles.botonCerrarModal} onPress={() => setModalVisible(false)}>
              <Text style={styles.botonCerrarTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Estilos ──
const styles = StyleSheet.create({
  contenedor: { padding: Spacing.md },
  titulo: {
    fontFamily: Typography.heading,
    fontSize: FontSize.lg,
    color: Colors.primary,
    marginBottom: Spacing.md,
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
    justifyContent: 'center',
  },
  textArea: { minHeight: 60, textAlignVertical: 'top' },
  textoFecha: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.text },
  placeholder: { color: Colors.secondary },
  filaDos: { flexDirection: 'row', gap: Spacing.sm },
  mitad: { flex: 1 },
  errorTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.red,
    marginBottom: Spacing.sm,
  },
  filaBotones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  botonCancelar: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  botonCancelarTexto: { fontFamily: Typography.body, color: Colors.secondary },
  botonGuardar: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  botonDeshabilitado: { opacity: 0.6 },
  botonGuardarTexto: { fontFamily: Typography.bodyBold, color: Colors.white },

  // ── Estilos del modal ──
  modalFondo: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: Spacing.md,
  },
  modalContenido: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    maxHeight: '70%',
  },
  modalTitulo: {
    fontFamily: Typography.heading,
    fontSize: FontSize.lg,
    color: Colors.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  opcionDeporte: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm },
  nombreDeporte: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.text },
  separador: { height: 1, backgroundColor: Colors.border },
  vacio: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.secondary, textAlign: 'center', padding: Spacing.md },
  botonCerrarModal: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  botonCerrarTexto: { fontFamily: Typography.bodyBold, color: Colors.white },
});