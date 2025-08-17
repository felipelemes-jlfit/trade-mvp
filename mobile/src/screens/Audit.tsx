import React, { useState } from 'react';
import { View, Text, Button, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import FieldPicker from '../components/FieldPicker';
import CameraUploader from '../components/CameraUploader';
import { PhotoField } from '../types';
import { api } from '../api';
export default function Audit({ audit, onClose }: { audit: any; onClose: () => void }) {
  const [currentField, setCurrentField] = useState<PhotoField | null>(null);
  async function finish() {
    const loc = await Location.getCurrentPositionAsync({});
    await api.post(`/audits/${audit.id}/finish`, { lat: loc.coords.latitude, lng: loc.coords.longitude });
    Alert.alert('Concluída', 'Auditoria finalizada'); onClose();
  }
  async function triggerAnalysis() {
    await api.post(`/analysis/${audit.id}/trigger`);
    Alert.alert('OK', 'Análises disparadas. Consulte resultados futuramente.');
  }
  return (<ScrollView style={{ padding: 16 }}>
    <Text style={{ fontSize: 18, fontWeight: '600' }}>Auditoria</Text>
    <Text style={{ marginBottom: 8 }}>ID: {audit.id}</Text>
    <FieldPicker onPick={setCurrentField} />
    {currentField && (<View style={{ marginTop: 12 }}>
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Campo selecionado: {currentField}</Text>
      <CameraUploader auditId={audit.id} field={currentField} />
    </View>)}
    <View style={{ height: 16 }} />
    <Button title="Disparar Análises" onPress={triggerAnalysis} />
    <View style={{ height: 8 }} />
    <Button title="Finalizar Auditoria" onPress={finish} />
    <View style={{ height: 8 }} />
    <Button title="Voltar" onPress={onClose} />
  </ScrollView>);
}