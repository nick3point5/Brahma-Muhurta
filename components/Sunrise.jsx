import React, {useState, useEffect, useRef} from 'react';
import { Text, View, Button } from 'react-native';
import * as Location from 'expo-location';
import styles from '../styles/container';
const  {nextSunrise}  = require('../modules/sunrise')

const getLocation = () => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync();
    setSunrise(nextSunrise(location?.coords.latitude, location?.coords.longitude))
    setLocation(location);

  })();
};

function  locationComponent(props) {
  const [sunrise, setSunrise] = useState(() => null)
  let location = useRef(null);
  let brahmaMuhurta= useRef(null)

  useEffect(() => {
    getLocation()
  }, [])
  
  useEffect(() => {
    brahmaMuhurta.current =new Date(sunrise?.getTime()-5760000)
  }, sunrise)

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
    minutes: Math.floor((sunrise-props.time)/60000%60),
    hours: Math.floor((sunrise-props.time)/3600000%60),
  }

  const brahmaMuhurtaCountdown = {
    minutes: Math.floor((brahmaMuhurta.current-props.time)/60000%60),
    hours: Math.floor((brahmaMuhurta.current-props.time)/3600000%60),
  }

  return (
    <>
    {location.current? 
      <View style = {[styles.container]}>
        {
          brahmaMuhurtaCountdown.minutes<=0&&brahmaMuhurtaCountdown.minutes>=-48?
            <Text>It is Brahma Muhurta </Text>:
            <>
              <Text>The Brahma Muhurta will be at {brahmaMuhurta.current?.toTimeString().slice(0, 5)}</Text>
              <Text>{`${brahmaMuhurtaCountdown.hours} hours,${brahmaMuhurtaCountdown.minutes} minutes`} until next Brahma Muhurta</Text>
            </>
        }
      </View>:
      <Button 
        onPress={()=>getLocation()}
        title="Locate"
      />
    }
    </>
  )
}

export default locationComponent

