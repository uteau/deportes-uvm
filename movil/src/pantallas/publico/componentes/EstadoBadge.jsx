// componentes/EstadoBadge.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function EstadoBadge({ activo }) {
  return (
    <View style={[styles.circulo, { backgroundColor: activo ? '#22c55e' : '#ef4444' }]} />
  );
}

const styles = StyleSheet.create({
  circulo: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});