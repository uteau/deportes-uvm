// TarjetaEvento.jsx
// Tarjeta para mostrar un evento deportivo general en el feed.
// En modo admin (esAdmin=true) muestra un menú de opciones (Editar/Eliminar).
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../../../tema';

export default function TarjetaEvento({ item, esAdmin = false, onEditar, onEliminar }) {
  const navigation = useNavigation();
  // Formateamos la fecha a formato legible en español
  const fecha = new Date(item.fecha_evento).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.tarjeta}>

      {/* Fila superior: el ⋮ vive fuera del TouchableOpacity de navegación,
          así un toque en el menú no dispara también la navegación al detalle */}
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
        onPress={() => navigation.navigate('DetalleEvento', { id: item.id })}
        activeOpacity={0.85}
      >
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
    // Borde izquierdo de color como acento visual
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    ...Shadow.card,
  },
  filaMenu: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: -Spacing.xs, // compensa el espacio para que no empuje el contenido de más
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