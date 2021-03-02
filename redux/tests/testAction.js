import {TestActionTypes} from './testActionTypes'

export const setTestList = action =>({
    type: TestActionTypes.ADD_RESULT,
    payload: action
})