// FormularioPartido.jsx
// Formulario de creación/edición de Partido (incluye equipos y marcador).
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../../api/client';
import { Colors, Typography, FontSize, Spacing, Radius } from '../../../tema';

export default function FormularioPartido({ partido, onGuardado, onCancelar }) {
  const [nombre, setNombre] = useState(partido?.nombre || '');
  const [descripcion, setDescripcion] = useState(partido?.descripcion || '');
  const [lugar, setLugar] = useState(partido?.lugar || '');
  const [equipoLocal, setEquipoLocal] = useState(partido?.equipo_local || '');
  const [equipoVisita, setEquipoVisita] = useState(partido?.equipo_visita || '');
  // Los resultados se manejan como string en el input; se convierten a int al enviar
  const [resulLocal, setResulLocal] = useState(partido?.resul_local?.toString() || '');
  const [resulVisita, setResulVisita] = useState(partido?.resul_visita?.toString() || '');
  const [fecha, setFecha] = useState(
    partido?.fecha_partido ? new Date(partido.fecha_partido) : new Date()
  );
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const fechaTexto = fecha.toLocaleString('es-CL', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const onCambiarFecha = (event, fechaSeleccionada) => {
    setMostrarPicker(Platform.OS === 'ios');
    if (fechaSeleccionada) setFecha(fechaSeleccionada);
  };

  const handleGuardar = async () => {
    // Validación: nombre, lugar y ambos equipos son obligatorios (RF-05)
    if (!nombre.trim() || !lugar.trim() || !equipoLocal.trim() || !equipoVisita.trim()) {
      setError('Nombre, lugar y ambos equipos son obligatorios.');
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
      // Solo enviamos el marcador si el usuario escribió algo; si no, null
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

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{partido ? 'Editar partido' : 'Nuevo partido'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del partido"
        placeholderTextColor={Colors.secondary}
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción (opcional)"
        placeholderTextColor={Colors.secondary}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={2}
      />

      <TouchableOpacity style={styles.input} onPress={() => setMostrarPicker(true)}>
        <Text style={styles.textoFecha}>{fechaTexto}</Text>
      </TouchableOpacity>
      {mostrarPicker && (
        <DateTimePicker value={fecha} mode="datetime" display="default" onChange={onCambiarFecha} />
      )}

      <TextInput
        style={styles.input}
        placeholder="Lugar"
        placeholderTextColor={Colors.secondary}
        value={lugar}
        onChangeText={setLugar}
      />

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

      {/* Marcador en fila, opcional */}
      <View style={styles.filaDos}>
        <TextInput
          style={[styles.input, styles.mitad]}
          placeholder="Marcador local"
          placeholderTextColor={Colors.secondary}
          value={resulLocal}
          onChangeText={setResulLocal}
          keyboardType="number-pad"
        />
        <TextInput
          style={[styles.input, styles.mitad]}
          placeholder="Marcador visita"
          placeholderTextColor={Colors.secondary}
          value={resulVisita}
          onChangeText={setResulVisita}
          keyboardType="number-pad"
        />
      </View>

      {error && <Text style={styles.errorTexto}>{error}</Text>}

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
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { padding: Spacing.md },
  titulo: { fontFamily: Typography.heading, fontSize: FontSize.lg, color: Colors.primary, marginBottom: Spacing.md },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.text,
    marginBottom: Spacing.sm, justifyContent: 'center',
  },
  textArea: { minHeight: 60, textAlignVertical: 'top' },
  textoFecha: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.text },
  filaDos: { flexDirection: 'row', gap: Spacing.sm },
  mitad: { flex: 1 },
  errorTexto: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.red, marginBottom: Spacing.sm },
  filaBotones: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.sm, marginTop: Spacing.sm },
  botonCancelar: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  botonCancelarTexto: { fontFamily: Typography.body, color: Colors.secondary },
  botonGuardar: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.primary },
  botonDeshabilitado: { opacity: 0.6 },
  botonGuardarTexto: { fontFamily: Typography.bodyBold, color: Colors.white },
});