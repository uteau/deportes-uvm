// TarjetaAnuncio.jsx
// Tarjeta para anuncios públicos. Muestra enlace a Instagram si existe.
// En modo admin (esAdmin=true) muestra un menú de opciones (Editar/Activar/Desactivar).
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../../../tema';

export default function TarjetaAnuncio({ item, esAdmin = false, activo, onEditar, onToggleStatus }) {
  const fecha = new Date(item.fecha_creacion).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const abrirInstagram = () => {
    if (item.instagram_url) {
      Linking.openURL(item.instagram_url);
    }
  };

  return (
    <View style={styles.tarjeta}>
      {/* Fila superior: círculo de estado, título y menú (solo admin) */}
      <View style={styles.filaTitulo}>
        <View style={[styles.circulo, { backgroundColor: activo ? '#22c55e' : '#ef4444' }]} />
        <Text style={styles.titulo} numberOfLines={1} ellipsizeMode="tail">
          {item.titulo}
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

      {/* Contenido del anuncio (sin el título, ya está arriba) */}
      <Text style={styles.contenido} numberOfLines={3}>
        {item.contenido}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.fecha}>{fecha}</Text>
        {item.instagram_url ? (
          <TouchableOpacity onPress={abrirInstagram}>
            <Text style={styles.instagram}>Ver en Instagram →</Text>
          </TouchableOpacity>
        ) : null}
      </View>
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
  titulo: {
    flex: 1,
    fontFamily: Typography.heading,
    fontSize: FontSize.lg,
    color: Colors.primary,
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