// HojaFormulario.jsx
// Bottom sheet único que decide qué formulario mostrar según `tipo`.
// Se controla desde afuera con una ref (forwardRef) para abrir/cerrar.
import React, { forwardRef, useMemo, useCallback } from 'react';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import FormularioEvento from './formularios/FormularioEvento';
import FormularioPartido from './formularios/FormularioPartido';
import FormularioAnuncio from './formularios/FormularioAnuncio';
import { Colors } from '../../tema';

// forwardRef permite que PantallaFeed controle abrir/cerrar el sheet
// llamando métodos sobre la ref (ref.current.expand(), ref.current.close())
const HojaFormulario = forwardRef(function HojaFormulario(
  { tipo, item, tipoAnuncioNuevo, onGuardado, onCancelar },
  ref
) {
  // Snap points: el sheet ocupa el 75% de la pantalla al abrirse
  const snapPoints = useMemo(() => ['75%'], []);

  // Backdrop oscuro detrás del sheet; al tocarlo se cierra
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  // Decide qué formulario renderizar según el tipo solicitado
  const renderFormulario = () => {
    if (tipo === 'evento') {
      return <FormularioEvento evento={item} onGuardado={onGuardado} onCancelar={onCancelar} />;
    }
    if (tipo === 'partido') {
      return <FormularioPartido partido={item} onGuardado={onGuardado} onCancelar={onCancelar} />;
    }
    if (tipo === 'anuncio') {
      return (
        <FormularioAnuncio
          anuncio={item}
          tipoInicial={tipoAnuncioNuevo}
          onGuardado={onGuardado}
          onCancelar={onCancelar}
        />
      );
    }
    return null;
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1} // -1 = cerrado al montar
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: Colors.white }}
      handleIndicatorStyle={{ backgroundColor: Colors.border }}
    >
      <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {renderFormulario()}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default HojaFormulario;