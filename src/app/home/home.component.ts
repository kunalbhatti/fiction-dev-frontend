import {
  MediaService
} from './../services/media.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  Subscription
} from 'rxjs';

import {
  ContentService
} from './../services/content.service';
import {
  ScrollDetectService
} from './../services/scroll-detect.service';
import {
  CacheService
} from './../services/cache.service';

import {
  first
} from 'rxjs/operators';


import {
  Post
} from '../models/post.interface';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  mediaSize: string;
  posts: Post[];
  lastItem: any;
  eof = 'loading';

  containerWidth: string;

  private mediaSub: Subscription;
  private postSub: Subscription;
  mediaPriority: number;

  constructor(
    private contentService: ContentService,
    private mediaService: MediaService,
    private scrollService: ScrollDetectService,
    private cacheService: CacheService) {}

  ngOnInit(): void {
    this.getPosts();
    this.scrollService.scrollEndDetection.subscribe(
      (state: boolean) => {
        this.loadNext();
      }
    );
  }

  getPosts(): void {
    const data = this.contentService.getPosts();
    this.postSub = data.pipe(first()).subscribe(posts => {
      this.posts = posts.map(e => {
        this.eof = '';
        this.lastItem = posts[posts.length - 1].payload.doc;
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        };
      });
      this.loadCache();
    });
  }

  loadNext(): void {

    if (this.lastItem != null) {
      this.eof = 'loading';
      const data = this.contentService.loadNextPosts(this.lastItem);
      if (data) {
        data.pipe(first()).subscribe(statusData => {
          // Setting eof to '' only when the data is retrieved from the server
          this.eof = '';

          // updating the lastItem with the current iteration of data received
          this.lastItem = statusData.docs[statusData.docs.length - 1];

          // if there is a new latItem it means we are not at the end of the list
          if (this.lastItem) {
            this.updateCache(statusData, this.lastItem);
          }

          const nextStatus = statusData.docs.map(e => {
            return {
              id: e.id,
              ...e.data() as {}
            };
          });
          // concatinating the new data with the old data in the posts array
          this.posts = this.posts.concat(nextStatus);
        });
      } else {
        this.lastItem = null;
      }
    }
  }

  updateCache(cacheData: any, lastItem: any): void {
    // this.cacheService.posts = this.cacheService.posts.concat(cacheData);
    this.cacheService.posts = cacheData;
    if (lastItem) {
      this.cacheService.lastPostItem = lastItem;
    }
  }

  loadCache(): void {
    const cachedPosts = this.cacheService.posts;

    if (cachedPosts) {
      const nextStatus = cachedPosts.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as {}
        };
      });
      this.posts = this.posts.concat(nextStatus);

      if (this.cacheService.lastPostItem) {
        this.lastItem = this.cacheService.lastPostItem;
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

  trackByStatusId(index: number, status: any): string {
    return status.id;
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
    this.postSub.unsubscribe();
  }
}
