// TarjetaEvento.jsx
// Tarjeta para mostrar un evento deportivo general en el feed
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../../../tema';

export default function TarjetaEvento({ item }) {
  // Formateamos la fecha a formato legible en español
  const fecha = new Date(item.fecha_evento).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.tarjeta}>
      {/* Etiqueta de tipo en la esquina superior izquierda */}
      <View style={[styles.etiqueta, { backgroundColor: Colors.primary }]}>
        <Text style={styles.etiquetaTexto}>EVENTO</Text>
      </View>

      {/* Nombre del evento */}
      <Text style={styles.nombre}>{item.nombre}</Text>

      {/* Fecha y lugar */}
      <Text style={styles.meta}>Fecha: {fecha}</Text>
      <Text style={styles.meta}>Lugar: {item.lugar}</Text>

      {/* Descripción opcional */}
      {item.descripcion ? (
        <Text style={styles.descripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    // Borde izquierdo de color como acento visual
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
  nombre: {
    fontFamily: Typography.heading,
    fontSize: FontSize.lg,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  meta: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.secondary,
    marginBottom: 2,
  },
  descripcion: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
});