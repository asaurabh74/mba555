import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomersComponent } from './customers.component';
import { CustomersCardComponent } from './customers-card/customers-card.component';
import { CustomersGridComponent } from './customers-grid/customers-grid.component';
import { MasterComponent, DetailComponent } from '../pages';

const detailRoutes = [
    {
      path: 'detail/:id',
      component: DetailComponent
    }
];

const routes: Routes = [
  // { path: '', component: CustomersComponent },
  {
      path: '',
      component: CustomersComponent,
      children: [
        // Mobile 'Detail' Routes
        // are children of the master...
        // {
        //   path: '',
        //   redirectTo: 'detail'
        // },
        {
          path: 'detail',
          component: DetailComponent
        },
        ...detailRoutes
      ]
    },
    ...detailRoutes
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CustomersRoutingModule {
  static components = [ CustomersComponent, CustomersCardComponent, CustomersGridComponent , MasterComponent, DetailComponent];
}


// const app_routes: Routes = [
//   { path: '', pathMatch: 'full', redirectTo: '/customers' },
  // {
  // path: '', redirectTo: 'master', pathMatch: 'full'},
  // {
  //   path: 'master',
  //   component: MasterComponent,
  //   children: [
  //     // Mobile 'Detail' Routes
  //     // are children of the master...
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       redirectTo: 'detail'
  //     },
  //     {
  //       path: 'detail',
  //       component: DetailComponent
  //     },
  //     ...detailRoutes
  //   ]
  // },
  // Desktop 'Detail' Routes
  // are siblings of the master...
  //...detailRoutes,