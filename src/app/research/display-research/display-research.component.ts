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
  Research
} from './../../models/research.interface';
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
  selector: 'app-display-research',
  templateUrl: './display-research.component.html',
  styleUrls: ['./display-research.component.css']
})
export class DisplayResearchComponent implements OnInit, AfterViewInit, OnDestroy {

  researchType: string;
  researchList: Research[] = [];
  selectedResearch: Research;

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
        this.researchType = params.get('researchType');
        this.loadingContent = 'loading';
        if (this.researchType === 'concepts') {
          this.selectedIndex = 0;
        } else if (this.researchType === 'codes') {
          this.selectedIndex = 1;
        }
        this.getResearch(this.researchType.substring(0, this.researchType.length - 1));
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

  getResearch(researchType): void {
    if (this.checkCache()) {
      this.loadCache();
      this.selectedResearch = this.researchList[0];
      this.loadingContent = '';
    } else {
      this.contentService.getResearch(researchType).pipe(first()).subscribe(
        research => {
          this.researchList = research.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            };
          });
          this.updateCache(this.researchList);
          this.selectedResearch = this.researchList[0];
          this.loadingContent = '';
        }
      );
    }
  }

  checkCache(): boolean {
    if (this.researchType === 'concepts' && this.cacheService.concepts.length > 0) {
      return true;
    } else if (this.researchType === 'codes' && this.cacheService.code.length > 0) {
      return true;
    }
    return false;
  }

  loadCache(): void {
    if (this.researchType === 'concepts') {
      this.researchList = this.cacheService.concepts;
    } else {
      this.researchList = this.cacheService.code;
    }
  }

  updateCache(researchData: Research[]): void {
    if (this.researchType === 'concepts') {
      this.cacheService.concepts = researchData;
    } else {
      this.cacheService.code = researchData;
    }
  }

  projectTagArr(): any {
    try {
      return Object.entries(this.selectedResearch.projectTags);
    } catch (err) {
      return false;
    }
  }

  researchTagArr(): any {
    try {
      return Object.entries(this.selectedResearch.researchTags);
    } catch (err) {
      return false;
    }
  }

  navigateTo(tabGroup: EventEmitter < MatTabChangeEvent > ): void {
    if (tabGroup['index'] === 0) {
      this.router.navigate(['/', 'research', 'display-research', 'concepts']);
    } else if (tabGroup['index'] === 1) {
      this.router.navigate(['/', 'research', 'display-research', 'codes']);
    }
  }
  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }

}
