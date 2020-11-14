import { Action, on, createReducer } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { add, remove, reset } from './search.actions';
import { ISearchFilter } from '../shared/interfaces';

export interface SearchState extends EntityState<ISearchFilter> { }
export const searchAdapter: EntityAdapter<ISearchFilter> = createEntityAdapter<ISearchFilter>();


var is = {
    ids: [],
    entities: {}
}

export const initialSearchState: SearchState = searchAdapter.getInitialState(is);

const _searchReducer = createReducer(
    initialSearchState,
  on(add, (state, { searchFilter }) => 
  searchAdapter.addOne(searchFilter, state))
);

export function searchReducer(state: SearchState | undefined, action: Action) {
    return _searchReducer(state, action);
  }
  