import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchRoutingModule } from './research-routing.module';
import { SharedModule } from './../shared/shared.module';
import { ResearchComponent } from './research/research.component';
import { DisplayResearchComponent } from './display-research/display-research.component';
import { ExpandResearchComponent } from './expand-research/expand-research.component';

@NgModule({
  declarations: [ResearchComponent, DisplayResearchComponent, ExpandResearchComponent],
  imports: [ResearchRoutingModule, SharedModule, CommonModule],
})
export class ResearchModule{}
