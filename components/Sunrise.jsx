import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Location from 'expo-location';
import styles from '../styles/container';
import Notification from "./Notification.jsx";
const { nextSunrise } = require('../modules/sunrise')

function Sunrise(props) {
  const [sunrise, setSunrise] = useState(() => null)
  let location = useRef(null);
  let brahmaMuhurta = useRef(null)
  let isBrahmaMuhurta = false

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    brahmaMuhurta.current = new Date(sunrise?.getTime() - 5760000)
  }, sunrise)

  if (brahmaMuhurta.current <= props.time) {
    const tomorrowSunrise = nextSunrise(location.current?.coords.latitude, location.current?.coords.longitude,1)
    brahmaMuhurta.current = new Date(tomorrowSunrise?.getTime() - 5760000)
  }

  const getLocation = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      location.current = await Location.getCurrentPositionAsync();
      setSunrise(nextSunrise(location.current?.coords.latitude, location.current?.coords.longitude))
    })();
  };

  const sunriseCountdown = {
    seconds: Math.floor((sunrise - props.time) / 1000 % 60),
    minutes: Math.floor((sunrise - props.time) / 60000 % 60),
    hours: Math.floor((sunrise - props.time) / 3600000 % 24),
  }

  const brahmaMuhurtaCountdown = {
    seconds: Math.floor((brahmaMuhurta.current - props.time) / 1000 % 60),
    minutes: Math.floor((brahmaMuhurta.current - props.time) / 60000 % 60),
    hours: Math.floor((brahmaMuhurta.current - props.time) / 3600000 % 60),
  }

  if (brahmaMuhurtaCountdown.minutes <= 0 &&
      brahmaMuhurtaCountdown.minutes <= -48) {
        isBrahmaMuhurta=true
  }

  return (
    <>
      {location.current ?
        <View style={[styles.container]}>
          {
            isBrahmaMuhurta ?
              <Text>Brahma Muhurta</Text> :
              <>
                <Text>The time is {props.time.toTimeString().slice(0, 8)}</Text>
                <Text>The next Brahma Muhurta will be at {brahmaMuhurta.current?.toTimeString().slice(0, 5)}</Text>
                <Text>{`${brahmaMuhurtaCountdown.hours} hours,${brahmaMuhurtaCountdown.minutes} minutes`} until next Brahma Muhurta</Text>
              </>
          }
        </View> :
        <View style={[styles.container]}>
          <Button
          onPress={() => getLocation()}
          title="Locate"
        />
        </View>

      }
      {
        Platform.OS === 'android'||Platform.OS === 'ios'?
          <Notification/>:
          <></>
      }
    </>
  )
}

export default Sunrise