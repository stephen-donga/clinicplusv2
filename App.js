/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import React,{useEffect} from 'react';
import {
  StatusBar,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen'

import {Provider} from 'react-redux'
import {store,persistor} from './redux/index'
import {PersistGate} from 'redux-persist/integration/react'

import {NavigationContainer} from '@react-navigation/native'
import StackNavigation from './navigation/StackNavigation'

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
    return () => {
    }
  }, [])
  return (
    <>
    
      <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor="#92C1C2" />
      <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
      </PersistGate>
        </Provider>
    </>
  );
};

 

export default App;
