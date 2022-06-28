import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MainComponent} from './components/main/main.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./core/material/material.module";
import {DialogComponent} from './_shared/components/dialog/dialog.component';
import {LoginComponent} from './_shared/components/login/login.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthGuard} from "./core/guards/auth.guard";
import {HttpClientModule} from "@angular/common/http";
import {FilterComponent} from './_shared/components/filter/filter.component';
import {HeaderComponent} from './_shared/components/header/header.component';
import {MenuComponent} from './_shared/components/menu/menu.component';
import {ViewTableComponent} from './_shared/components/view-table/view-table.component';

const routes: Routes = [
  {path: '', component: MainComponent, canActivate: [AuthGuard]},
  {path: 'auth', component: LoginComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DialogComponent,
    LoginComponent,
    FilterComponent,
    HeaderComponent,
    MenuComponent,
    ViewTableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [MaterialModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
