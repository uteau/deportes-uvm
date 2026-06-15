import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator  
} from 'react-native';
import api from '../../api/client';
import { Colors, FontSize, Radius, Spacing, Typography } from '../../tema';

export default function PantallaDetalleEvento({ route }) {
  const id = route.params.id;

  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
      // Cargamos el evento al montar la pantalla
      api.get(`/eventos/${id}`)
      .then(res => setEvento(res.data))
      .catch(err => {
          // 404 o error de red
          if (err.response?.status === 404) {
          setError('Este evento no está disponible.');
          } else {
          setError('No se pudo cargar el evento. Intenta de nuevo.');
          }
      })
      .finally(() => setCargando(false));
  }, [id]); // se vuelve a ejecutar si cambia el id (por si navegamos de un detalle a otro)

  
  if (cargando) {
      return (
      <View style={styles.centrado}>
          <ActivityIndicator size="large" color={Colors.light} />
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

  const fechaHora = new Date(evento.fecha_evento);
  const fecha = fechaHora.toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
  });
  const hora = fechaHora.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
  
  return (
      <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>
        <Text style={styles.titulo}>{evento.nombre}</Text>

        {/* Bloque de metadatos */}
        <View style={styles.bloque}>
          <FilaMeta etiqueta="Fecha" valor={fecha} />
          <FilaMeta etiqueta="Hora"  valor={hora} />
          <FilaMeta etiqueta="Lugar" valor={evento.lugar} />
        </View>

        {/* Descripción — solo si existe */}
        {evento.descripcion ? (
          <View style={styles.bloque}>
          <Text style={styles.seccionTitulo}>Descripción</Text>
          <Text style={styles.descripcion}>{evento.descripcion}</Text>
            </View>
        ) : null}
      </ScrollView>
  )
}

// Componente interno reutilizable para mostrar etiqueta + valor en una fila
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