import {
  NgModule
} from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import {
  ExpandProjectComponent
} from './expand-project/expand-project.component';
import {
  DisplayProjectsComponent
} from './display-projects/display-projects.component';
import {
  ProjectsComponent
} from './projects/projects.component';


const routes: Routes = [
  {
    path: 'projects',
    redirectTo: 'projects/display-projects/modules'
  },
  {
    path: 'projects/display-projects',
    redirectTo: 'projects/display-projects/modules'
  },
  {
    path: 'projects',
    component: ProjectsComponent,

    children: [{
        path: 'display-projects/:projectType',
        component: DisplayProjectsComponent
      },
      {
        path: ':projectId',
        component: ExpandProjectComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProjectsRoutingModule {

}
