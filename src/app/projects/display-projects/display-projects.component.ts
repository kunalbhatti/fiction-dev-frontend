import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  first
} from 'rxjs/operators';
import {
  ContentService
} from './../../services/content.service';
import {
  CacheService
} from './../../services/cache.service';
import {
  Project
} from './../../models/project.interface';
import {
  MediaService
} from 'src/app/services/media.service';
import {
  Subscription
} from 'rxjs';
import {
  MatTabChangeEvent
} from '@angular/material/tabs';

@Component({
  selector: 'app-display-projects',
  templateUrl: './display-projects.component.html',
  styleUrls: ['./display-projects.component.css']
})
export class DisplayProjectsComponent implements OnInit, AfterViewInit, OnDestroy {

  projectType: string;
  projects: Project[] = [];
  selectedProject: Project;

  selectedIndex: number;

  private mediaSub: Subscription;
  mediaPriority: number;
  mediaSize: string;
  containerWidth: string;

  loadingContent: string;

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
    private cacheService: CacheService,
    private mediaService: MediaService,
    private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.projectType = params.get('projectType');
        this.loadingContent = 'loading';
        if (this.projectType === 'modules') {
          this.selectedIndex = 0;
        } else if (this.projectType === 'builds') {
          this.selectedIndex = 1;
        }
        this.getProjects(this.projectType.substring(0, this.projectType.length - 1));
      }
    );
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

  getProjects(projectType): void {
    if (this.checkCache()) {
      this.loadCache();
      this.selectedProject = this.projects[0];
      this.loadingContent = '';
    } else {
      this.contentService.getProjects(projectType).pipe(first()).subscribe(
        project => {
          this.projects = project.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            };
          });
          this.updateCache(this.projects);
          this.selectedProject = this.projects[0];
          this.loadingContent = '';
        }
      );
    }
  }

  checkCache(): boolean {
    if (this.projectType === 'builds' && this.cacheService.builds.length > 0) {
      return true;
    } else if (this.projectType === 'modules' && this.cacheService.modules.length > 0) {
      return true;
    }
    return false;
  }

  loadCache(): void {
    if (this.projectType === 'builds') {
      this.projects = this.cacheService.builds;
    } else {
      this.projects = this.cacheService.modules;
    }
  }

  updateCache(projectData: Project[]): void {
    if (this.projectType === 'builds') {
      this.cacheService.builds = projectData;
    } else {
      this.cacheService.modules = projectData;
    }
  }

  projectTagArr(): any {
    try {
      return Object.entries(this.selectedProject.projectTags);
    } catch (err) {
      return false;
    }
  }

  researchTagArr(): any {
    try {
      return Object.entries(this.selectedProject.researchTags);
    } catch (err) {
      return false;
    }
  }

  navigateTo(tabGroup: EventEmitter < MatTabChangeEvent > ): void {
    if (tabGroup['index'] === 0) {
      this.router.navigate(['/', 'projects', 'display-projects', 'modules']);
    } else if (tabGroup['index'] === 1) {
      this.router.navigate(['/', 'projects', 'display-projects', 'builds']);
    }
  }
  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }
}
