import React from 'react'
import {View, Button} from 'react-native';
import { Audio } from 'expo-av';
import styles from '../styles/container';

function Ding() {
  async function handleDing() {
    console.log("ding")
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/ding.wav')
    );
    await sound.playAsync()
  }
  return (
    <View style = {[styles.container]}>
      <Button
        onPress={()=>handleDing()}
        title="Ding"
      />
    </View>
  )
}

export default Ding
