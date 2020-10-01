import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {
  ActivatedRoute,
} from '@angular/router';

import {
  Location
} from '@angular/common';

import {
  Subscription
} from 'rxjs';

import {
  MediaService
} from 'src/app/services/media.service';
import {
  CacheService
} from './../../services/cache.service';
import {
  ContentService
} from './../../services/content.service';

import {
  Project
} from './../../models/project.interface';


@Component({
  selector: 'app-expand-project',
  templateUrl: './expand-project.component.html',
  styleUrls: ['./expand-project.component.css']
})
export class ExpandProjectComponent implements OnInit, AfterViewInit, OnDestroy {

  private projectId: string;
  projectData: Project;
  projectDataArray: Project[] = [];
  statusTags: [string, string][] = [];
  projectTags: [string, string][] = [];
  researchTags: [string, string][] = [];

  private mediaSub: Subscription;
  mediaPriority: number;
  mediaSize: string;
  containerWidth: string;

  selectedTab = 'basic';

  loadingContent: string;
  constructor(private mediaService: MediaService,
              private route: ActivatedRoute,
              private cacheService: CacheService,
              private contentService: ContentService,
              private location: Location) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.projectId = params.get('projectId');
        this.getProjectData();
        this.selectedTab = 'basic';
      }
    );
  }

  getProjectData(): void {
    this.projectDataArray = [];
    if (this.cacheService.builds) {
      this.projectDataArray = this.projectDataArray.concat(this.cacheService.builds);
      this.extractTags(this.projectDataArray);
    }
    this.projectDataArray = [];
    if (this.cacheService.modules) {
      this.projectDataArray = this.projectDataArray.concat(this.cacheService.modules);
      this.extractTags(this.projectDataArray);
    }
    this.projectDataArray = [];
    if (this.cacheService.projectBuffer) {
      this.projectDataArray = this.projectDataArray.concat(this.cacheService.projectBuffer);
      this.extractTags(this.projectDataArray);
    }

    this.contentService.getProject(this.projectId).then(
      projectData => {
        if (!projectData) {
          alert('Project could not be loaded');
        } else {
          this.projectData = projectData.data();
          this.projectData.id = projectData.id;
          this.cacheService.projectBuffer = this.cacheService.projectBuffer.concat(this.projectData);
          try {
            this.statusTags = Object.entries(this.projectData.statusTags);
          } catch (err) {}
          try {
            this.projectTags = Object.entries(this.projectData.projectTags);
          } catch (err) {}
          try {
            this.researchTags = Object.entries(this.projectData.researchTags);
          } catch (err) {}
        }
      }
    );
  }

  extractTags(projectData: Project[]): void {
    for (const project of this.projectDataArray) {
      if (project.id === this.projectId) {
        this.projectData = project;
        try {
          this.statusTags = Object.entries(this.projectData.statusTags);
        } catch (err) {}
        try {
          this.projectTags = Object.entries(this.projectData.projectTags);
        } catch (err) {}
        try {
          this.researchTags = Object.entries(this.projectData.researchTags);
        } catch (err) {}
        return;
      }
    }
  }

  ngAfterViewInit(): void {
    this.mediaSub = this.mediaService.getMediaSize().subscribe(
      changes => {
        this.mediaSize = changes.mqAlias;
        this.mediaPriority = changes.priority;
        if (this.mediaSize === 'xs' || this.mediaSize === 'sm') {
          this.containerWidth = '100';
        } else {
          this.containerWidth = '80';
        }
      }
    );
  }

  goBack(): any {
    this.location.back();
  }
  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }
}
