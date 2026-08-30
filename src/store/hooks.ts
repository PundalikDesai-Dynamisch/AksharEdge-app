import { useDispatch, useSelector } from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

import type { AppDispatch, RootState } from './index';

/** The only sanctioned call site for react-redux's untyped hooks (doc 16 §9). */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
