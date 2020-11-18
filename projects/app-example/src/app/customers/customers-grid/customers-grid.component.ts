import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { SorterService } from '../../core/services/sorter.service';
import { TrackByService } from '../../core/services/trackby.service';
import { ICustomer, ICandidateField } from '../../shared/interfaces';

@Component({
  selector: 'cm-customers-grid',
  templateUrl: './customers-grid.component.html',
  styleUrls: ['./customers-grid.component.css'],
  // When using OnPush detectors, then the framework will check an OnPush
  // component when any of its input properties changes, when it fires
  // an event, or when an observable fires an event ~ Victor Savkin (Angular Team)
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersGridComponent implements OnInit {

  @Input() customers: ICustomer[] = [];
  @Input() fields: ICandidateField[] = [];
  @Input() allFields: ICandidateField[] = [];
  @Input() checkedCandidates: any[] = [];
  
  

  constructor(private sorterService: SorterService, public trackbyService: TrackByService) { }

  ngOnInit() {

  }

  sort(prop: string) {
    this.customers = this.sorterService.sort(this.customers, prop);
  }

  // getCustomers(): void {
	// 	this.dataService.getCustomers().subscribe(customers => this.customers = customers);
	// } 
	
	checkAllCheckBox(ev) {
		this.customers.forEach(x =>  {
      var customerChecked = ev.target.checked;
      if (customerChecked) {
        // push the customer id in the array
        this.checkedCandidates.push(x.id);
      } else {
        var index =this.checkedCandidates.indexOf(x.id);
        if (index !== -1) {
         delete this.checkedCandidates[x.id];
        }
      }
    })
  }
  

  isCheckBoxChecked (candidateId) {
    return this.checkedCandidates.indexOf(candidateId) !== -1;
  }

  checkCandidate(ev, candidateId) {
    var customerChecked = ev.target.checked;
    if (customerChecked) {
      // push the customer id in the array
      this.checkedCandidates.push(candidateId);
    } else {
      var index =this.checkedCandidates.indexOf(candidateId);
      if (index !== -1) {
       delete this.checkedCandidates[index];
      }
    }
  }

	isAllCheckBoxChecked() {
    var allChecked = true;
    this.customers.forEach(x =>  {
      var index =this.checkedCandidates.indexOf(x.id);
      if (index === -1) {
         allChecked = false;
      }
    })
    return allChecked;
	 	//return this.customers.every(p => p.checked);
  }
  
  getData(customer: ICustomer, field :ICandidateField){
    if (field.type === 'option' || field.type === 'select') {
      if (customer[field.name])
        return customer[field.name].value;
      return "";
    } else if (field.type === 'array') {
      var values = customer[field.name];
      if (values && values.length > 0) {
        return values[0].value;
      }
    }
    return customer[field.name] ;
  } 
}
