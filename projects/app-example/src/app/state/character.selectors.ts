import {
  createSelector,
  createFeatureSelector
} from '@ngrx/store';

import * as fromCharacter from './character.reducer';

export const selectCharacterState = createFeatureSelector<fromCharacter.CharacterState>(
  'characters'
);

export const selectCharacterEntities = createSelector(
  selectCharacterState,
  fromCharacter.selectCharacterEntitiesAdapter
);

export const selectAllCharacters = createSelector(
  selectCharacterState,
  fromCharacter.selectAllCharactersAdapter
);

export function getAllCharactersSelector () {
  return selectAllCharacters;
}

export const selectCharacterById = createSelector(
  selectCharacterState,
  (state, props) => state.entities[props.id]
);
