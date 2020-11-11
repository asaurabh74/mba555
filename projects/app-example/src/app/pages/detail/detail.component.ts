import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { selectCharacterById } from '../../state';
import { ICustomer, ICandidateField, EditOutput } from '../../shared/interfaces';
import { DataService } from '../../core/services/data.service';
import { LoggerService } from '../../core/services/logger.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  public routeChangeSub$: Subscription;
  public dataServiceSub$: Subscription;
  public character$: Observable<ICustomer>;
  allFields: ICandidateField[] =[];
  editFields: ICandidateField[] =[];
  readFields: ICandidateField[] =[];

  constructor(
    private dataService: DataService,
    public router: Router,
    private logger: LoggerService,
    public route: ActivatedRoute,
    public store: Store<any>) {

  }

  ngOnInit() {
    /* ------------------------------------------------- */
    /* Listen for changes in the route, then highlight   */
    /* the selected item in the list...                  */
    /* ------------------------------------------------- */
    this.getCandidateFields();
    this.routeChangeSub$ = this.route.paramMap
      .subscribe(map =>
        this.getRouteParams(map));
  }

  ngOnDestroy() {
    this.routeChangeSub$.unsubscribe();
    this.dataServiceSub$.unsubscribe();
  }

  getCandidateFields() {
    this.dataServiceSub$ = this.dataService.getCandidateFields()
        .subscribe((response: ICandidateField []) => {
          this.allFields  = response;
          if (this.allFields) {
            for (var x=0; x< this.allFields.length; ++x) {
              if (this.allFields[x].editable) {
                this.editFields.push(this.allFields[x]);
              } else {
                this.readFields.push(this.allFields[x]);
              }
            }
          }
        },
        (err: any) => this.logger.log(err),
        () => this.logger.log('getCandidateFields() retrieved '));
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

  getFieldValue(customField: ICandidateField, customer: ICustomer) {
    var val = (customer && customer[customField.name]);
    return val || "";
  }

  saveData(item: any) {
    console.log("Saved value=", item);
  }

}
