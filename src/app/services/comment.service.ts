import {
  AuthService
} from './auth.service';
import {
  Injectable
} from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  firestore
} from 'firebase/app';
import {
  first
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private authService: AuthService, private db: AngularFirestore) {}

  getComments(sid: string, type: string): any {
    let tableName;
    if (type === 'post') {
      tableName = 'Users_Posts';
    } else if (type === 'project') {
      tableName = 'Users_Projects';
    } else if (type === 'research') {
      tableName = 'Users_Research';
    }

    const data = this.db.collection(tableName).doc(sid).collection('Comments',
      ref => ref.orderBy('date', 'desc').limit(5)).snapshotChanges();

    return data;
  }

  loadNext(sid: string, lastItem: any, type: string): any {

    let tableName;

    if (type === 'post') {
      tableName = 'Users_Posts';
    } else if (type === 'project') {
      tableName = 'Users_Projects';
    } else if (type === 'research') {
      tableName = 'Users_Research';
    }

    if (lastItem) {
      return this.db.collection(tableName).doc(sid).collection('Comments', ref =>
        ref.limit(5).orderBy('date', 'desc').startAfter(lastItem)
      ).get();
    } else {
      return null;
    }
  }

  manageStatusVote(uid: string, sid: string, voteValue: number, type: string): void {
    let tableName;

    if (type === 'post') {
      tableName = 'Users_Posts';
    } else if (type === 'project') {
      tableName = 'Users_Projects';
    } else if (type === 'research') {
      tableName = 'Users_Research';
    }


    const voteType = voteValue > 0 ? 'like' : 'dislike';
    this.authService.getCurrentUser().pipe(first()).subscribe(
      user => {
        try {
          if (user.uid === uid) {
            this.db.collection(tableName).doc(sid).set({
              votes: {
                [uid]: voteType
              },
              voteCount: firestore.FieldValue.increment(voteValue),
              lastUpdated: firestore.FieldValue.serverTimestamp()
            }, {
              merge: true
            });
          }
        } catch (err) {
          alert('Please log in!');
        }
      });
  }

  manageCommentVote(uid: string, sid: string, cid: string, voteValue: number, type: string): void {
    let tableName;

    if (type === 'post') {
      tableName = 'Users_Posts';
    } else if (type === 'project') {
      tableName = 'Users_Projects';
    } else if (type === 'research') {
      tableName = 'Users_Research';
    }

    const voteType = voteValue > 0 ? 'like' : 'dislike';

    this.authService.getCurrentUser().pipe(first()).subscribe(
      user => {
        try {
          if (user.uid === uid) {
            this.db.collection(tableName).doc(sid).collection('Comments').doc(cid).set({
              votes: {
                [uid]: voteType
              },
              voteCount: firestore.FieldValue.increment(voteValue),
              lastUpdated: firestore.FieldValue.serverTimestamp()
            }, {
              merge: true
            });
          }
        } catch (err) {
          alert('Please log in!');
        }
      });
  }
  async postComment(data: any, sid: string, statusTitle: string, statusDate: any,
    commentorsName: string, targetUserId: string, type: string): Promise < any > {
    let tableName;

    if (type === 'post') {
      tableName = 'Users_Posts';
    } else if (type === 'project') {
      tableName = 'Users_Projects';
    } else if (type === 'research') {
      tableName = 'Users_Research';
    }
    const promise = new Promise(
      (resolve, reject) => {
        this.authService.getCurrentUser().pipe(first()).subscribe(
          user => {
            if (user) {
              try {
                data.uid = user.uid;
                const userData = this.authService.getAdminData();
                data.name = commentorsName;
                const blockedUsers = userData.blockedUsers;

                if (!blockedUsers[user.uid] && user) {
                  this.db.collection(tableName).doc(sid).collection('Comments').add(data).then(
                    result => {

                      this.db.collection('Site_Logs').add({
                        viewStatus: 'unread',
                        commentorsName: data.name,
                        sid,
                        title: statusTitle,
                        statusDate,
                        targetUserId,
                        date: data.date,
                        type
                      });

                      resolve(result);
                    }
                  );
                  this.db.collection(tableName).doc(sid).update({
                    commentCount: firestore.FieldValue.increment(1),
                    lastUpdated: firestore.FieldValue.serverTimestamp()
                  });
                } else {
                  alert('You are blocked by the user.');
                  resolve(false);
                }
              } catch (error) {
                this.db.collection(tableName).doc(sid).collection('Comments').add(data);
                this.db.collection(tableName).doc(sid).update({
                  commentCount: firestore.FieldValue.increment(1),
                  lastUpdated: firestore.FieldValue.serverTimestamp()
                });
              }
            } else {
              alert('Please log in!');
              resolve(false);
            }
          });
      });
    return promise;
  }

  deleteComment(uid: string, sid: string, cid: string, type: string): Promise < any > {
    let tableName;

    if (type === 'post') {
      tableName = 'Users_Posts';
    } else if (type === 'project') {
      tableName = 'Users_Projects';
    } else if (type === 'research') {
      tableName = 'Users_Research';
    }
    const promise = new Promise(
      (resolve, reject) => {
        this.authService.getCurrentUser().pipe(first()).subscribe(
          user => {
            try {
              if (user.uid === uid) {
                this.db.collection(tableName).doc(sid).collection('Comments').doc(cid).delete();
                this.db.collection(tableName).doc(sid).update({
                  commentCount: firestore.FieldValue.increment(-1),
                  lastUpdated: firestore.FieldValue.serverTimestamp()
                });
                resolve(true);
              }
            } catch (err) {
              resolve(false);
              alert('Please log in!');
            }
          });
      });

    return promise;
  }



  updateComment(sid: string, uid: string, cid: string, type: string, commentData: {
    comment: string,
    date: firestore.FieldValue,
  }): Promise < any > {
    let tableName;
    if (type === 'post') {
      tableName = 'Users_Posts';
    } else if (type === 'project') {
      tableName = 'Users_Projects';
    } else if (type === 'research') {
      tableName = 'Users_Research';
    }

    const promise = new Promise(
      (resolve, reject) => {
        this.authService.getCurrentUser().pipe(first()).subscribe(
          user => {
            try {
              if (user.uid === uid) {
                this.db.collection(tableName).doc(sid).collection('Comments').doc(cid).update({
                  comment: commentData.comment,
                  date: commentData.date,
                  editStatus: 'editted'
                });
                resolve(true);
              }
            } catch (err) {
              alert('Please log in!');
              resolve(false);
            }
          }
        );
      });
    return promise;
  }
}
