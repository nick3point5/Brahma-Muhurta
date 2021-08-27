import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import styles from './styles/container';
import Sunrise from "./components/Sunrise.jsx";
import { LinearGradient } from 'expo-linear-gradient';

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
    <LinearGradient
      colors={['#3e1a33', '#461069']}
      style = {[styles.screen]}
      >
        <Sunrise time={time}/>
    </LinearGradient>
  );
}