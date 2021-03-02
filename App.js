/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import React from 'react';
import {
  StatusBar,
} from 'react-native';

import {Provider} from 'react-redux'
import {Store} from './redux/index'

import {NavigationContainer} from '@react-navigation/native'
import StackNavigation from './navigation/StackNavigation'
 

const App = () => {
  return (
    <>
    
      <Provider store={Store}>
      <StatusBar barStyle="light-content" backgroundColor="#92C1C2" />
      
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
        </Provider>
    </>
  );
};

 

export default App;
