import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import styles from './styles/container';
import Sunrise from "./components/Sunrise.jsx";

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
    </SafeAreaView>
  );
}