// TarjetaPartido.jsx
// Tarjeta para partidos. Extiende TarjetaEvento mostrando equipos y marcador.
// En modo admin (esAdmin=true) muestra un menú de opciones (Editar/Eliminar).
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../../../tema';

export default function TarjetaPartido({ item, esAdmin = false, onEditar, onEliminar }) {
  const navigation = useNavigation();

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

      {/* Fila superior: el ⋮ vive fuera del TouchableOpacity de navegación */}
      {esAdmin && (
        <View style={styles.filaMenu}>
          <Menu>
            <MenuTrigger>
              <Ionicons name="ellipsis-vertical" size={20} color={Colors.secondary} />
            </MenuTrigger>
            <MenuOptions customStyles={menuEstilos}>
              <MenuOption onSelect={() => onEditar?.(item)}>
                <Text style={styles.menuTexto}>Editar</Text>
              </MenuOption>
              <MenuOption onSelect={() => onEliminar?.(item)}>
                <Text style={[styles.menuTexto, styles.menuTextoEliminar]}>Eliminar</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      )}

      {/* Contenido tocable: navega al detalle */}
      <TouchableOpacity
        onPress={() => navigation.navigate('DetallePartido', { id: item.id })}
        activeOpacity={0.85}
      >
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
      </TouchableOpacity>
    </View>
  );
}

// Estilos custom para el popup del menú
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
  filaMenu: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: -Spacing.xs,
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
  menuTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.text,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuTextoEliminar: {
    color: Colors.red,
  },
});