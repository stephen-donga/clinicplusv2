import {StaffActionTypes} from './staffActionTypes'

const INITIAL_STATE = {
    staffList:[]
}

const staffReducer = (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case StaffActionTypes.SET_STAFF_LIST:
            return {
                ...state,
                staffList: action.payload
            }
        default:
            return state;
    }
}

export default staffReducer;