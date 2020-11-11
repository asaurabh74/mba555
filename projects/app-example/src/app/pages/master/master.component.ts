import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { selectAllCharacters, getAllCharactersSelector, selectCharacterById } from '../../state';
import { ICustomer, ICandidateField } from '../../shared/interfaces';

import { loadCharacters } from '../../state/character.actions';



@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit, OnDestroy {

  public routeChangeSub$: Subscription;
  public character$: Observable<ICustomer>;
  public characters$: Observable<ICustomer[]>;
  //public sub: Subscription;

  @Input() customers: ICustomer[] = [];
  @Input() fields: ICandidateField[] = [];
  @Input() allFields: ICandidateField[] = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public store: Store<any>) {
      this.characters$ = this.store.select(getAllCharactersSelector());
  }


  
  ngOnInit() {
    /* ------------------------------------------------- */
    /* Listen for changes in the route, then highlight   */
    /* the selected item in the list...                  */
    /* ------------------------------------------------- */


    // this.store.dispatch(loadCharacters({
    //     characters:  this.customers
    // }));
    if (this.route.firstChild) {
      this.routeChangeSub$ = this.route.firstChild.paramMap
        .subscribe((map: ParamMap) =>
          this.getRouteParams(map));
    }
  }

  ngOnDestroy() {
    if (this.routeChangeSub$){
      this.routeChangeSub$.unsubscribe();
    }
  }

  getRouteParams(map: ParamMap): number {
    console.log (" in getRouteParams ");
    const characterId = map.get('id');
    let id: number = null;
    if (characterId) {
      this.character$ = this.store.pipe(
        select(selectCharacterById, { id: characterId })
      );
      id = parseInt(characterId, 10);
    }
    return id;
  }

}
