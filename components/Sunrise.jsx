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
  let didSendNotification = useRef(false)

  // console.log(didSendNotification.current)

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    brahmaMuhurta.current = new Date(sunrise?.getTime() - 5760000)
  }, sunrise)

  const getLocation = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      location.current = await Location.getCurrentPositionAsync();
      setSunrise(nextSunrise(location.current?.coords.latitude, location.current?.coords.longitude))
    })();
  };

  if (!location.current) {
    getLocation()
  }



  if (props.time >= sunrise && !!location.current) {
    setSunrise(nextSunrise(location.current?.coords.latitude, location.current?.coords.longitude))
  }

  if (brahmaMuhurta.current <= props.time) {
    const tomorrowSunrise = nextSunrise(location.current?.coords.latitude, location.current?.coords.longitude, 1)
    brahmaMuhurta.current = new Date(tomorrowSunrise?.getTime() - 5760000)
  }

  const sunriseCountdown = {
    seconds: Math.floor((sunrise - props.time) / 1000 % 60),
    minutes: Math.floor((sunrise - props.time) / 60000 % 60),
    hours: Math.floor((sunrise - props.time) / 3600000 % 24),
  }

  const brahmaMuhurtaCountdown = {
    seconds: Math.floor((brahmaMuhurta.current - props.time) / 1000 % 60),
    minutes: Math.floor((brahmaMuhurta.current - props.time) / 60000 % 60),
    hours: Math.floor((brahmaMuhurta.current - props.time) / 3600000),
  }

  if (brahmaMuhurtaCountdown.minutes <= 0 &&
    brahmaMuhurtaCountdown.minutes <= -48) {
    isBrahmaMuhurta = true
    didSendNotification.current = false
  } else {
    isBrahmaMuhurta = false
  }



  return (
    <>
      {
        location.current &&
          brahmaMuhurta.current.toTimeString() !== "Invalid Date" ?
          <View style={[styles.container]}>
            {
              isBrahmaMuhurta ?
                <Text style={[styles.text]}>Brahma Muhurta</Text>
                :
                <>
                  <Text style={[styles.text]}>The time is {props.time.toTimeString().slice(0, 8)}</Text>
                  <Text style={[styles.text]}>The next Brahma Muhurta will be at {brahmaMuhurta.current?.toTimeString().slice(0, 5)}</Text>
                  <Text style={[styles.text]}>{`${brahmaMuhurtaCountdown.hours} hours, ${brahmaMuhurtaCountdown.minutes} minutes`} until next Brahma Muhurta</Text>
                </>
            }
          </View>
          :
          <>
          </>
      }
      {
        location.current &&
          brahmaMuhurta.current.toTimeString() !== "Invalid Date" ?
          Platform.OS === 'android' || Platform.OS === 'ios' ?
            <Notification
              brahmaMuhurtaCountdown={brahmaMuhurtaCountdown}
              isBrahmaMuhurta={isBrahmaMuhurta}
              didSendNotification={didSendNotification} />
            :
            <></>
          :
          <></>
      }
    </>
  )
}

export default Sunrise