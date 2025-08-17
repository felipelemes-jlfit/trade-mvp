import React, { useState } from 'react';
import { View, Image, Button, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../api';
import { PhotoField } from '../types';
export default function CameraUploader({ auditId, field }: { auditId: string; field: PhotoField }) {
  const [images, setImages] = useState<string[]>([]);
  async function pick() {
    const res = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, quality: 0.7 });
    if (!res.canceled) { const uris = res.assets.map(a => a.uri); setImages(prev => [...prev, ...uris]); }
  }
  async function uploadAll() {
    try {
      for (const uri of images) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const form = new FormData();
        form.append('auditId', auditId);
        form.append('field', field);
        form.append('file', new File([blob], 'photo.jpg', { type: blob.type || 'image/jpeg' }));
        await api.post('/uploads/image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      Alert.alert('Sucesso', 'Fotos enviadas!'); setImages([]);
    } catch (e:any) { Alert.alert('Erro', e?.message || 'Falha no upload'); }
  }
  return (<View>
    <Button title="Selecionar fotos" onPress={pick} />
    <ScrollView horizontal style={{ marginVertical: 8 }}>
      {images.map((u, i) => (<Image key={i} source={{ uri: u }} style={{ width: 120, height: 120, marginRight: 8, borderRadius: 8 }} />))}
    </ScrollView>
    {images.length > 0 && <Button title="Enviar" onPress={uploadAll} />}
  </View>);
}