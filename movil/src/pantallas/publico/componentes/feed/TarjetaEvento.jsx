// TarjetaEvento.jsx
// Tarjeta para mostrar un evento deportivo general en el feed.
// En modo admin (esAdmin=true) muestra un menú de opciones (Editar/Activar/Desactivar).
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../../../tema';

export default function TarjetaEvento({ item, esAdmin = false, activo, onEditar, onToggleStatus }) {
  const navigation = useNavigation();

  const fecha = new Date(item.fecha_evento).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.tarjeta}>
      {/* Fila superior: círculo de estado, nombre y menú (solo admin) */}
      <View style={styles.filaTitulo}>
        {esAdmin && <View style={[styles.circulo, { backgroundColor: activo ? '#22c55e' : '#ef4444' }]} />}
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

      {/* Contenido tocable: navega al detalle (sin el nombre, ya está arriba) */}
      <TouchableOpacity
        onPress={() => navigation.navigate('DetalleEvento', { id: item.id })}
        activeOpacity={0.85}
      >
        <Text style={styles.meta}>Fecha: {fecha}</Text>
        <Text style={styles.meta}>Lugar: {item.lugar}</Text>
        {item.descripcion ? (
          <Text style={styles.descripcion} numberOfLines={2}>
            {item.descripcion}
          </Text>
        ) : null}
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
  menuTextoEstado: {
    color: Colors.primary,
  },
});