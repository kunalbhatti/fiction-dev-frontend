import {
  NgModule
} from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import {
  ResearchComponent
} from './research/research.component';
import {
  DisplayResearchComponent
} from './display-research/display-research.component';
import {
  ExpandResearchComponent
} from './expand-research/expand-research.component';

const routes: Routes = [{
    path: 'research',
    redirectTo: 'research/display-research/concepts'
  },
  {
    path: 'research/display-research',
    redirectTo: 'research/display-research/concepts'
  },
  {
    path: 'research',
    component: ResearchComponent,
    children: [{
        path: 'display-research/:researchType',
        component: DisplayResearchComponent
      },
      {
        path: ':researchId',
        component: ExpandResearchComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResearchRoutingModule {

}
