import {
  Research
} from './../../models/research.interface';
import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  CommentService
} from './../../services/comment.service';
import {
  Subscription
} from 'rxjs';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  ScrollDetectService
} from 'src/app/services/scroll-detect.service';
import {
  NgForm
} from '@angular/forms';
import {
  firestore
} from 'firebase';

import {
  MediaService
} from 'src/app/services/media.service';

import {
  Project
} from './../../models/project.interface';
import {
  Comment
} from './../../models/comment.interface';

@Component({
  selector: 'app-project-comments',
  templateUrl: './project-comments.component.html',
  styleUrls: ['./project-comments.component.css']
})
export class ProjectCommentsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() postData: any;
  @Input() type: string;

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

  userData: any;
  loggedUserId: string;
  authSub: Subscription;
  isLoggedIn = false;

  mediaSub: Subscription;
  inputContainerHeight: string;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private scrollService: ScrollDetectService,
    private mediaService: MediaService) {}

  ngOnInit(): void {
    this.eof = 'loading';

    this.showCommentBox = false;
    this.showTagBox = false;

    this.authSub = this.authService.loggedInEvent.subscribe(
      (loginStatus: boolean) => {
        this.isLoggedIn = loginStatus;
        if (loginStatus) {
          this.userData = JSON.parse(localStorage.getItem('user'));
        }
      }
    );

    this.selectedComment = {
      uid: '',
      cid: '',
      commentData: ''
    };

    this.checkIfLoggedIn();
  }

  ngAfterViewInit(): void {
    this.mediaSub = this.mediaService.getMediaSize().subscribe(
      changes => {
        const mediaSize = changes.mqAlias;
        const mediaPriority = changes.priority;
        if (mediaSize === 'xs' || mediaSize === 'sm') {
          this.inputContainerHeight = '72px';
        } else {
          this.inputContainerHeight = '75px';
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getComments();
  }

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
    };
    const statusTitle = this.postData.name;
    this.commentService.
    postComment(data, this.postData.id, statusTitle, this.postData.date, this.userData.displayName, this.postData.uid, this.type);
    form.reset();

    if (this.postData.commentCount === 0) {
      this.getComments(true);
    }
  }

  updateComment(form: NgForm): void {
    const data = {
      comment: form.value.comment,
      date: firestore.FieldValue.serverTimestamp()
    };
    this.commentService.updateComment(this.postData.id, this.selectedComment.uid, this.selectedComment.cid, this.type, data);
    form.reset();
    this.selectedComment.cid = '';
  }

  deleteComment(cid: string): void {

    const deleteConfirm = confirm('Do you wish to delete this comment?');
    if (deleteConfirm) {
      this.commentService.deleteComment(this.loggedUserId, this.postData.id, cid, this.type).then(
        deleted => {
          if (deleted) {
            for (let i = 0; i < this.comments.length; i++) {
              if (this.comments[i].id === cid) {
                this.comments.splice(i, 1);
                this.postData.commentCount -= 1;
                break;
              }
            }

            for (let i = 0; i < this.commentBuffer.length; i++) {
              if (this.commentBuffer[i].id === cid) {
                this.commentBuffer.splice(i, 1);
                break;
              }
            }
          }
        }
      );
    }
  }

  getComments(firstComment ? : boolean): void {
    this.checkIfLoggedIn();
    const data = this.commentService.getComments(this.postData.id, this.type);
    this.commentSub = data.subscribe(commentData => {
      this.comments = commentData.map(e => {
        // Setting eof to '' only when the data is retrieved from the server
        this.eof = '';
        this.lastItem = commentData[commentData.length - 1].payload.doc;

        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        };
      });
      this.comments = this.comments.concat(this.commentBuffer);
    });


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
        this.loadSub = data.subscribe(statusData => {
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
          this.commentBuffer = this.commentBuffer.concat(nextComments);
          this.comments = this.comments.concat(nextComments);
        });
      } else {
        this.lastItem = null;
        this.eof = 'end';
      }
    }
  }

  manageStatusVote(voteType: string): void {
    try {
      let voteVal = 1;
      let pastVote;
      const statusVoteCount = this.postData.voteCount;

      try {
        pastVote = this.postData.votes[this.loggedUserId];
      } catch (error) {}
      if (pastVote) {
        voteVal = 2;
      }
      voteVal = voteType === 'like' ? voteVal * 1 : voteVal * -1;
      if (pastVote !== voteType) {
        this.commentService.manageStatusVote(this.loggedUserId, this.postData.id, voteVal, this.type);
      }
    } catch (err) {
      alert('Please login to vote!!');
    }
  }

  manageCommentVote(voteType: string, comment: any, commentNumber: number): void {
    let voteVal = 1;
    let pastVote;
    const commentVoteCount = comment.voteCount;

    try {
      pastVote = comment.votes[this.loggedUserId];
    } catch (error) {}
    if (pastVote) {
      voteVal = 2;
    }
    voteVal = voteType === 'like' ? voteVal * 1 : voteVal * -1;
    if (pastVote !== voteType) {
      this.commentService.manageCommentVote(this.loggedUserId, this.postData.id, comment.id, voteVal, this.type);
      if (commentNumber > 4) {
        if (!this.comments[commentNumber].voteCount) {
          this.comments[commentNumber].voteCount = 0;
          this.comments[commentNumber].votes[this.loggedUserId] = voteType;
        }
        this.comments[commentNumber].votes[this.loggedUserId] = voteType;
        this.comments[commentNumber].voteCount += voteVal;
      }
    }
  }

  trackByCommentId(index: number, comment: any): string {
    return comment.id;
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
    this.authSub.unsubscribe();
    try {
      this.commentSub.unsubscribe();
      this.loadSub.unsubscribe();
    } catch (error) {}
  }

}
