import React, { useRef } from 'react'
import {View, Button, TouchableOpacity, Text} from 'react-native';
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
    <View style={[styles.textContainer]}>
      <TouchableOpacity
        onPress={()=>handleDing()}
        style={{}}>
          <Text style={[styles.text, styles.textTime]}>{props.brahmaMuhurta.current?.toTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Ding
