import { Component, OnInit, ViewChild, 
  ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';

import { DataService } from '../core/services/data.service';
import { AuthService } from '../core/services/auth.service';
import { ICustomer, IPagedResults ,ICandidateField, ISearchFilter} from '../shared/interfaces';
import { FilterService } from '../core/services/filter.service';
import { LoggerService } from '../core/services/logger.service';
import { of } from 'rxjs'; 
import { Store, select } from '@ngrx/store';
import { loadCharacters } from '../state/character.actions';
import { add } from '../state/search.actions';
import { Auth } from 'jira-connector/types/api';

@Component({
  selector: 'cm-customers',
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {

  //@Output() filterChangedEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  title: string;
  filterText: string;
  customers: ICustomer[] = [];
  displayMode: DisplayModeEnum;
  displayModeEnum = DisplayModeEnum;
  totalRecords = 0;
  pageSize = 20;
  selectedFields: ICandidateField[] =[];
  allFields: ICandidateField[] =[];
  filterSelectedFields: ICandidateField[] =[];
 // searchSelected: ICandidateField[] =[];

  searchSelectedItem = {displayName: "Recruiter", editable: false, fieldName: "assignee", name: "assignee", options:[], type: "select"};
  searchSelected = [ this.searchSelectedItem ];
  searchSelected$ = of(this.searchSelected);

  

  filterData: any[] =[];
  searchFilters = {};
  currentPage = 1;
  currentUser: any;


  displayTypes = [
    {id: 0, iconClass: "glyphicon glyphicon-th-large", type: "Card View"},
    {id: 1, iconClass: "glyphicon glyphicon-align-justify", type: "List View"}
  ]

  
  

  mapComponentRef: ComponentRef<any>;
  _filteredCustomers: ICustomer[] = [];

  get filteredCustomers() {
    return this._filteredCustomers;
  }

  set filteredCustomers(value: ICustomer[]) {
    this._filteredCustomers = value;
    this.updateMapComponentDataPoints();
  }

  @ViewChild('mapsContainer', { read: ViewContainerRef }) 
  private mapsViewContainerRef: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private dataService: DataService,
    private authService: AuthService,
    private filterService: FilterService,
    private logger: LoggerService,
    public store: Store<any>) { }

  ngOnInit() {
    this.title = 'Customers';
    this.filterText = 'Filter Customers:';
    this.displayMode = DisplayModeEnum.Grid;

    this.searchFilters["assignee"] = "assignee in (currentUser())"

    //this.getCurrentUser();
    this.getCustomersPage(1);
    this.getSelectedFields();
    this.getCandidateFields();
  }

  changeDisplayMode(mode: DisplayModeEnum) {
      this.displayMode = mode;
  }

  pageChanged(page: number) {
    this.currentPage = page;
    this.getCustomersPage(page);
  }

  queryChanged(searchFilter: ISearchFilter) {
    this.currentPage = 1;
    this.searchFilters[searchFilter.fieldName] = searchFilter.query;
    this.getCustomersPage(this.currentPage);
    console.log (" query changed ", this.searchFilters);
  }

  getQuery() {
    var query = "";
    for (var searchFilter in this.searchFilters){
      if (this.searchFilters[searchFilter] !== "") {
        if (query.length > 0) {
          query += " AND ";
        }
        query += this.searchFilters[searchFilter];
      } 
    }
    return query;
  }

  getCurrentUser() {
    this.authService.getCurrentUser()
        .subscribe((response: any) => {
          this.currentUser  = response;
          console.log (" current user =", this.currentUser);
        },
        (err: any) => this.logger.log(err),
        () => this.logger.log('getCurrentUser() retrieved for customer'));
  }

  getCustomersPage(page: number) {
    this.dataService.getCustomersPage((page - 1) * this.pageSize, this.pageSize, this.getQuery())
        .subscribe((response: IPagedResults<ICustomer[]>) => {
          this.customers = this.filteredCustomers = response.results;
          this.totalRecords = response.totalRecords;
          //this.filterChangedEmitter.emit(true); // Raise changed event
          this.store.dispatch(loadCharacters({
            characters:  this.filteredCustomers
          }));
        },
        (err: any) => this.logger.log(err),
        () => this.logger.log('getCustomersPage() retrieved customers for page: ' + page));
  }

  getSelectedFields() {
    this.dataService.getSelectedCandidateFields()
        .subscribe((response: ICandidateField []) => {
          this.selectedFields  = response;
        },
        (err: any) => this.logger.log(err),
        () => this.logger.log('getSelectedCandidateFields() retrieved for customer'));
  }

  getCandidateFields() {
    this.dataService.getCandidateFields()
        .subscribe((response: ICandidateField []) => {
          this.allFields  = response;
          // add the recruiter field by default
          // var assigneeFieldIndex = -1;
           for (var x=0; x< this.allFields.length; ++x) {
             if (this.allFields[x].fieldName === "assignee") {
                 var aField = this.allFields[x];
                 this.searchSelectedItem.options = aField.options;
          //     console.log ("A field" ,aField);
          //     this.searchSelected.push(aField);
             }
           }
          // if (assigneeFieldIndex !== -1) {
          //   delete this.allFields[assigneeFieldIndex];
          // }

        },
        (err: any) => this.logger.log(err),
        () => this.logger.log('getCandidateFields() retrieved '));
  }

  filterChanged(data: string) {
    if (data && this.customers) {
        data = data.toUpperCase();
        var props = [];
        for (var x=0; x< this.allFields.length; ++x) {
          props.push(this.allFields[x].name);
        }
        this.filteredCustomers = this.filterService.filter<ICustomer>(this.customers, data, props);
    } else {
      this.filteredCustomers = this.customers;
    }
   // this.filterChangedEmitter.emit(true); // Raise changed event
     this.store.dispatch(loadCharacters({
      characters:  this.filteredCustomers
    }));

  }

  async lazyLoadMapComponent() {
    this.changeDisplayMode(DisplayModeEnum.Map);
    if (!this.mapsViewContainerRef.length) {
      // Lazy load MapComponent
      const { MapComponent } = await import('../shared/map/map.component');
      console.log('Lazy loaded map component!');
      const component = this.componentFactoryResolver.resolveComponentFactory(MapComponent);
      this.mapComponentRef = this.mapsViewContainerRef.createComponent(component);
      this.mapComponentRef.instance.zoom = 2;
      this.mapComponentRef.instance.dataPoints = this.filteredCustomers;
      this.mapComponentRef.instance.enabled = true;
    }
  }

  updateMapComponentDataPoints() {
    if (this.mapComponentRef) {
      this.mapComponentRef.instance.dataPoints = this.filteredCustomers;
    }
  }
}

enum DisplayModeEnum {
  Card = 0,
  Grid = 1,
  Map = 2
}
