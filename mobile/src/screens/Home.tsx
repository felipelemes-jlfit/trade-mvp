import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { api } from '../api';
import Audit from './Audit';
import { clearToken } from '../auth';
import { RouteStop } from '../types';
export default function Home({ onLogout }: { onLogout: () => void }) {
  const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
  const [currentAudit, setCurrentAudit] = useState<any | null>(null);
  useEffect(() => { (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permissão', 'Ative a localização para usar o app.'); return; }
    try { const { data } = await api.get('/pdvs/route'); setRouteStops(data?.stops ?? []); }
    catch { Alert.alert('Erro', 'Falha ao carregar rota.'); }
  })(); }, []);
  async function startAudit(pdvId: string) {
    const loc = await Location.getCurrentPositionAsync({});
    const { data } = await api.post('/audits/start', { pdvId, lat: loc.coords.latitude, lng: loc.coords.longitude });
    setCurrentAudit(data);
  }
  if (currentAudit) return <Audit audit={currentAudit} onClose={() => setCurrentAudit(null)} />;
  return (<View style={{ flex:1, padding: 16 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Rota do dia</Text>
      <Button title="Sair" onPress={async () => { await clearToken(); onLogout(); }} />
    </View>
    <FlatList data={routeStops} keyExtractor={(i) => i.id} renderItem={({ item }) => (
      <TouchableOpacity onPress={() => startAudit(item.pdv.id)} style={{ padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.pdv.name}</Text>
        <Text>{item.pdv.address}</Text>
      </TouchableOpacity>
    )} />
  </View>);
}