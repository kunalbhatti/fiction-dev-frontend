import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Input,
  ɵCompiler_compileModuleSync__POST_R3__,
} from '@angular/core';

import {
  CommentService
} from './../../services/comment.service';
import {
  ScrollDetectService
} from './../../services/scroll-detect.service';
import {
  AuthService
} from './../../services/auth.service';
import {
  CacheService
} from './../../services/cache.service';

import {
  NgForm
} from '@angular/forms';
import {
  firestore,
} from 'firebase/app';

import {
  Subscription,
} from 'rxjs';
import {
  first
} from 'rxjs/operators';

import {
  Post
} from './../../models/post.interface';
import {
  Comment
} from './../../models/comment.interface';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})

export class CommentBoxComponent implements OnInit, OnChanges, OnDestroy {

  @Input() postData: Post;
  @Input() type: string;
  @Input() postCount: number;

  commentSub: Subscription;
  loadSub: Subscription;

  comments: Comment[] = [];
  lastItem: any;
  eof: string;

  showCommentBox: boolean;
  showTagBox: boolean;
  selectedComment: {
    uid: string;
    cid: string;
    commentData: string;
  };

  commentBuffer: Comment[] = [];

  loadMore = true;

  userData: any;
  loggedUserId: string;
  authSub: Subscription;
  isLoggedIn = false;

  constructor(private commentService: CommentService,
    private cacheService: CacheService,
    private authService: AuthService,
    private scrollService: ScrollDetectService) {}

  ngOnInit(): void {
    this.eof = 'loading';

    this.showCommentBox = false;
    this.showTagBox = false;

    this.authSub = this.authService.loggedInEvent.subscribe(
      (loginStatus: boolean) => {
        this.isLoggedIn = loginStatus;
        if (loginStatus) {
          this.userData = JSON.parse(localStorage.getItem('user'));
          this.loggedUserId = this.userData.uid;
        }
      });

    this.selectedComment = {
      uid: '',
      cid: '',
      commentData: ''
    };
    this.checkIfLoggedIn();
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {}

  checkIfLoggedIn(): void {
    this.authService.isAuthenticated().then(
      authenticated => {
        this.isLoggedIn = authenticated;
        if (this.isLoggedIn) {
          this.userData = JSON.parse(localStorage.getItem('user'));
          this.loggedUserId = this.userData.uid;
        } else {
          this.loggedUserId = '';
        }
      }
    );
  }

  postComment(form: NgForm): void {
    const data = {
      comment: form.value.comment,
      date: firestore.FieldValue.serverTimestamp(),
      editStatus: '',
      voteCount: 0
    };
    const statusTitle = this.type === 'post' ? this.postData.title : this.postData.name;
    this.commentService.postComment(data, this.postData.id, statusTitle, this.postData.date,
        this.userData.displayName, this.postData.uid, this.type)
      .then(commentData => {
        this.postData.commentCount += 1;
        let comment: Comment;
        comment = {
          comment: data.comment,
          date: firestore.Timestamp.fromDate(new Date()),
          ediStatus: '',
          votes: {},
          voteCount: 0,
          uid: this.postData.uid,
          name: this.userData.displayName,
          id: commentData.id
        };
        this.comments.unshift(comment);
        this.updateCache();
      });
    form.reset();
  }

  updateComment(form: NgForm): void {
    const data = {
      comment: form.value.comment,
      date: firestore.FieldValue.serverTimestamp()
    };
    this.commentService.updateComment(this.postData.id, this.selectedComment.uid,
      this.selectedComment.cid, this.type, data).then(
      updated => {
        if (updated) {
          for (const comment of this.comments) {
            if (comment.id === this.selectedComment.cid) {
              comment.comment = data.comment;
              comment.date = firestore.Timestamp.fromDate(new Date());
              break;
            }
          }
          this.updateCache();
          this.selectedComment.cid = '';
        }
      }
    );
    form.reset();
  }

  deleteComment(cid: string): void {
    const deleteConfirm = confirm('Do you wish to delete this comment?');
    if (deleteConfirm) {
      this.commentService.deleteComment(this.loggedUserId, this.postData.id, cid, this.type).then(
        deleted => {
          if (deleted) {
            this.postData.commentCount -= 1;
            for (let i = 0; i < this.comments.length; i++) {
              if (this.comments[i].id === cid) {
                this.comments.splice(i, 1);
                break;
              }
            }
            this.updateCache();
          }
        }
      );
    }
  }

  getComments(firstComment ?: boolean): void {
    this.checkIfLoggedIn();
    if (!this.showCommentBox) {
      this.comments = this.loadCache();
      if (this.postData.commentCount === this.comments.length) {
        this.showCommentBox = !this.showCommentBox;
        if (firstComment) {
          this.showCommentBox = !this.showCommentBox;
        }
        this.showTagBox = false;
        return;
      } else {
        const data = this.commentService.getComments(this.postData.id, this.type);
        this.commentSub = data.pipe(first()).subscribe(commentData => {
          this.comments = commentData.map(e => {
            // Setting eof to '' only when the data is retrieved from the server
            this.eof = '';
            this.lastItem = commentData[commentData.length - 1].payload.doc;

            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as {}
            };
          });
          this.updateCache();
        });
      }
    }

    this.showCommentBox = !this.showCommentBox;
    if (firstComment) {
      this.showCommentBox = !this.showCommentBox;
    }
    this.showTagBox = false;
  }

