/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification'
import {useNavigation} from '@react-navigation/native'

PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
  
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
  
    },
    popInitialNotification: true,
  
    requestPermissions:Platform.OS === 'ios',
  });



AppRegistry.registerComponent(appName, () => App);
