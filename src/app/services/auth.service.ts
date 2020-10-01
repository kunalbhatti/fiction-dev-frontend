import {
  EventEmitter
} from '@angular/core';
import {
  Injectable
} from '@angular/core';

import {
  AngularFireAuth
} from '@angular/fire/auth';

import {
  AngularFirestore
} from '@angular/fire/firestore';

import * as firebase from 'firebase/app';

import {
  first
} from 'rxjs/operators';

import {
  Subscription
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  AUID = 'CKqE3gxoEfbYllZ558m4dlhgkjI2';
  adminData: any;
  adminSub: Subscription;

  loggedInEvent = new EventEmitter < boolean > ();

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {

    this.adminSub = this.db.collection('Users_Meta',
      ref => ref.where('uid', '==', this.AUID)).snapshotChanges().subscribe(
      adminMeta => {
        try {
          this.adminData = adminMeta[0].payload.doc.data();
        } catch (error) {}
      });

    this.afAuth.authState.pipe(first()).subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  doGoogleLogin(): Promise < any > {
    return new Promise < any > ((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.signInWithPopup(provider)
        .then(res => {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.loggedInEvent.emit(true);
          resolve(res);
        });
    });
  }

  logout(): any {
    this.afAuth.signOut();
    this.loggedInEvent.emit(false);
    localStorage.removeItem('user');
    this.adminSub.unsubscribe();
  }

  isAuthenticated(): Promise < any > {
    const promise = new Promise(
      (resolve, reject) => {
        const user = JSON.parse(localStorage.getItem('user'));
        resolve(user != null);
      });
    return promise;
  }

  getCurrentUser(): any {
    return this.afAuth.authState;
  }

  getAdminData(): any {
    return this.adminData;
  }

}
