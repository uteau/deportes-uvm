// TarjetaPartido.jsx
// Tarjeta para partidos. Extiende TarjetaEvento mostrando equipos y marcador.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../../../tema';

export default function TarjetaPartido({ item }) {
  const fecha = new Date(item.fecha_partido).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Determinamos si el partido ya tiene resultado registrado
  const tieneResultado = item.resul_local !== null && item.resul_visita !== null;

  return (
    <View style={styles.tarjeta}>
      {/* Etiqueta */}
      <View style={[styles.etiqueta, { backgroundColor: Colors.red }]}>
        <Text style={styles.etiquetaTexto}>PARTIDO</Text>
      </View>

      {/* Nombre del partido */}
      <Text style={styles.nombre}>{item.nombre}</Text>

      {/* Equipos y marcador */}
      <View style={styles.marcadorContainer}>
        {/* Equipo local */}
        <Text style={styles.equipo} numberOfLines={1}>
          {item.equipo_local}
        </Text>

        {/* Marcador o "VS" si no hay resultado */}
        <View style={styles.marcadorCentro}>
          {tieneResultado ? (
            <Text style={styles.marcador}>
              {item.resul_local} — {item.resul_visita}
            </Text>
          ) : (
            <Text style={styles.vs}>VS</Text>
          )}
        </View>

        {/* Equipo visita */}
        <Text style={[styles.equipo, styles.equipoVisita]} numberOfLines={1}>
          {item.equipo_visita}
        </Text>
      </View>

      {/* Fecha y lugar */}
      <Text style={styles.meta}>Fecha: {fecha}</Text>
      <Text style={styles.meta}>Lugar: {item.lugar}</Text>
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
    borderLeftColor: Colors.red,
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
    marginBottom: Spacing.sm,
  },
  marcadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  equipo: {
    fontFamily: Typography.bodyBold,
    fontSize: FontSize.sm,
    color: Colors.text,
    flex: 1,
    textAlign: 'left',
  },
  equipoVisita: {
    textAlign: 'right',
  },
  marcadorCentro: {
    paddingHorizontal: Spacing.sm,
  },
  marcador: {
    fontFamily: Typography.heading,
    fontSize: FontSize.lg,
    color: Colors.primary,
  },
  vs: {
    fontFamily: Typography.heading,
    fontSize: FontSize.md,
    color: Colors.secondary,
  },
  meta: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.secondary,
    marginBottom: 2,
  },
});