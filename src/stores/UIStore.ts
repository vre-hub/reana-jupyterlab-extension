/*
 * Copyright European Organization for Nuclear Research (CERN)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Authors:
 * - Muhammad Aditya Hilmy, <mhilmy@hey.com>, 2020
 */

import { Store } from 'pullstate';
import {
  IReanaAuthCredentials,
  IReanaWorkflow
} from '../types';

export interface IUIState {
  authConfig: IReanaAuthCredentials;
  hasConnection: boolean;
  selectedWorkflow: IReanaWorkflow | null;
}

// export const initialState: IUIState = {
//   authConfig: {
//     server: '',
//     accessToken: ''
//   },
//   hasConnection: false
// };

export const initialState: IUIState = {
  authConfig: {
    server: '',
    accessToken: ''
  },
  hasConnection: false,
  selectedWorkflow: null
};

export const UIStore = new Store(initialState);

export const resetReanaCaches = (): void => {
  UIStore.update(s => {
    s.authConfig = {
      server: '',
      accessToken: ''
    };
    s.hasConnection = false;
    s.selectedWorkflow = null;
  });
};