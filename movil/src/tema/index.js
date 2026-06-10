// src/theme/index.js
// Sistema de diseño UVM — equivalente móvil del index.css del panel web
// Importa desde cualquier componente: import { Colors, Typography, Spacing } from '../theme';

// ── Paleta institucional UVM ─────────────────────────────────
export const Colors = {
  primary:    '#101820', // fondo oscuro, topbar, headers
  secondary:  '#5B6770', // sidebar en web, elementos secundarios
  red:        '#CC0000', // acciones destructivas, énfasis
  redDark:    '#900000', // hover del rojo
  orange:     '#F5A425', // CTAs destacados
  yellow:     '#F5BE00', // highlights sobre fondo oscuro
  text:       '#4C4E56', // texto general
  white:      '#F7F7F7', // fondos claros de tarjetas
  light:      '#F8F9FA', // fondo general de pantallas
  border:     '#DBE1E5', // bordes y separadores
};

// ── Tipografía ───────────────────────────────────────────────
// Los nombres deben coincidir exactamente con los cargados por useFonts()
export const Typography = {
  heading: 'Oswald_600SemiBold', // títulos y encabezados
  headingRegular: 'Oswald_400Regular',
  body:    'Lato_400Regular',    // texto general
  bodyBold: 'Lato_700Bold',      // texto en negrita
};

// ── Tamaños de fuente ────────────────────────────────────────
export const FontSize = {
  xs:   11,
  sm:   13,
  md:   15,
  lg:   18,
  xl:   22,
  xxl:  28,
};

// ── Espaciado (margin / padding) ─────────────────────────────
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
};

// ── Bordes redondeados ───────────────────────────────────────
export const Radius = {
  sm:  4,
  md:  8,
  lg:  16,
  full: 999, // circular
};

// ── Sombras (tarjetas) ───────────────────────────────────────
// React Native necesita shadowColor/Offset/Opacity/Radius (iOS)
// y elevation (Android)
export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
};