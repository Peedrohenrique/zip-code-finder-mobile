import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cepMask, desfazMask } from './mask';
import Api from './Api';

export default function Buscador() {
  const [refresh, setRefresh] = useState(false);
  const [input, setInput] = useState('');
  const [cep, setCep] = useState({});
  const [loadColor, setLoadColor] = useState('#bdbbc7');
  const [loadScale, setLoadScale] = useState(2);
  const inputRef = useRef(null);

  async function handleSearch() {
    if (desfazMask(input) === '') {
      alert('Oops! Preencha algum CEP!');
      return;
    }
    try {
      const res = await Api.get(`${desfazMask(input)}/json`);
      setCep(res.data);
      setInput('');
      inputRef.current.blur();
    } catch {
      alert('Oops! Cep inválido ou inexistente!');
      setInput('');
      inputRef.current.blur();
    }
  }

  const onRefresh = () => {
    setRefresh(true);
    setLoadScale(1.0);
    setLoadColor('#bdbbc7');
    setTimeout(() => {
      setRefresh(false);
      setCep(0)
      setLoadColor('#bdbbc7');
      setLoadScale(1.0);
    }, 2000)
  };

  return (
    <View style={styles.container}>
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor={loadColor} style={{ transform: [{ scale: loadScale }] }}/>
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>Buscador CEP</Text>
        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu cep..."
            placeholderTextColor="#888888"
            value={cepMask(input)}
            onChangeText={setInput}
            keyboardType="numeric"
            ref={inputRef}
          />

          <TouchableOpacity style={styles.buttonSearch} onPress={handleSearch}>
            <Feather name="search" size={25} color="#fff" />
          </TouchableOpacity>
        </View>

      {Object.keys(cep).length > 0 && (
        <View style={styles.main}>
          <Text style={styles.text}>{cep.logradouro}</Text>
          <Text style={styles.text}>Bairro: {cep.bairro}</Text>
          <Text style={styles.text}>Cidade: {cep.localidade}-{cep.uf}</Text>
          <Text style={styles.text}>CEP: {cep.cep}</Text>
          <Text style={styles.text}>Ibge: {cep.ibge}</Text>
          <Text style={styles.text}>DDD: {cep.ddd}</Text>
          <Text style={styles.text}>Siafi: {cep.siafi}</Text>
          <Text style={styles.text}>Complemento: {cep.complemento}</Text>
        </View>
      )}
       </View>
      </ScrollView>
      <StatusBar style="light" translucent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 58,
    fontWeight: '700',
    color: '#fff',
    marginTop: 10,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 5,
    margin: 29,
    borderRadius: 15,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 20,
    color: '#fff',
  },
  buttonSearch: {
    backgroundColor: 'transparent',
    padding: 10,
    marginLeft: 8,
    borderRadius: 4,
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 300,
    borderRadius: 15,
    marginTop: 30,
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '400',
  },
  loadingContainer: {
    position: 'absolute',
    top: '5%',
    margin: 20,
    color: 'white',
    alignSelf: 'center',
    },
});