import {combineReducers} from 'redux';
import settingReducer from './settingsReducer';
import foodReducer from './foodReducer';
import {FoodState, SettingsState} from '../Types/stateTypes';

export const reducer = combineReducers({
	state: (state = {}) => state,
	food: foodReducer,
	settings: settingReducer,
});

export type RootState = {
	food: FoodState;
	settings: SettingsState;
};
