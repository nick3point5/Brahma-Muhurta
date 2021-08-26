import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

const nextSunrise = (lat = 0, long = 0, dayOffset = 0) => {
  const tau = 2 * Math.PI
  const millisecondsInDay = 86400000
  const radFactor = tau / 360
  lat = lat * radFactor
  long = long * radFactor
  const time = timeObject(dayOffset-1)

  function timeObject(dayOffset = 0) {

    let now = new Date
    if (dayOffset) {
      now = new Date(now.getTime() + dayOffset * millisecondsInDay)
    }
    const date = new Date(now.getTime() - (now.getTime() % millisecondsInDay))
    const day = (now.getTime() % millisecondsInDay) / millisecondsInDay

    let time = {
      now: now,
      year: now.getFullYear(),
      date: date,
      day: day,
      offset: -now.getTimezoneOffset() / 60,
    }
    return time
  }

  function calculateSunrise(time, lat = 0, long = 0) {
    const days = Math.floor(time.now.getTime() / 86400000)
    
    const dayJulian = days + 2440589 - time.offset / 24
    
    const Julian = (dayJulian - 2451545) / 36525
    
    const oblique = radFactor * (23 + (26 + ((21.448 - Julian * (46.815 + Julian * (0.00059 - Julian * 0.001813)))) / 60) / 60)
    
    const obliqueCorrection = (oblique + 0.00004468 * Math.cos(2.18235 - 33.757041 * Julian))
    
    const fyear = Math.tan(obliqueCorrection / 2) * Math.tan(obliqueCorrection / 2)
    
    const anom = 6.24006014 + Julian * (628.30195515 - 0.0000026826 * Julian)
    
    const longSunMean = radFactor * ((280.46646 + Julian * (36000.76983 + Julian * 0.0003032)) % 360)
    
    const sunCenter = Math.sin(anom) * (0.0334161088 - Julian * (0.0000840725 + 0.000000244 * Julian)) + Math.sin(2 * anom) * (0.0003489437 - 0.000001763 * Julian) + Math.sin(3 * anom) * 0.000005044
    
    const longSunTrue = longSunMean + sunCenter

    const longSunApparent = longSunTrue - 0.0000993 - 0.00008343 * Math.sin(2.18236 - 33.757041 * Julian)
  
    const eccentric = 0.016708634 - Julian * (0.000042037 + 0.0000001267 * Julian)
  
    const equationTime = 4 * (fyear * Math.sin(2 * longSunMean) - 2 * eccentric * Math.sin(anom) + 4 * eccentric * fyear * Math.sin(anom) * Math.cos(2 * longSunMean) - 0.5 * fyear * fyear * Math.sin(4 * longSunMean) - 1.25 * eccentric * eccentric * Math.sin(2 * anom))
  
    const solarNoon = 0.5 - long / tau - (equationTime) / (4 * tau) + time.offset / 24
  
    const declinationAngle = Math.asin(Math.sin(obliqueCorrection) * Math.sin(longSunApparent))
  
    const ha = Math.acos(Math.cos(90.833 * radFactor) / (Math.cos(lat) * Math.cos(declinationAngle)) - Math.tan(lat) * Math.tan(declinationAngle))
  
    const sunrise = (solarNoon - ha / tau)
  
    const sunriseDate = new Date((sunrise+1-time.offset / 24) * millisecondsInDay + time.date.getTime())
  
    return sunriseDate
  }

  let sunrise = calculateSunrise(time, lat, long)
  if((new Date()) >= sunrise){
    sunrise = calculateSunrise(timeObject(dayOffset), lat, long)
  }

  return sunrise
}

export default function App() {
  const [time, setTime] = useState(() => {
    return new Date
  })

  const [location, setLocation] = useState(null);

  const [sunrise, setSunrise] = useState(() => {
    return new Date
  })
  
  let brahmaMuhurta= (new Date(sunrise.getTime()-5760000))

  if ((brahmaMuhurta-time)<=0) {
    const tomorrowSunrise = (nextSunrise(location?.coords.latitude, location?.coords.longitude,1))
    brahmaMuhurta= (new Date(tomorrowSunrise.getTime()-5760000))
  }

  useEffect(() => {
    console.log(sunrise)
    setSunrise(nextSunrise(location?.coords.latitude, location?.coords.longitude))
  }, location)

  
  let sunriseCountdown = {
    minutes: Math.floor((sunrise-time)/1000/60%60),
    hours: Math.floor((sunrise-time)/1000/60/60%60)
  }

  let brahmaMuhurtaCountdown = {
    minutes: Math.floor((brahmaMuhurta-time)/1000/60%60),
    hours: Math.floor((brahmaMuhurta-time)/1000/60/60%60)
  }
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })()

    const tick = setInterval(() => {      
      setTime(new Date)
    }, 1000);

    return () => {
      clearInterval(tick)
    }
  }, [])

  return (
    <>
      <View style={styles.container}>
        <Text>The time is {time.toTimeString().slice(0, 5)}</Text>
        <Text>The sunrise will be at {sunrise.toTimeString().slice(0, 5)}</Text>
        <Text>The Brahma Muhurta will be at {brahmaMuhurta.toTimeString().slice(0, 5)}</Text>
        <Text>{`${sunriseCountdown.hours} hours, ${sunriseCountdown.minutes} minutes`} until next sunrise</Text>
        <Text>{`${brahmaMuhurtaCountdown.hours} hours,${brahmaMuhurtaCountdown.minutes} minutes`} until next Brahma Muhurta</Text>
        <StatusBar style="auto" />
      </View>
      <View style={styles.container}>
        <Text>{}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
