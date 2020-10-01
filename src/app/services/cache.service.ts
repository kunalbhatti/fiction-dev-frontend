import {
  Injectable
} from '@angular/core';

import {
  Project
} from './../models/project.interface';

import {
  Research
} from './../models/research.interface';

import {
  Comment
} from './../models/comment.interface';

@Injectable({
  providedIn: 'root'
})

export class CacheService {
  posts: any;
  lastPostItem: any;


  comments: {[id: string]: Comment[]};

  builds: Project[] = [];
  modules: Project[] = [];

  projectBuffer: Project[] = [];

  concepts: Research[] = [];
  code: Research[] = [];

  researchBuffer: Research[] = [];
}
