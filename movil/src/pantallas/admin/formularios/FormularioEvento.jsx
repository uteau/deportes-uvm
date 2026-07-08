// FormularioEvento.jsx
// Formulario de creación/edición de Evento.
// Si recibe `evento`, es modo edición (PUT); si no, modo creación (POST).
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../../api/client';
import { Colors, Typography, FontSize, Spacing, Radius } from '../../../tema';

export default function FormularioEvento({ evento, onGuardado, onCancelar }) {
  // Si hay `evento`, precargamos sus datos; si no, arrancamos vacío
  const [nombre, setNombre] = useState(evento?.nombre || '');
  const [descripcion, setDescripcion] = useState(evento?.descripcion || '');
  const [lugar, setLugar] = useState(evento?.lugar || '');
  // fecha como objeto Date para el picker; si es edición, parseamos el ISO existente
  const [fecha, setFecha] = useState(
    evento?.fecha_evento ? new Date(evento.fecha_evento) : new Date()
  );
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  // Formatea la fecha para mostrarla en el botón selector
  const fechaTexto = fecha.toLocaleString('es-CL', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const onCambiarFecha = (event, fechaSeleccionada) => {
    // En Android el picker se cierra solo tras elegir; en iOS queda abierto hasta confirmar
    setMostrarPicker(Platform.OS === 'ios');
    if (fechaSeleccionada) setFecha(fechaSeleccionada);
  };

  const handleGuardar = async () => {
    // Validación mínima en cliente, igual que exige el backend (RF-04)
    if (!nombre.trim() || !lugar.trim()) {
      setError('Nombre y lugar son obligatorios.');
      return;
    }

    setError(null);
    setEnviando(true);

    // Payload con la fecha en formato ISO, igual que espera el DTO del backend
    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      fecha_evento: fecha.toISOString(),
      lugar: lugar.trim(),
    };

    try {
      if (evento) {
        // Modo edición: PUT al evento existente
        await api.put(`/admin/eventos/${evento.id}`, payload);
      } else {
        // Modo creación: POST
        await api.post('/admin/eventos', payload);
      }
      onGuardado(); // avisa al padre que terminó OK, para cerrar el sheet y refrescar el feed
    } catch (e) {
      setError(e.response?.data?.error?.message || 'No se pudo guardar el evento.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{evento ? 'Editar evento' : 'Nuevo evento'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del evento"
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
        numberOfLines={3}
      />

      {/* Selector de fecha y hora */}
      <TouchableOpacity style={styles.input} onPress={() => setMostrarPicker(true)}>
        <Text style={styles.textoFecha}>{fechaTexto}</Text>
      </TouchableOpacity>
      {mostrarPicker && (
        <DateTimePicker
          value={fecha}
          mode="datetime"
          display="default"
          onChange={onCambiarFecha}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Lugar"
        placeholderTextColor={Colors.secondary}
        value={lugar}
        onChangeText={setLugar}
      />

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
  textArea: { minHeight: 70, textAlignVertical: 'top' },
  textoFecha: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.text },
  errorTexto: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.red, marginBottom: Spacing.sm },
  filaBotones: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.sm, marginTop: Spacing.sm },
  botonCancelar: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  botonCancelarTexto: { fontFamily: Typography.body, color: Colors.secondary },
  botonGuardar: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.primary },
  botonDeshabilitado: { opacity: 0.6 },
  botonGuardarTexto: { fontFamily: Typography.bodyBold, color: Colors.white },
});