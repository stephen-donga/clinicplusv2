import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Login from '../screens/Login'
import TestList from '../screens/TestList'
import Test from '../screens/Test'

const Stack = createStackNavigator()

const StackNavigation = () => {
    return (
         <Stack.Navigator
         headerMode='none'
         >
             <Stack.Screen name='Login' component={Login} />
             <Stack.Screen name='TestList' component={TestList} />
             <Stack.Screen name='Test' component={Test} />
         </Stack.Navigator>
    )
}

export default StackNavigation
