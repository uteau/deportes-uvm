// TarjetaAnuncio.jsx
// Tarjeta para anuncios públicos. Muestra enlace a Instagram si existe.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../../../tema';

export default function TarjetaAnuncio({ item }) {
  const fecha = new Date(item.fecha_creacion).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Abre el enlace de Instagram en el navegador del dispositivo
  const abrirInstagram = () => {
    if (item.instagram_url) {
      Linking.openURL(item.instagram_url);
    }
  };

  return (
    <View style={styles.tarjeta}>

      {/* Título */}
      <Text style={styles.titulo}>{item.titulo}</Text>

      {/* Contenido con límite de líneas */}
      <Text style={styles.contenido} numberOfLines={3}>
        {item.contenido}
      </Text>

      {/* Footer: fecha e Instagram */}
      <View style={styles.footer}>
        <Text style={styles.fecha}>{fecha}</Text>

        {/* Botón Instagram solo si existe la URL */}
        {item.instagram_url ? (
          <TouchableOpacity onPress={abrirInstagram}>
            <Text style={styles.instagram}>Ver en Instagram →</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    ...Shadow.card,
  },
  etiqueta: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },
  etiquetaTexto: {
    fontFamily: Typography.heading,
    fontSize: FontSize.xs,
    color: Colors.white,
    letterSpacing: 1,
  },
  titulo: {
    fontFamily: Typography.heading,
    fontSize: FontSize.lg,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  contenido: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  fecha: {
    fontFamily: Typography.body,
    fontSize: FontSize.xs,
    color: Colors.secondary,
  },
  instagram: {
    fontFamily: Typography.bodyBold,
    fontSize: FontSize.xs,
    color: Colors.orange,
  },
});