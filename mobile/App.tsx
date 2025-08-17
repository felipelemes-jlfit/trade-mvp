import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import { getToken } from './src/auth';
export default function App() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => { (async () => setAuthed(!!(await getToken())))(); }, []);
  if (authed === null) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text>Carregando…</Text></View>;
  return authed ? <Home onLogout={() => setAuthed(false)} /> : <Login onLoggedIn={() => setAuthed(true)} />;
}