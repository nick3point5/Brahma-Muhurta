import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Platform, Button } from 'react-native';
import * as Location from 'expo-location';
import Ding from "./Ding.jsx";
import styles from '../styles/container';
import Notification from "./Notification.jsx";
const { nextSunrise } = require('../modules/sunrise')

function Sunrise(props) {
  const [sunrise, setSunrise] = useState(() => null)
  const location = useRef(null);
  const brahmaMuhurta = useRef(null)
  const isBrahmaMuhurta = useRef(false)
  const didSendNotification = useRef(false)
  const ding = useRef(false)
  const timeDifference = brahmaMuhurta.current - props.time

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    brahmaMuhurta.current = new Date(sunrise?.getTime() - 5760000)
  }, sunrise)

  function getLocation() {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      location.current = await Location.getCurrentPositionAsync();
      setSunrise(nextSunrise(location.current?.coords.latitude, location.current?.coords.longitude))
    })();
  };

  const brahmaMuhurtaCountdown = {
    seconds: Math.floor((timeDifference) / 1000 % 60),
    minutes: Math.floor((timeDifference) / 60000 % 60),
    hours: Math.floor((timeDifference) / 3600000),
    text() {
      const hours = this.hours ?
        `${this.hours} hour` + ((this.hours !== 1) ? "s, " : "")
        :
        ""

      const minutes = this.minutes ?
        `${this.minutes} minute` + ((this.minutes !== 1) ? "s" : "")
        :
        ""

      if (!hours && !minutes) {
        return "Brahma Muhurta soon"
      }

      return hours + minutes + " until Brahma Muhurta"
    },
  }

  if (!location.current) {
    getLocation()
  } else {

    if (props.time >= sunrise && !!location.current) {
      setSunrise(nextSunrise(location.current?.coords.latitude, location.current?.coords.longitude))
    }

    if (timeDifference <= 0 && !isBrahmaMuhurta.current) {
      ding.current = true
      isBrahmaMuhurta.current = true
      didSendNotification.current = false
    }

    console.log(timeDifference <= -48 * 60 * 1000)
    if (timeDifference <= -48 * 60 * 1000) {
      const tomorrowSunrise = nextSunrise(location.current?.coords.latitude, location.current?.coords.longitude, 1)
      brahmaMuhurta.current = new Date(tomorrowSunrise?.getTime() - 5760000)
      isBrahmaMuhurta.current = false
      
    }

  }

  return (
    <>
      {
        location.current &&
          brahmaMuhurta.current.toTimeString() !== "Invalid Date" ?
          <View style={[styles.container]}>
            {
              isBrahmaMuhurta.current ?
                <Text style={[styles.text]}>Brahma Muhurta</Text>
                :
                <>
                  <Text style={[styles.text]}>The time is {props.time.toTimeString().slice(0, 8)}</Text>
                  <Text style={[styles.text]}>The next Brahma Muhurta will be at {brahmaMuhurta.current?.toTimeString().slice(0, 5)}</Text>
                  <Text style={[styles.text]}>{brahmaMuhurtaCountdown.text()}</Text>
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
              isBrahmaMuhurta={isBrahmaMuhurta.current}
              didSendNotification={didSendNotification.current} />
            :
            <></>
          :
          <></>
      }
        <Ding ding={ding}/>
    </>
  )
}

export default Sunrise