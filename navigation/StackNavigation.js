import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {connect} from 'react-redux'

import Login from '../screens/Login'
import TestList from '../screens/TestList'
import Test from '../screens/Test'
import ResultFour from '../screens/ResultFourType'
import ResultOne from '../screens/ResultOne'
import UserProfile from '../screens/UserProfile'
import Notifications from '../screens/Notifications'
import ResultCommenEntry from '../screens/ResultCommenEntry'

const Stack = createStackNavigator()

const StackNavigation = ({currentUser}) => {
    const {user_id}= currentUser
    return (
         <Stack.Navigator
         headerMode='none'
         >
             <Stack.Screen name='Login' component={ user_id ?TestList:Login} />
             <Stack.Screen name='TestList' component={TestList} />
             <Stack.Screen name='Test' component={Test} />
             <Stack.Screen name='ResultFour' component={ResultFour} />
             <Stack.Screen name ='ResultOne' component={ResultOne} />
             <Stack.Screen name='UserProfile' component={UserProfile} />
             <Stack.Screen name='Notifications' component={Notifications} />
             <Stack.Screen name='ResultCommentEntry' component={ResultCommenEntry} />
         </Stack.Navigator>
    )
}

const mapStateToProps =({user})=>({
    currentUser: user.currentUser
})

export default connect(mapStateToProps)(StackNavigation)
