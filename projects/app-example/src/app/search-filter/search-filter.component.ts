import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {EditOutput, ICandidateField} from "../shared/interfaces";
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})

export class SearchFilterComponent implements OnInit {
  @Input() data: ICandidateField;
  @Output() focusOut: EventEmitter<any> = new EventEmitter<string>();

  filterData: any[] =[];
  editMode = false;
  minValue: number;
  maxValue: number;
  minValueOriginal: number;
  maxValueOriginal: number;

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
    this.minValueOriginal = this.minValue;
    this.maxValueOriginal = this.maxValue;
    select.close();
  }

  onFocusOut() {
    this.focusOut.emit({
      data: this.data
    });
  }
}