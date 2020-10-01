import {
  firestore
} from 'firebase/app';
export interface Project {

  backend: string;
  date: firebase.firestore.Timestamp;
  deployLink: string;
  description: string;
  endDate: firebase.firestore.Timestamp;
  frontend: string;
  gitLink: string;
  id: string;
  language: string;
  name: string;
  startDate: firebase.firestore.Timestamp;
  status: string;
  statusTags: {
    id: string
  };
  projectTags: {
    id: string
  };
  researchTags: {
    id: string
  };
  tagCount: number;
  commentCount: number;
  voteCount: number;
  votes: {string: string}[];
  thumbnail: string;
  type: string;
  uid: string;

}
