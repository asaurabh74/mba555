import { createAction, props } from '@ngrx/store';
import { ISearchFilter } from '../shared/interfaces';

export const add = createAction('[SearchFilter] Add',
    props<{ searchFilter: ISearchFilter }>());
export const reset = createAction('[SearchFilter] Reset');
export const remove = createAction('[SearchFilter] Remove', 
    props<{ fieldName: string; }>());
