import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CustomersRoutingModule } from './customers-routing.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [CustomersRoutingModule, SharedModule, NgSelectModule, FormsModule],
  declarations: [CustomersRoutingModule.components]
})
export class CustomersModule { }