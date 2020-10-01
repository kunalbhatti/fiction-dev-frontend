import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  Project
} from 'src/app/models/project.interface';

import {
  Research
} from './../../models/research.interface';

import {
  CacheService
} from './../../services/cache.service';
import {
  ContentService
} from './../../services/content.service';
import {
  MediaService
} from './../../services/media.service';



@Component({
  selector: 'app-project-tags',
  templateUrl: './project-tags.component.html',
  styleUrls: ['./project-tags.component.css']
})
export class ProjectTagsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() projectTags: any[];
  @Input() researchTags: any[];

  projectCache: Project[] = [];
  selectedProject: any = '';

  researchCache: Research[] = [];
  selectedResearch: any = '';

  selectedTab = 'projects';
  lastOpenProjectId = '';
  lastOpenResearchId = '';

  mediaSub: Subscription;
  mainContainerHeight = 'calc(100vh - 162px)';

  constructor(private cacheService: CacheService,
              private contentService: ContentService,
              private mediaService: MediaService) {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.mediaSub = this.mediaService.getMediaSize().subscribe(
      changes => {
        const mediaSize = changes.mqAlias;
        const mediaPriority = changes.priority;
        if (mediaSize === 'xs') {
          if (this.projectTags.length === 0 && this.researchTags.length === 0) {
            this.mainContainerHeight = 'calc(100vh - 162px)';
          }
        }
      }
    );
  }

  getProject(projectId: string): void {
    this.projectCache = [];

    if (this.lastOpenProjectId !== projectId) {
      this.selectedProject = 'loading';

      if (this.cacheService.builds) {
        this.projectCache = this.projectCache.concat(this.cacheService.builds);
        for (const project of this.projectCache) {
          if (project.id === projectId) {
            this.selectedProject = project;
            this.lastOpenProjectId = projectId;
            return;
          }
        }
      }

      this.projectCache = [];

      if (this.cacheService.modules) {
        this.projectCache = this.projectCache.concat(this.cacheService.modules);
        for (const project of this.projectCache) {
          if (project.id === projectId) {
            this.selectedProject = project;
            this.lastOpenProjectId = projectId;
            return;
          }
        }
      }

      if (this.cacheService.projectBuffer) {
        this.projectCache = this.projectCache.concat(this.cacheService.projectBuffer);
        for (const project of this.projectCache) {
          if (project.id === projectId) {
            this.selectedProject = project;
            this.lastOpenProjectId = projectId;
            return;
          }
        }
      }

      this.contentService.getProject(projectId).then(
        projectData => {
          if (!projectData) {
            alert('Project could not be loaded');
          } else {
            this.selectedProject = projectData.data();
            this.selectedProject.id = projectData.id;
            this.cacheService.projectBuffer = this.cacheService.projectBuffer.concat(this.selectedProject);
          }
        }
      );
    }
  }


  getResearch(researchId: string): void {
    this.researchCache = [];

    if (this.lastOpenResearchId !== researchId) {
      this.selectedResearch = 'loading';

      if (this.cacheService.builds) {
        this.researchCache = this.researchCache.concat(this.cacheService.concepts);
        for (const research of this.researchCache) {
          if (research.id === researchId) {
            this.selectedResearch = research;
            this.lastOpenResearchId = researchId;
            return;
          }
        }
      }

      this.researchCache = [];

      if (this.cacheService.modules) {
        this.researchCache = this.researchCache.concat(this.cacheService.code);
        for (const research of this.researchCache) {
          if (research.id === researchId) {
            this.selectedResearch = research;
            this.lastOpenResearchId = researchId;
            return;
          }
        }
      }

      if (this.cacheService.researchBuffer) {
        this.researchCache = this.researchCache.concat(this.cacheService.researchBuffer);
        for (const research of this.researchCache) {
          if (research.id === researchId) {
            this.selectedResearch = research;
            this.lastOpenResearchId = researchId;
            return;
          }
        }
      }

      this.contentService.getResearchItem(researchId).then(
        researchData => {
          if (!researchData) {
            alert('Research could not be loaded');
          } else {
            this.selectedResearch = researchData.data();
            this.selectedResearch.id = researchData.id;
            this.cacheService.researchBuffer = this.cacheService.researchBuffer.concat(this.selectedResearch);
          }
        }
      );
    }
  }

  projectTagArr(): any {
    let target: any;
    if (this.selectedProject) {
      target = this.selectedProject;
    } else if (this.selectedResearch) {
      target = this.selectedResearch;
    }

    try {
      return Object.entries(target.projectTags);
    } catch (err) {
      return false;
    }
  }

  researchTagArr(): any {
    let target: any;
    if (this.selectedProject) {
      target = this.selectedProject;
    } else if (this.selectedResearch) {
      target = this.selectedResearch;
    }

    try {
      return Object.entries(target.researchTags);
    } catch (err) {
      return false;
    }
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }
}
