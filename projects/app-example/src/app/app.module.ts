import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DetailComponent, MasterComponent } from './pages';
import { HeaderComponent, ListItemComponent } from './components';
import { LibMasterDetailModule } from './master-detail/public-api';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { charactersReducer } from './state/character.reducer';

import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoginModule } from './login/login.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    LibMasterDetailModule,
    StoreModule.forRoot({ characters: charactersReducer }),
    StoreDevtoolsModule.instrument(),
    LoginModule,          // Eager loaded since we may need to go here right away as browser loads based on route user enters
    AppRoutingModule,     // Main routes for application
    CoreModule,           // Singleton objects (services, components that are loaded only once, etc.)
    SharedModule       // Shared (multi-instance) objects
  ],
  declarations: [AppComponent,
     DetailComponent,
     MasterComponent,
     HeaderComponent,
     ListItemComponent
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }