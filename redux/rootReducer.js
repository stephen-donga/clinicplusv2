import {combineReducers} from 'redux'


import userReducer from './user/userReducer'
import testReducer from './tests/testReducer'

export default combineReducers({
    user: userReducer,
    test: testReducer
})