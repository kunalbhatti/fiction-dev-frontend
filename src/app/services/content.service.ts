import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class ContentService {

  constructor(private db: AngularFirestore) {}

  getPosts(): any {
    const data = this.db.collection('Users_Posts',
      ref => ref.orderBy('date', 'desc').limit(10)).snapshotChanges();

    return data;
  }

  loadNextPosts(lastItem: any): Observable < any > {
    if (lastItem) {
      return this.db.collection('Users_Posts', ref =>
        ref.orderBy('date', 'desc').limit(5).startAfter(lastItem)
      ).get();
    } else {
      return null;
    }
  }

  getProjects(projectType: string): any {
    return this.db.collection('Users_Projects',
      ref => ref.where('type', '==', projectType).orderBy('date', 'desc')).snapshotChanges();
  }

  getResearch(researchType: string): any {
    return this.db.collection('Users_Research',
      ref => ref.where('type', '==', researchType).orderBy('date', 'desc')).snapshotChanges();
  }

  getProject(projectId: string): any {
    return this.db.collection('Users_Projects').doc(projectId).ref.get();
  }

  getResearchItem(researchId: string): any {
    return this.db.collection('Users_Research').doc(researchId).ref.get();
  }

  getPost(postId: string): any {
    return this.db.collection('Users_Posts').doc(postId).snapshotChanges();
  }
}
