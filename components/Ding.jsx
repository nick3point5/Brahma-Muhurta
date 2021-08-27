import React, { useRef } from 'react'
import {View, Button} from 'react-native';
import { Audio } from 'expo-av';
import styles from '../styles/container';

function Ding(props) {
  async function handleDing() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/ding.wav')
    );
    await sound.playAsync()
  }

  if (props.ding.current) {
    handleDing()
    props.ding.current = false
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
