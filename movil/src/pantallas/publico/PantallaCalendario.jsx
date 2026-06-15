
import { useCallback, useState } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import api from '../../api/client';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow } from '../../tema';

// ── Configuración de idioma español para el calendario ──────────────────────
// LocaleConfig es el objeto global de react-native-calendars para el idioma
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
  ],
  monthNamesShort: [
    'Ene','Feb','Mar','Abr','May','Jun',
    'Jul','Ago','Sep','Oct','Nov','Dic',
  ],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
};
LocaleConfig.defaultLocale = 'es';

// ── Helpers ─────────────────────────────────────────────────────────────────

// Extrae la fecha en formato YYYY-MM-DD desde un objeto Date o string ISO
// Lo usamos para comparar fechas sin importar la hora
function toDateString(fechaISO) {
  return new Date(fechaISO).toISOString().split('T')[0];
}

// Formatea una fecha ISO a texto legible en español
function formatearFecha(fechaISO) {
  return new Date(fechaISO).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

export default function PantallaCalendario () {
    const navigation = useNavigation();

    // Todos los eventos y partidos cargados desde la API
    const [eventos, setEventos] = useState([]);
    const [partidos, setPartidos] = useState([]);

    // Fecha seleccionada por el usuario en el calendario (string YYYY-MM-DD)
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);

    // Ítems del día seleccionado (mezcla de eventos y partidos)
    const [itemsDia, setItemsDia] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargarDatos = useCallback(async() =>{
        try {
            setError(null);
            // Promise.all ejecuta ambas peticiones al mismo tiempo
            const [resEventos, resPartidos] = await Promise.all([
                api.get('/eventos'),
                api.get('/partidos'),
            ]);
            setEventos(resEventos.data);
            setPartidos(resPartidos.data);
        } catch (error) {
            setError('No se pudo cargar el calendario. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    // Construye el objeto markedDates que react-native-calendars necesita
    // para marcar los días con contenido.
    // Formato esperado: { 'YYYY-MM-DD': { marked: true, dotColor: '...' } }
    const markedDates = useCallback(() => {
        const marcas = {};

        // Marcamos los días con eventos con un punto naranja
        eventos.forEach(ev => {
        const fecha = toDateString(ev.fecha_evento);
        marcas[fecha] = {
            marked: true,
            dotColor: Colors.orange,
        };
        });

        // Marcamos los días con partidos — si ya hay una marca del evento,
        // agregamos un segundo punto (react-native-calendars soporta multi-dot)
        partidos.forEach(p => {
        const fecha = toDateString(p.fecha_partido);
        if (marcas[fecha]) {
            // El día ya tiene un evento: usamos multi-dot para mostrar ambos
            marcas[fecha] = {
            dots: [
                { color: Colors.orange },  // punto por evento
                { color: Colors.red },     // punto por partido
            ],
            };
        } else {
            marcas[fecha] = {
            marked: true,
            dotColor: Colors.red,
            };
        }
        });

        // Si hay un día seleccionado, le agregamos el fondo oscuro encima
        if (diaSeleccionado) {
        marcas[diaSeleccionado] = {
            ...(marcas[diaSeleccionado] || {}),
            selected: true,
            selectedColor: Colors.primary,
        };
        }

        return marcas;
    }, [eventos, partidos, diaSeleccionado]);

    // Al tocar un día en el calendario
    const onDiaPresionado = (dia) => {
        // dia.dateString viene en formato YYYY-MM-DD
        const fecha = dia.dateString;
        setDiaSeleccionado(fecha);

        // Filtramos los eventos y partidos que coinciden con esa fecha
        const eventosDia = eventos
        .filter(ev => toDateString(ev.fecha_evento) === fecha)
        .map(ev => ({ ...ev, tipo_item: 'evento' })); // agregamos tipo para saber qué renderizar

        const partidosDia = partidos
        .filter(p => toDateString(p.fecha_partido) === fecha)
        .map(p => ({ ...p, tipo_item: 'partido' }));

        // Combinamos y ordenamos por hora
        const combinados = [...eventosDia, ...partidosDia].sort((a, b) => {
        const fechaA = new Date(a.fecha_evento || a.fecha_partido);
        const fechaB = new Date(b.fecha_evento || b.fecha_partido);
        return fechaA - fechaB;
        });

        setItemsDia(combinados);
    };

    // Renderiza cada ítem de la lista del día seleccionado
    const renderItem = ({ item }) => {
        const esEvento = item.tipo_item === 'evento';
        const fecha = formatearFecha(esEvento ? item.fecha_evento : item.fecha_partido);

        return (
        <TouchableOpacity
            style={[
            styles.itemDia,
            // Borde izquierdo de color diferente según tipo
            { borderLeftColor: esEvento ? Colors.orange : Colors.red },
            ]}
            onPress={() =>
            // Navegamos a la pantalla de detalle correspondiente
            navigation.navigate(esEvento ? 'DetalleEvento' : 'DetallePartido', { id: item.id })
            }
            activeOpacity={0.85}
        >
            {/* Etiqueta de tipo */}
            <Text style={[
            styles.tipoEtiqueta,
            { color: esEvento ? Colors.orange : Colors.red },
            ]}>
            {esEvento ? 'EVENTO' : 'PARTIDO'}
            </Text>

            <Text style={styles.itemNombre}>{item.nombre}</Text>
            <Text style={styles.itemMeta}>{fecha} · {item.lugar}</Text>

            {/* Para partidos mostramos los equipos */}
            {!esEvento && (
            <Text style={styles.itemEquipos}>
                {item.equipo_local} vs {item.equipo_visita}
            </Text>
            )}
        </TouchableOpacity>
        );
    };

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

    return (
        <View style={styles.contenedor}>

        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.headerTitulo}>CALENDARIO</Text>
            <Text style={styles.headerSubtitulo}>Eventos y partidos deportivos</Text>
        </View>

        {/* Leyenda de colores */}
        <View style={styles.leyenda}>
            <View style={styles.leyendaItem}>
            <View style={[styles.leyendaPunto, { backgroundColor: Colors.orange }]} />
            <Text style={styles.leyendaTexto}>Evento</Text>
            </View>
            <View style={styles.leyendaItem}>
            <View style={[styles.leyendaPunto, { backgroundColor: Colors.red }]} />
            <Text style={styles.leyendaTexto}>Partido</Text>
            </View>
        </View>

        {/* Calendario */}
        <Calendar
            // Objeto de días marcados construido dinámicamente
            markingType="multi-dot"
            markedDates={markedDates()}
            onDayPress={onDiaPresionado}
            // Tema visual alineado con la paleta UVM
            theme={{
            backgroundColor: Colors.white,
            calendarBackground: Colors.white,
            textSectionTitleColor: Colors.secondary,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: Colors.white,
            todayTextColor: Colors.orange,
            dayTextColor: Colors.text,
            textDisabledColor: Colors.border,
            arrowColor: Colors.primary,
            monthTextColor: Colors.primary,
            textMonthFontFamily: Typography.heading,
            textDayFontFamily: Typography.body,
            textDayHeaderFontFamily: Typography.bodyBold,
            textDayFontSize: FontSize.sm,
            textMonthFontSize: FontSize.md,
            }}
        />

        {/* Lista de ítems del día seleccionado */}
        {diaSeleccionado && (
            <FlatList
            data={itemsDia}
            keyExtractor={item => `${item.tipo_item}-${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={
                <View style={styles.vacio}>
                <Text style={styles.vacioTexto}>
                    No hay eventos ni partidos para este día.
                </Text>
                </View>
            }
            />
        )}

        </View>
    );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  header: {
    backgroundColor: Colors.secondary,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  headerTitulo: {
    fontFamily: Typography.heading,
    fontSize: FontSize.xxl,
    color: Colors.white,
    letterSpacing: 2,
  },
  headerSubtitulo: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.border,
    marginTop: 2,
  },
  leyenda: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    gap: Spacing.md,
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  leyendaPunto: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  leyendaTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.xs,
    color: Colors.secondary,
  },
  lista: {
    padding: Spacing.md,
  },
  itemDia: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    ...Shadow.card,
  },
  tipoEtiqueta: {
    fontFamily: Typography.heading,
    fontSize: FontSize.xs,
    letterSpacing: 1,
    marginBottom: 2,
  },
  itemNombre: {
    fontFamily: Typography.heading,
    fontSize: FontSize.md,
    color: Colors.primary,
    marginBottom: 2,
  },
  itemMeta: {
    fontFamily: Typography.body,
    fontSize: FontSize.sm,
    color: Colors.secondary,
  },
  itemEquipos: {
    fontFamily: Typography.bodyBold,
    fontSize: FontSize.sm,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.light,
  },
  vacio: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  vacioTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.md,
    color: Colors.secondary,
    textAlign: 'center',
  },
  errorTexto: {
    fontFamily: Typography.body,
    fontSize: FontSize.md,
    color: Colors.red,
    textAlign: 'center',
  },
});