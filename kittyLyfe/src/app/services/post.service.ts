import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
// import { AuthService } from './auth.service';
import { Post, Comment, Photo } from '../models/post.model';
import * as Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Query } from 'angularfire2/interfaces';
import 'rxjs/add/Observable/combineLatest';
import 'rxjs/add/operator/switchMap';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/scan';

@Injectable()
export class PostService {

  readonly postsPath = 'posts';

  public hideLoadMoreBtn = false;
  readonly postBatchSize = 20;

  public author: String;
  allStream: Observable<Post[]>
  public isMypostsPageStream: Subject<String>;
  private postIncrementStream: Subject<number>;
  

  constructor(public db: AngularFireDatabase) {
    this.postIncrementStream = new BehaviorSubject<number>(this.postBatchSize);
    this.isMypostsPageStream = new BehaviorSubject<String>('');

    const numPostsStream = this.postIncrementStream.
      scan<number>((previousTotal: number, currentValue: number) => {
        return previousTotal + currentValue;
      });

    const queryStream: Observable<Query> = Observable.combineLatest<Query>(
      numPostsStream,
      this.isMypostsPageStream,
      (numPosts: number, myPosts: boolean) => {
        if (myPosts) {
          return {
            orderByChild: 'author',
            equalTo: this.author,
          };
        } else {
          return {
            limitToLast: numPosts,
          }
        }
      });

    const postsStream: Observable<Post[]> = queryStream.
      switchMap<Query, Post[]>((queryParam: Query) => {
        return this.db.list(this.postsPath, {
          query: queryParam,
        });
      });


    this.allStream = Observable.combineLatest<Post[]>(
      postsStream,
      numPostsStream,
      (posts: Post[], numPostsRequested: number) => {
        this.hideLoadMoreBtn = numPostsRequested > posts.length;
        return posts;
      });
  }

  displayMorePosts() {
    this.postIncrementStream.next(this.postBatchSize);
  }

  addComment(comment: String, post: Post) {
    let comm = new Comment({
      comment: comment,
    //   author: this.authService.currentUsersDisplayName,
    //   userId: this.authService._currentUsersUid,
      time: (new Date()).getTime().toString(),
    });

    firebase.database().ref(`${this.postsPath}/${post.$key}/comments`).push(comm);
  }

  deleteComment(commentId: String, post: Post): Promise<any> {
    return new Promise((resolve, reject) => {
      let stuff = firebase.database().ref(`${this.postsPath}/${post.$key}/comments/${commentId}`).remove();
      stuff.then((st) => {
        resolve({ res: true });
      }).catch((err) => {
        reject({ res: false });
      });
    });
  }

  addPost(post: Post) {
   
    firebase.database().ref().child(this.postsPath).push(post);
    console.log('added to firebase.');
  }

  remove(key: string) {
    firebase.database().ref().child(this.postsPath).child(key).remove();
  }

//   update(key: string, post: Post) {
//     // firebase.database().ref().child(this.postsPath).child(key).set(post);
//     this.db.object(`/${this.postsPath}/${key}`).update(post);
//   }

  removePicture(postKey: string) {
    firebase.database().ref().child(this.postsPath).child(postKey).child('photo').remove();
  }

}