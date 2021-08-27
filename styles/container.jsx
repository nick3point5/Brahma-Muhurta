import {StyleSheet} from 'react-native';

const backgroundColor = '#fff'

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
    // backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: backgroundColor,
    color: backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
  },
  dingButtonContainer: {
    marginTop: 100,
  },
  dingButton: {
    height: 20,
  },
  text: {
    color: '#000',
    fontSize: 30,
  },
  textTime: {
    // lineHeight: 1,
    color: '#000',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 140,
    // height: ,
  },
  textHeader: {
    // lineHeight: 25,
    color: '#000',
    fontSize: 33,
    // height: 20,
    
  },
  textCountDown: {
    color: '#000',
    fontSize: 35,
    marginTop: 14,
  },
});

const day = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22A3F5',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: '#22A3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
  }
});

export default styles