  loadNextComments(): void {
    if (this.lastItem != null) {
      this.eof = 'loading';
      const data = this.commentService.loadNext(this.postData.id, this.lastItem, this.type);

      if (data) {
        this.loadSub = data.pipe(first()).subscribe(statusData => {
          // updating the lastItem with the current iteration of data received
          this.lastItem = statusData.docs[statusData.docs.length - 1];
          this.eof = '';

          const nextComments = statusData.docs.map(e => {
            return {
              id: e.id,
              ...e.data() as {}
            };
          });
          // concatinating the new data with the old data in the statusData array
          this.comments = this.comments.concat(nextComments);

          if (this.comments.length > this.postData.commentCount) {
            this.postData.commentCount = this.comments.length;
          }
          if (this.comments.length === this.postData.commentCount) {
            this.loadMore = false;
          }
          this.updateCache();
        });
      } else {
        this.lastItem = null;
        this.eof = 'end';
      }
    }
  }

  updateCache(): void {
    this.cacheService.comments = {
      [this.postData.id]: this.comments
    };
  }

  loadCache(): Comment[] {
    try {
      const tempCache = this.cacheService.comments[this.postData.id];
      if (tempCache) {
        return tempCache;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  manageStatusVote(voteType: string): void {
    try {
      let voteVal = 1;
      let pastVote: string;
      const statusVoteCount = this.postData.voteCount;

      try {
        pastVote = this.postData.votes[this.loggedUserId];
      } catch (error) {}
      if (pastVote) {
        voteVal = 2;
      }
      voteVal = voteType === 'like' ? voteVal * 1 : voteVal * -1;
      let newVote = voteType === 'like' ? 1 : -1;

      if (pastVote === 'like' && voteType === 'dislike') {
        newVote = -2;
      } else if (pastVote === 'dislike' && voteType === 'like') {
        newVote = 2;
      }

      if (pastVote !== voteType) {
        this.commentService.manageStatusVote(this.loggedUserId, this.postData.id, newVote, this.type);
        if (!this.postData.voteCount) {
          this.postData.voteCount = 0;
          this.postData.votes = {
            [this.loggedUserId]: voteType
          };
        }

        this.postData.votes[this.loggedUserId] = voteType;
        this.postData.voteCount += voteVal;
      }
    } catch (err) {
      alert('Please login to vote!!');
    }
  }

  manageCommentVote(voteType: string, comment: any, commentNumber: number): void {
    let voteVal = 1;
    let pastVote: string;
    const commentVoteCount = comment.voteCount;

    try {
      pastVote = comment.votes[this.loggedUserId];
    } catch (error) {}
    if (pastVote) {
      voteVal = 2;
    }
    voteVal = voteType === 'like' ? voteVal * 1 : voteVal * -1;
    let newVote = voteType === 'like' ? 1 : -1;

    if (pastVote === 'like' && voteType === 'dislike') {
      newVote = -2;
    } else if (pastVote === 'dislike' && voteType === 'like') {
      newVote = 2;
    }

    if (pastVote !== voteType) {
      this.commentService.manageCommentVote(this.loggedUserId, this.postData.id, comment.id, newVote, this.type);
      if (!this.comments[commentNumber].voteCount) {
        this.comments[commentNumber].voteCount = 0;
        this.comments[commentNumber].votes = {
          [this.loggedUserId]: voteType
        };
      }

      this.comments[commentNumber].votes[this.loggedUserId] = voteType;
      this.comments[commentNumber].voteCount += voteVal;
    }
  }

  trackByCommentId(index: number, comment: any): string {
    return comment.id;
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    try {
      this.commentSub.unsubscribe();
      this.loadSub.unsubscribe();
    } catch (error) {}
  }

}
