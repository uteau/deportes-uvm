// HojaCredencial.jsx
// Bottom sheet con la credencial digital del estudiante (RF-19).
// Solo se muestra en pantalla, sin opción de descarga.
import React, { forwardRef, useMemo, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { Colors, Typography, FontSize, Spacing, Radius } from '../../tema';

const HojaCredencial = forwardRef(function HojaCredencial(props, ref) {
  const [credencial, setCredencial] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const snapPoints = useMemo(() => ['55%'], []);

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
    []
  );

  // Carga la credencial una sola vez al montar el componente
  // (el sheet vive montado todo el tiempo en el hub, solo se expande/colapsa)
  useEffect(() => {
    api.get('/seluvm/credencial')
      .then(res => setCredencial(res.data))
      .catch(() => setError('No se pudo cargar la credencial.'))
      .finally(() => setCargando(false));
  }, []);

  const vigente = credencial?.vigente;

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: Colors.white }}
      handleIndicatorStyle={{ backgroundColor: Colors.border }}
    >
      <BottomSheetView style={styles.contenedor}>
        {cargando ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : error ? (
          <Text style={styles.errorTexto}>{error}</Text>
        ) : (
          <View style={styles.tarjetaCredencial}>
            <Ionicons name="shield-checkmark" size={40} color={Colors.orange} />
            <Text style={styles.tituloCredencial}>CREDENCIAL DIGITAL</Text>

            <View style={styles.dato}>
              <Text style={styles.etiqueta}>Nombre</Text>
              <Text style={styles.valor}>{credencial.nombre}</Text>
            </View>

            <View style={styles.dato}>
              <Text style={styles.etiqueta}>N° de identificación</Text>
              <Text style={styles.valor}>{credencial.estudiante_id}</Text>
            </View>

            <View style={styles.dato}>
              <Text style={styles.etiqueta}>Disciplina</Text>
              <Text style={styles.valor}>{credencial.deporte}</Text>
            </View>

            {/* Estado de vigencia con color según corresponda */}
            <View style={[styles.estado, { backgroundColor: vigente ? Colors.orange : Colors.red }]}>
              <Text style={styles.estadoTexto}>{vigente ? 'VIGENTE' : 'VENCIDA'}</Text>
            </View>
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default HojaCredencial;

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: Spacing.lg, alignItems: 'center' },
  errorTexto: { fontFamily: Typography.body, fontSize: FontSize.md, color: Colors.red },
  tarjetaCredencial: { alignItems: 'center', width: '100%' },
  tituloCredencial: {
    fontFamily: Typography.heading, fontSize: FontSize.lg, color: Colors.primary,
    letterSpacing: 1, marginTop: Spacing.sm, marginBottom: Spacing.lg,
  },
  dato: { width: '100%', marginBottom: Spacing.md },
  etiqueta: { fontFamily: Typography.body, fontSize: FontSize.xs, color: Colors.secondary, textTransform: 'uppercase' },
  valor: { fontFamily: Typography.bodyBold, fontSize: FontSize.md, color: Colors.text, marginTop: 2 },
  estado: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.lg, marginTop: Spacing.sm },
  estadoTexto: { fontFamily: Typography.heading, fontSize: FontSize.sm, color: Colors.white, letterSpacing: 1 },
});