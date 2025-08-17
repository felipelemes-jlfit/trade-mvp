import React from 'react';
import { View, Button } from 'react-native';
import { PhotoField } from '../types';
const fields: { key: PhotoField; label: string }[] = [
  { key: 'PRECO_INTEGRAL', label: 'Preços – Integralmédica' },
  { key: 'MIX_PRATELEIRAS', label: 'Mix – Prateleiras' },
  { key: 'MIX_CHECKOUT', label: 'Mix – Checkout' },
  { key: 'MIX_GELADEIRA', label: 'Mix – Geladeira' },
  { key: 'MIX_PONTO_EXTRA', label: 'Mix – Pontos Extras' },
  { key: 'PLANOGRAMA_PRATELEIRAS', label: 'Planograma – Prateleiras' },
];
export default function FieldPicker({ onPick }: { onPick: (f: PhotoField) => void }) {
  return (<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
    {fields.map(f => (<View key={f.key} style={{ margin: 4 }}><Button title={f.label} onPress={() => onPick(f.key)} /></View>))}
  </View>);
}