import {
  firestore
} from 'firebase/app';

export interface Comment{
  comment: string;
  votes: any;
  voteCount: number;
  date: firebase.firestore.Timestamp;
  ediStatus: string;
  name: string;
  uid: string;
  id: string;
}
