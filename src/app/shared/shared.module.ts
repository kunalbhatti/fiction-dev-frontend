import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../core/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CommentBoxComponent } from './comment-box/comment-box.component';
import { ProjectBasicComponent } from './project-basic/project-basic.component';
import { ResearchBasicComponent } from './research-basic/research-basic.component';
import { ProjectTagsComponent } from './project-tags/project-tags.component';
import { ProjectNotesComponent } from './project-notes/project-notes.component';
import { ProjectCommentsComponent } from './project-comments/project-comments.component';
import { PluginsModule } from './../plugins/plugins.module';

import { EscapeHtmlPipe } from './../pipes/html-sanitizer.pipe';
import { UrlSanitizePipe } from './../pipes/url-sanitizer.pipe';



const SharedComponents = [
  CommentBoxComponent,
  ProjectBasicComponent,
  ResearchBasicComponent,
  ProjectTagsComponent,
  ProjectNotesComponent,
  ProjectCommentsComponent,
  EscapeHtmlPipe,
  UrlSanitizePipe
];

@NgModule({
  declarations: [SharedComponents],
  imports: [
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    RouterModule,
    CommonModule,
    PluginsModule
  ],
  exports: [
    SharedComponents,
    MaterialModule,
    FlexLayoutModule,
  ],
  providers: [UrlSanitizePipe]
})
export class SharedModule{ }
