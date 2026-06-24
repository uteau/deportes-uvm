// PantallaInicioSeluvm.jsx
// Hub principal del Módulo Seleccionado UVM.
// Cards de acceso a Feed, Anuncios SelUVM y Contactos.
// Header con ícono de credencial (abre HojaCredencial) y logout.
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import HojaCredencial from './HojaCredencial';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../tema';

// Definición de las cards del hub
const CARDS = [
  {
    key: 'feed',
    titulo: 'Feed deportivo',
    descripcion: 'Eventos, partidos y novedades del área de deportes.',
    icono: 'newspaper-outline',
    pantalla: 'FeedEstudiante',
  },
  {
    key: 'anuncios',
    titulo: 'Anuncios SelUVM',
    descripcion: 'Información exclusiva para deportistas seleccionados.',
    icono: 'megaphone-outline',
    pantalla: 'AnunciosSeluvm',
  },
  {
    key: 'contactos',
    titulo: 'Contactos',
    descripcion: 'Contactos del área de deportes UVM.',
    icono: 'people-outline',
    pantalla: 'Contactos',
  },
];

export default function PantallaInicioSeluvm() {
  const navigation = useNavigation();
  const { cerrarSesion } = useAuth();
  const refCredencial = useRef(null);

  return (
    <View style={styles.contenedor}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerFila}>
          <View>
            <Text style={styles.headerTitulo}>SELECCIONADOS UVM</Text>
            <Text style={styles.headerSubtitulo}>Módulo exclusivo para deportistas</Text>
          </View>

          <View style={styles.headerIconos}>
            {/* Ícono de credencial: abre el bottom sheet */}
            <TouchableOpacity
              onPress={() => refCredencial.current?.expand()}
              style={styles.iconoBoton}
              activeOpacity={0.7}
            >
              <Ionicons name="id-card-outline" size={26} color={Colors.light} />
            </TouchableOpacity>

            {/* Ícono de logout */}
            <TouchableOpacity
              onPress={cerrarSesion}
              style={styles.iconoBoton}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={26} color={Colors.light} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Cards de acceso */}
      <ScrollView contentContainerStyle={styles.lista}>
        {CARDS.map(card => (
          <TouchableOpacity
            key={card.key}
            style={styles.card}
            onPress={() => navigation.navigate(card.pantalla)}
            activeOpacity={0.85}
          >
            <View style={styles.cardIcono}>
              <Ionicons name={card.icono} size={28} color={Colors.orange} />
            </View>
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>{card.titulo}</Text>
              <Text style={styles.cardDescripcion}>{card.descripcion}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.border} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom sheet de credencial */}
      <HojaCredencial ref={refCredencial} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.light },
  header: {
    backgroundColor: Colors.secondary,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  headerFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitulo: { fontFamily: Typography.heading, fontSize: FontSize.xl, color: Colors.light, letterSpacing: 2 },
  headerSubtitulo: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.border, marginTop: 2 },
  headerIconos: { flexDirection: 'row', gap: Spacing.sm },
  iconoBoton: { padding: 4 },
  lista: { padding: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadow.card,
  },
  cardIcono: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTexto: { flex: 1 },
  cardTitulo: { fontFamily: Typography.heading, fontSize: FontSize.md, color: Colors.primary },
  cardDescripcion: { fontFamily: Typography.body, fontSize: FontSize.sm, color: Colors.secondary, marginTop: 2 },
});