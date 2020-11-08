import { createAction, props } from '@ngrx/store';
//import { Character } from './character.model';
import { ICustomer } from '../shared/interfaces';

export const loadCharacters = createAction(
  '[Characters] Load',
  props<{ characters: ICustomer[] }>());

