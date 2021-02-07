import { useDispatch as _useDispatch } from 'react-redux';
import { AppDispatch } from '../state/store';

export const useDispatch = () => _useDispatch<AppDispatch>();
