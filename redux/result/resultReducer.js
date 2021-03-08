import {ResultOptionsTypes} from './resultTypes'

const INITAL_STATE = {
    resultOptions:[]
}


const resultReducer = (state=INITAL_STATE, action) =>{
    switch(action.type){
        case ResultOptionsTypes.SET_RESULT_OPTION:
            return {
                ...state,
                resultOptions: action.payload
            }
            break;
        default:
            return state;
    }
}

export default resultReducer;