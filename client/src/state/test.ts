import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Project } from '../models/Project';
import { AppThunk } from './store';

type ProjectsState = {
  projects: Project[];
  error: string | null;
};

const initialState: ProjectsState = {
  projects: [],
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    projectsFetchBegin() {},
    projectsFetchSuccess(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    projectsFetchError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});
export const {
  projectsFetchBegin,
  projectsFetchSuccess,
  projectsFetchError,
} = projectsSlice.actions;

export const fetchProjects = (): AppThunk => async dispatch => {
  dispatch(projectsFetchBegin());
  let projects: Project[] = [];
  try {
    const { data } = await axios.get('http://localhost:3333/api/v1/projects');
    if (data.data) {
      projects = data.data;
    } else {
      throw new Error('Failed to retrieve projects.');
    }
  } catch (error) {
    dispatch(projectsFetchError(error.toString()));
  }
  dispatch(projectsFetchSuccess(projects));
};

export default projectsSlice.reducer;
