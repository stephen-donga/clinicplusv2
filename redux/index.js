import {createStore} from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist';


import rootReducer from './rootReducer'


 const persistConfig = {
    key:'root',
    storage: AsyncStorage,
    blacklist:['staffList','patients']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = createStore(persistedReducer)

export const persistor = persistStore(store)