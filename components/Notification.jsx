import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function Notification(props) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    if (!props.didSendNotification.current && !props.isBrahmaMuhurta.current) {
      schedulePushNotification(props.brahmaMuhurtaCountdown, props.didSendNotification)
    }

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!props.didSendNotification.current && !props.isBrahmaMuhurta.current) {
    schedulePushNotification(props.brahmaMuhurtaCountdown, props.didSendNotification)
  }

  async function schedulePushNotification() {
    props.didSendNotification.current = true;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "It's Brahma Muhurta 🕉",
      },
      trigger: {
        seconds: props.brahmaMuhurtaCountdown.seconds + 60 * props.brahmaMuhurtaCountdown.minutes + 3600 * props.brahmaMuhurtaCountdown.hours
      },
    });

  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 0, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  return (
    <>
    </>
  );
}

export default Notification

