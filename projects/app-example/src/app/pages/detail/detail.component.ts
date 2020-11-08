import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { selectCharacterById } from '../../state';
import { ICustomer } from '../../shared/interfaces';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  public routeChangeSub$: Subscription;
  public character$: Observable<ICustomer>;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public store: Store<any>) {

  }

  ngOnInit() {
    /* ------------------------------------------------- */
    /* Listen for changes in the route, then highlight   */
    /* the selected item in the list...                  */
    /* ------------------------------------------------- */
    this.routeChangeSub$ = this.route.paramMap
      .subscribe(map =>
        this.getRouteParams(map));
  }

  ngOnDestroy() {
    this.routeChangeSub$.unsubscribe();
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
