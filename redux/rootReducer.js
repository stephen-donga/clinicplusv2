import {combineReducers} from 'redux'


import userReducer from './user/userReducer'
import testReducer from './tests/testReducer'
import staffReducer from './staff/staffReducer'
import resultReducer from './result/resultReducer'

export default combineReducers({
    user: userReducer,
    test: testReducer,
    staff: staffReducer,
    testOptions: resultReducer
})