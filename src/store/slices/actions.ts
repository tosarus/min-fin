import { createAction } from '@reduxjs/toolkit';
import { WorldUpdate } from '../../types';

export const applyWorldUpdate = createAction<WorldUpdate>('applyWorldUpdate');
