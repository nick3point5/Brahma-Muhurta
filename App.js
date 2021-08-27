import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, Platform } from 'react-native';
import styles from './styles/container';
import Sunrise from "./components/Sunrise.jsx";
import Ding from "./components/Ding.jsx";
// import Notification from "./components/Notification.jsx";

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
    <SafeAreaView style = {[styles.screen]}>
      <Sunrise time={time}/>
      <Ding/>
      {/* {
        Platform.OS === 'android'||Platform.OS === 'ios'?
          <Notification/>:
          <></>
      } */}
    </SafeAreaView>
  );
}