import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Character, selectAllCharacters, getAllCharactersSelector, selectCharacterById } from '../../state';
import { ICustomer, ICandidateField } from '../../shared/interfaces';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit, OnDestroy {

  public routeChangeSub$: Subscription;
  public character$: Observable<Character>;
  public characters$: Observable<Character[]>;

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
