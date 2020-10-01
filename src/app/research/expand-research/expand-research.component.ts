import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  Location
} from '@angular/common';
import {
  ContentService
} from './../../services/content.service';
import {
  CacheService
} from './../../services/cache.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  MediaService
} from './../../services/media.service';
import {
  Subscription
} from 'rxjs';
import {
  Research
} from './../../models/research.interface';

@Component({
  selector: 'app-expand-research',
  templateUrl: './expand-research.component.html',
  styleUrls: ['./expand-research.component.css']
})
export class ExpandResearchComponent implements OnInit, AfterViewInit, OnDestroy {

  private researchId: string;
  researchData: Research;
  researchDataArray: Research[] = [];
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
        this.researchId = params.get('researchId');
        this.getResearchData();
        this.selectedTab = 'basic';
      }
    );
  }

  getResearchData(): void {
    this.researchDataArray = [];
    if (this.cacheService.builds) {
      this.researchDataArray = this.researchDataArray.concat(this.cacheService.concepts);
      this.extractTags(this.researchDataArray);
    }
    this.researchDataArray = [];
    if (this.cacheService.modules) {
      this.researchDataArray = this.researchDataArray.concat(this.cacheService.code);
      this.extractTags(this.researchDataArray);
    }
    this.researchDataArray = [];
    if (this.cacheService.researchBuffer) {
      this.researchDataArray = this.researchDataArray.concat(this.cacheService.researchBuffer);
      this.extractTags(this.researchDataArray);
    }

    this.contentService.getResearchItem(this.researchId).then(
      researchData => {
        if (!researchData) {
          alert('research could not be loaded');
        } else {
          this.researchData = researchData.data();
          this.researchData.id = researchData.id;
          this.cacheService.researchBuffer = this.cacheService.researchBuffer.concat(this.researchData);
          try {
            this.statusTags = Object.entries(this.researchData.statusTags);
          } catch (err) {}
          try {
            this.projectTags = Object.entries(this.researchData.projectTags);
          } catch (err) {}
          try {
            this.researchTags = Object.entries(this.researchData.researchTags);
          } catch (err) {}
        }
      }
    );
  }

  extractTags(researchData: Research[]): void {
    for (const research of this.researchDataArray) {
      if (research.id === this.researchId) {
        this.researchData = research;
        try {
          this.statusTags = Object.entries(this.researchData.statusTags);
        } catch (err) {}
        try {
          this.projectTags = Object.entries(this.researchData.projectTags);
        } catch (err) {}
        try {
          this.researchTags = Object.entries(this.researchData.researchTags);
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
