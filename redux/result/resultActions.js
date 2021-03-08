import {ResultOptionsTypes} from './resultTypes'

export const setResultOptions = results =>({
    type: ResultOptionsTypes.SET_RESULT_OPTION,
    payload: results
})