import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {EditOutput, ICandidateField} from "../shared/interfaces";

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

  onFocusOut() {
    this.focusOut.emit({
      data: this.data
    });
  }
}