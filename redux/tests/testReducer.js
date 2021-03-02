import {TestActionTypes} from './testActionTypes'


const INITIAL_STATE = {
    patients :[]
}

const testReducer = (state=INITIAL_STATE,action)=>{
    switch (action.type) {
        case TestActionTypes.ADD_RESULT:
            return {
                ...state,
                patients: action.payload
            }
    
        default:
            return state;
    }
}

export default testReducer;