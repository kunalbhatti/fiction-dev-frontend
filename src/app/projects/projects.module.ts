import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  ProjectsRoutingModule
} from './projects-routing.module';
import {
  SharedModule
} from '../shared/shared.module';

import {
  ProjectsComponent
} from './projects/projects.component';
import {
  DisplayProjectsComponent
} from './display-projects/display-projects.component';
import {
  ExpandProjectComponent
} from './expand-project/expand-project.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    DisplayProjectsComponent,
    ExpandProjectComponent,
  ],

  imports: [SharedModule, ProjectsRoutingModule, CommonModule],
  exports: []
})

export class ProjectsModule {}
