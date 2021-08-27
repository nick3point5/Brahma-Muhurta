import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import styles from './styles/container';
import Sunrise from "./components/Sunrise.jsx";
import Ding from "./components/Ding.jsx";
import * as Notifications from 'expo-notifications';

export default function App() {
  const [time, setTime] = useState(() => {
    return new Date
  })

  useEffect(() => {
    const tick = setInterval(() => {      
      setTime(new Date)
    }, 1000);

    return () => {
      clearInterval(tick)
    }
  }, [])

  return (
    <SafeAreaView style = {[styles.container]}>
      <View style={styles.container}>
        <Text>The time is {time.toTimeString().slice(0, 8)}</Text>
      </View>
      
      <Sunrise time={time}/>
      <Ding/>

    </SafeAreaView>
  );
}