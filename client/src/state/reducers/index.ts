import { combineReducers } from '@reduxjs/toolkit';
import projectsReducer from '../test';

export const rootReducer = combineReducers({
  projects: projectsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
