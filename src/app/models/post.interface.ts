export interface Post {
  commentCount: number;
  date: firebase.firestore.Timestamp;
  editStatus: string;
  id: string;
  lastUpdated: firebase.firestore.Timestamp;
  status: string;
  title: string;
  name: string; // project name
  type: string;
  uid: string;
  voteCount: number;
  tagCount: number;
  votes: {
    [uid: string]: string
  };
  photo: string;
  link: string;
  code: string;
  language: string;
  researchTags: {string: string}[];
  projectTags: {string: string}[];
  statusTags: {string: string}[];
}
