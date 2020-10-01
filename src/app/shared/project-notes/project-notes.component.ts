import {
  ContentService
} from './../../services/content.service';
import {
  Observable,
  Subscription
} from 'rxjs';
import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';

import {
  Post
} from './../../models/post.interface';

@Component({
  selector: 'app-project-notes',
  templateUrl: './project-notes.component.html',
  styleUrls: ['./project-notes.component.css']
})
export class ProjectNotesComponent implements OnInit, OnDestroy {
  @Input() statusTags: any[];

  statusTagsArray: any[] = [];

  posts: Post[] = [];
  postSub: Subscription[] = [];

  loadingData: string;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.loadingData = 'loading';
    this.getStatusTags();
  }

  getStatusTags(): void {
    if (this.statusTags.length === 0) {
      this.loadingData = '';
    }
    this.statusTags.forEach((tag, i) => {
      this.postSub[i] = this.contentService.getPost(tag[0]).subscribe(
        data => {
          this.posts[i] = data.payload.data();
          this.posts[i].id = data.payload.id;
          if (i === this.statusTags.length - 1) {
            this.loadingData = '';
          }
        }
      );
    });
  }

  trackByStatusId(index: number, status: any): string {
    return status.id;
  }

  ngOnDestroy(): void {
    for (const sub of this.postSub) {
      sub.unsubscribe();
    }
  }
}
