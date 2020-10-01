import {
  firestore
} from 'firebase/app';
export interface Research{
  name: string;
  content: string;
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
  date: firebase.firestore.Timestamp;
  status: string;
  type: string;
  uid: string;
  id: string;
  statusTags: {
    id: string
  };
  projectTags: {
    id: string
  };
  researchTags: {
    id: string
  };
  thumbnail: string;
  description: string;
  technology: string;
}
