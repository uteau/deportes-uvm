// PantallaDetallePartido.jsx
// Muestra el detalle completo de un partido consumiendo GET /api/partidos/:id
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import api from '../../api/client';
import { Colors, Typography, FontSize, Spacing, Radius } from '../../tema';

export default function PantallaDetallePartido({ route }) {
  const { id } = route.params;

  const [partido, setPartido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/partidos/${id}`)
      .then(res => setPartido(res.data))
      .catch(err => {
        if (err.response?.status === 404) {
          setError('Este partido no está disponible.');
        } else {
          setError('No se pudo cargar el partido. Intenta de nuevo.');
        }
      })
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.errorTexto}>{error}</Text>
      </View>
    );
  }

  const fechaHora = new Date(partido.fecha_partido);
  const fecha = fechaHora.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const hora = fechaHora.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Hay resultado solo si ambos valores son números (no null)
  const tieneResultado =
    partido.resul_local !== null && partido.resul_visita !== null;

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>

      <Text style={styles.titulo}>{partido.nombre}</Text>

      {/* Bloque de marcador — siempre visible, muestra VS o el resultado */}
      <View style={styles.marcadorBloque}>
        <Text style={styles.equipo} numberOfLines={2}>
          {partido.equipo_local}
        </Text>

        <View style={styles.marcadorCentro}>
          {tieneResultado ? (
            // Resultado final
            <>
              <Text style={styles.marcador}>
                {partido.resul_local} — {partido.resul_visita}
              </Text>
              <Text style={styles.resultadoEtiqueta}>Resultado final</Text>
            </>
          ) : (
            // Partido sin resultado aún
            <Text style={styles.vs}>VS</Text>
          )}
        </View>

        <Text style={[styles.equipo, styles.equipoVisita]} numberOfLines={2}>
          {partido.equipo_visita}
        </Text>
      </View>

      {/* Metadatos del partido */}
      <View style={styles.bloque}>
        <FilaMeta etiqueta="Fecha" valor={fecha} />
        <FilaMeta etiqueta="Hora"  valor={hora} />
        <FilaMeta etiqueta="Lugar" valor={partido.lugar} />
      </View>

      {/* Descripción opcional */}
      {partido.descripcion ? (
        <View style={styles.bloque}>
          <Text style={styles.seccionTitulo}>Descripción</Text>
          <Text style={styles.descripcion}>{partido.descripcion}</Text>
        </View>
      ) : null}

    </ScrollView>
  );
}

function FilaMeta({ etiqueta, valor }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  contenido: {
    padding: Spacing.md,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.light,
  },
  titulo: {
    fontFamily: Typography.heading,
    fontSize: FontSize.xxl,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  // Bloque destacado para el enfrentamiento
  marcadorBloque: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  equipo: {
    fontFamily: Typography.bodyBold,
    fontSize: FontSize.sm,
    color: Colors.white,
    flex: 1,
    textAlign: 'left',
  },
  equipoVisita: {
    textAlign: 'right',
  },
  marcadorCentro: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  marcador: {
    fontFamily: Typography.heading,
    fontSize: FontSize.xxl,
    color: Colors.orange,
  },
  resultadoEtiqueta: {
    fontFamily: Typography.body,
    fontSize: FontSize.xs,
    color: Colors.border,
    marginTop: 2,
  },
  vs: {
    fontFamily: Typography.heading,
    fontSize: FontSize.xl,
    color: Colors.border,
  },
  bloque: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  seccionTitulo: {
    fontFamily: Typography.heading,
    fontSize: FontSize.md,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  etiqueta: {
    fontFamily: Typography.bodyBold,
    fontSize: FontSize.sm,
    color: Colors.secondary,
  },
  valor: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  descripcion: {
    fontFamily: Typography.body,
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 22,
  },
  errorTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.md,
    color: Colors.red,
    textAlign: 'center',
  },
});