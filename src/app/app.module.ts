import {
  AppRoutingModule
} from './app-routing.module';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
  NgModule
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';

import {
  SharedModule
} from './shared/shared.module';
import {
  PluginsModule
} from './plugins/plugins.module';
import {
  ProjectsModule
} from './projects/projects.module';
import {
  ResearchModule
} from './research/research.module';

import {
  AppComponent
} from './app.component';
import {
  HeaderComponent
} from './header/header.component';
import {
  HomeComponent
} from './home/home.component';

import {
  ScrollDetectDirective
} from './directives/scroll-detect.directive';

import {
  environment
} from './../environments/environment';
import {
  AngularFireModule
} from '@angular/fire';
import {
  AngularFirestoreModule
} from '@angular/fire/firestore';
import {
  AngularFireAuthModule
} from '@angular/fire/auth';
import {
  HttpClientModule
} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,

    ScrollDetectDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    PluginsModule,
    ProjectsModule,
    ResearchModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
