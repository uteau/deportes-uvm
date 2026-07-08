// FormularioAnuncio.jsx
// Formulario de creación/edición de Anuncio (público o seluvm).
// El tipo se fija de antemano (no es editable por el usuario en el form),
// igual que en la versión web: se decide en el menú "Nuevo anuncio".
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../../../api/client';
import { Colors, Typography, FontSize, Spacing, Radius } from '../../../tema';

export default function FormularioAnuncio({ anuncio, tipoInicial, onGuardado, onCancelar }) {
  // tipoInicial llega desde el menú de creación ('publico' | 'seluvm');
  // en modo edición usamos el tipo que ya tenía el anuncio
  const tipo = anuncio?.tipo || tipoInicial;

  const [titulo, setTitulo] = useState(anuncio?.titulo || '');
  const [contenido, setContenido] = useState(anuncio?.contenido || '');
  const [instagramUrl, setInstagramUrl] = useState(anuncio?.instagram_url || '');

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const handleGuardar = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      setError('Título y contenido son obligatorios.');
      return;
    }

    setError(null);
    setEnviando(true);

    const payload = {
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      tipo: tipo,
    };

    // instagram_url solo aplica a anuncios públicos (RF-06)
    if (tipo === 'publico' && instagramUrl.trim()) {
      payload.instagram_url = instagramUrl.trim();
    }

    try {
      if (anuncio) {
        await api.put(`/admin/anuncios/${anuncio.id}`, payload);
      } else {
        await api.post('/admin/anuncios', payload);
      }
      onGuardado();
    } catch (e) {
      // El backend puede devolver un array de mensajes (class-validator) o un objeto error.message
      const mensajes = e.response?.data?.message;
      setError(
        Array.isArray(mensajes) ? mensajes.join('\n') : e.response?.data?.error?.message || 'No se pudo guardar el anuncio.'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>
        {anuncio ? 'Editar' : 'Nuevo'} anuncio {tipo === 'publico' ? 'público' : 'para seleccionados'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor={Colors.secondary}
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Contenido"
        placeholderTextColor={Colors.secondary}
        value={contenido}
        onChangeText={setContenido}
        multiline
        numberOfLines={4}
      />

      {/* El enlace a Instagram solo aplica a anuncios públicos */}
      {tipo === 'publico' && (
        <TextInput
          style={styles.input}
          placeholder="URL de Instagram (opcional)"
          placeholderTextColor={Colors.secondary}
          value={instagramUrl}
          onChangeText={setInstagramUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}

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
    marginBottom: Spacing.sm,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  errorTexto: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.red, marginBottom: Spacing.sm },
  filaBotones: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.sm, marginTop: Spacing.sm },
  botonCancelar: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  botonCancelarTexto: { fontFamily: Typography.body, color: Colors.secondary },
  botonGuardar: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.primary },
  botonDeshabilitado: { opacity: 0.6 },
  botonGuardarTexto: { fontFamily: Typography.bodyBold, color: Colors.white },
});