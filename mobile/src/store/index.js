import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import persistStore from 'redux-persist/es/persistStore';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from '@react-native-async-storage/async-storage';

const authReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer
});

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };
export default store;
