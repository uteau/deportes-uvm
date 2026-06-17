// TarjetaAnuncio.jsx
// Tarjeta para anuncios públicos. Muestra enlace a Instagram si existe.
// En modo admin (esAdmin=true) muestra un menú de opciones (Editar/Eliminar),
// en su propia fila arriba, igual que TarjetaEvento y TarjetaPartido.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../../../tema';

export default function TarjetaAnuncio({ item, esAdmin = false, onEditar, onEliminar }) {
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

      {/* Fila superior: el ⋮ vive en su propia fila, alineado a la derecha,
          igual que en TarjetaEvento y TarjetaPartido */}
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