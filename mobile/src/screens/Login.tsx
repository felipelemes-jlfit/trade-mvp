import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { loginWithEmail } from '../auth';
export default function Login({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function submit() {
    try { await loginWithEmail(email, password); onLoggedIn(); }
    catch (e:any) { Alert.alert('Erro', e?.message || 'Falha no login'); }
  }
  return (<View style={{ padding: 24, gap: 12 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Entrar</Text>
    <TextInput placeholder="Email" autoCapitalize='none' keyboardType='email-address' value={email} onChangeText={setEmail} style={{ borderWidth:1, padding:12, borderRadius:8 }} />
    <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth:1, padding:12, borderRadius:8 }} />
    <Button title="Entrar" onPress={submit} />
  </View>);
}