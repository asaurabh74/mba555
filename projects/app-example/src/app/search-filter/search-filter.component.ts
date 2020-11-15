import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {EditOutput, ICandidateField, ISearchFilter} from "../shared/interfaces";
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})

export class SearchFilterComponent implements OnInit {
  @Input() data: ICandidateField;
  @Output() focusOut: EventEmitter<any> = new EventEmitter<string>();
  @Output() queryChanged: EventEmitter<any> = new EventEmitter<ISearchFilter>();

  filterData: any[] =[];
  editMode = false;
  minValue: number;
  maxValue: number;
  minValueOriginal: number;
  maxValueOriginal: number;
  textValue: string;
  originalTextValue: string;

  constructor() {}

  ngOnInit() {}

  isTextEditMode() {
      return this.data  && this.data.type === "string";
  }

  isNumberEditMode() {
    return this.data  && this.data.type === "number";
  }

  isSelectEditMode() {
    return this.data  && (this.data.type === "select" || this.data.type === "option") || this.isArrayEditMode();
  }

  isArrayEditMode() {
    return this.data  && (this.data.type === 'array');
  }

  getOptions() {
    return this.data.options;
  }


  getData() {
    // if ((this.data.type === "select" || this.data.type === "option") && this.data && this.data.value) {
    //   return this.data.value;
    // } else if (this.fieldObj.type === 'array') {
    //   if (this.data && this.data.length > 0) {
    //     return this.data[0].value;
    //   }
    // }
    return this.data;
  }

  cancel(event: Event, select: NgSelectComponent) {
    event.preventDefault();
    this.minValue=this.minValueOriginal;
    this.maxValue=this.maxValueOriginal;
    select.close();
  }

  update(event: Event, select: NgSelectComponent) {
    event.preventDefault();
    this.minValueOriginal = this.minValue || 0;
    this.maxValueOriginal = this.maxValue || 0;

    var query = this.getQuery();

    this.queryChanged.emit( {
      fieldName: this.data.name,
      query: query
    });
    select.close();
  }

  cancelTextEdit(event: Event, select: NgSelectComponent) {
    event.preventDefault();
    this.textValue =this.originalTextValue || "";
    select.close();
  }

  updateTextEdit(event: Event, select: NgSelectComponent) {
    event.preventDefault();
    this.originalTextValue  = this.textValue || "";

    var query = this.getQuery();

    this.queryChanged.emit( {
      fieldName: this.data.name,
      query: query
    });
    select.close();
  }

  getQuery() {
    var query = "";
    if (this.isNumberEditMode()) {
      if (this.minValueOriginal !== 0) {
        query =  this.data.fieldName  + ">=" + this.minValueOriginal;
      }
      if (this.maxValueOriginal != 0) {
        if (query !== "") {
          query += " AND "
        }
        query  +=  this.data.fieldName  + "<=" + this.maxValueOriginal;
      }
    } if (this.isTextEditMode() && this.originalTextValue && this.originalTextValue != "") {
      query = `"${this.data.fieldName}" ~ "${this.originalTextValue}"`
    }
    return query;
  }

  selectChanged(e) { // here e is a boolean, true if checked, otherwise false

    var query = "";
    if (this.filterData.length > 0){
      query = `"${this.data.name}" in (`
      var queryElem = "";
      for (var x=0; x< this.filterData.length ; ++x) {
       if (queryElem !== '') {
        queryElem += ",";
       }
       queryElem += this.filterData[x].value;
      }
      query+= queryElem + ")";

    }
    this.queryChanged.emit( {
      fieldName: this.data.name,
      query: query
    });
  }



  onFocusOut() {
    this.focusOut.emit({
      data: this.data
    });
  }
}