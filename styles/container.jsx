import { StyleSheet } from 'react-native';

const sky = '#22A3F5'
const lull = '#223AF5'
const brahmaMuhurta = '#77628d'
const dusk = '#fab3a6'
const black = '#000'
const white = '#fff'
const transparent = 'transparent'

const backgroundColor = transparent
const textColor = '#d98d7b'

function stylesTime(backgroundColor, textColor, font = null) {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    screen: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      backgroundColor: backgroundColor,
      color: backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dingButtonContainer: {
      marginTop: 100,
    },
    dingButton: {
      height: 20,
    },
    text: {
      color: textColor,
      fontSize: 30,
      // fontFamily: font,
    },
    textTime: {
      color: textColor,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      fontSize: 140,
    },
    textHeader: {
      color: textColor,
      fontSize: 33,
    },
    textCountDown: {
      color: textColor,
      fontSize: 35,
      marginTop: 14,
    },
  });

  return styles
}

const styles = stylesTime(backgroundColor, textColor)

export default styles