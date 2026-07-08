// TarjetaPartido.jsx
// Tarjeta para partidos. Extiende TarjetaEvento mostrando equipos y marcador.
// En modo admin (esAdmin=true) muestra un menú de opciones (Editar/Activar/Desactivar).
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../../../tema';

export default function TarjetaPartido({ item, esAdmin = false, activo, onEditar, onToggleStatus }) {
  const navigation = useNavigation();

  const fecha = new Date(item.fecha_partido).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const tieneResultado = item.resul_local !== null && item.resul_visita !== null;

  return (
    <View style={styles.tarjeta}>
      {/* Fila superior: círculo de estado, nombre y menú (solo admin) */}
      <View style={styles.filaTitulo}>
        <View style={[styles.circulo, { backgroundColor: activo ? '#22c55e' : '#ef4444' }]} />
        <Text style={styles.nombre} numberOfLines={1} ellipsizeMode="tail">
          {item.nombre}
        </Text>
        {esAdmin && (
          <Menu>
            <MenuTrigger>
              <Ionicons name="ellipsis-vertical" size={20} color={Colors.secondary} />
            </MenuTrigger>
            <MenuOptions customStyles={menuEstilos}>
              <MenuOption onSelect={() => onEditar?.(item)}>
                <Text style={styles.menuTexto}>Editar</Text>
              </MenuOption>
              <MenuOption onSelect={() => onToggleStatus?.(item)}>
                <Text style={[styles.menuTexto, styles.menuTextoEstado]}>
                  {activo ? 'Desactivar' : 'Activar'}
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>

      {/* Contenido tocable: navega al detalle (sin el nombre) */}
      <TouchableOpacity
        onPress={() => navigation.navigate('DetallePartido', { id: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.marcadorContainer}>
          <Text style={styles.equipo} numberOfLines={1}>{item.equipo_local}</Text>
          <View style={styles.marcadorCentro}>
            {tieneResultado ? (
              <Text style={styles.marcador}>
                {item.resul_local} — {item.resul_visita}
              </Text>
            ) : (
              <Text style={styles.vs}>VS</Text>
            )}
          </View>
          <Text style={[styles.equipo, styles.equipoVisita]} numberOfLines={1}>
            {item.equipo_visita}
          </Text>
        </View>

        <Text style={styles.meta}>Fecha: {fecha}</Text>
        <Text style={styles.meta}>Lugar: {item.lugar}</Text>
      </TouchableOpacity>
    </View>
  );
}

const menuEstilos = {
  optionsContainer: {
    borderRadius: Radius.sm,
    paddingVertical: 4,
    width: 130,
  },
};

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
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  circulo: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  nombre: {
    flex: 1,
    fontFamily: Typography.heading,
    fontSize: FontSize.lg,
    color: Colors.primary,
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
  menuTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.text,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuTextoEstado: {
    color: Colors.primary,
  },
});