import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { MasterDetailComponent } from './components';
import { MasterRouterLinkDirective } from '././directives';
import { BreakpointService } from './services';
import { AngularSplitModule } from 'angular-split'


const components = [ MasterDetailComponent ];
const directives = [ MasterRouterLinkDirective ];

@NgModule({
  declarations: [
    ...components,
    ...directives
  ],
  imports: [
    LayoutModule,
    AngularSplitModule,
    RouterModule.forChild([])
  ],
  exports: [
    ...components,
    ...directives
  ],
  providers: [
    BreakpointService
  ]
})
export class LibMasterDetailModule { }
