import {StaffActionTypes} from './staffActionTypes'

export const setStaffList = list =>({
type: StaffActionTypes.SET_STAFF_LIST,
payload: list
})