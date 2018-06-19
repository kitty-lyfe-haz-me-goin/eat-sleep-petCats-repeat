import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { MatDialog, MatDialogConfig } from "@angular/material";
import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {

  public isSignedInStream: Observable<boolean>;
  public displayNameStream: Observable<string>;
  // public photoUrlStream: Observable<string>;
  public _currentUsersUid: string;
  public _currentUsersDisplayName: String;

  constructor(private afAuth: AngularFireAuth, private router: Router, private dialog: MatDialog, ) {
    this.afAuth.authState.subscribe((user: firebase.User) => {
      if (user) {
        console.log("user is singed in as ", user);
        this._currentUsersUid = user.uid;
        if(user.isAnonymous) {
          this._currentUsersDisplayName = "Anonymous User";
        } else {
          this._currentUsersDisplayName = user.displayName || user.email || user.uid;
        }
      } else {
        console.log("user is not signed in.");
        this._currentUsersUid = '';
        this._currentUsersDisplayName = '';
      }
    });

    this.isSignedInStream = this.afAuth.authState
      .map<firebase.User, boolean>((user: firebase.User) => {
        console.log(user);
        return user != null;
      });

    this.displayNameStream = this.afAuth.authState
      .map<firebase.User, string>((user: firebase.User) => {
        if(user) {
          if(user.isAnonymous) {
            return "Anonymous";
          } else {
            return user ? user.displayName || user.email || user.uid : '';
          }
        }
      });
  }

  get currentUsersUid(): string {
    return this._currentUsersUid;
  }

  get currentUsersDisplayName(): String {
    return this._currentUsersDisplayName;
  }



  createWithEmailAndPassword(email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      let obj = {
        status: false,
        message: ''
      };
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((res) => {
          // console.log(res);
          this.signInWithEmailAndPassword(email, password).then(resp => {
            resolve(resp);
          }).catch(err => {
            reject(err);
          })
        })
        .catch((err: firebase.FirebaseError) => {
          switch (err.code) {
            case "auth/email-already-in-use":
              obj.message = "Email address is already in use. Try logging in.";
              break;
            case "auth/invalid-email":
              obj.message = "Invalid email address.";
              break;
            case "auth/operation-not-allowed":
              obj.message = `Please contact us. The error is ${err.message}`;
              break;
            case "auth/weak-password":
              obj.message = "Choose a strong password";
              break;
            default:
              obj.message = `Some error occured. Please contact us. The error is ${err.message}`;
              break;
          }
          reject({ res: obj });
        });
    });
  }

  signInWithEmailAndPassword(email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      let obj = {
        status: false,
        message: ''
      };
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(res => {
          obj.status = true;
          obj.message = res;
          console.log(`Signed in with email ${res}`);
          resolve({ res: obj });
        }).catch((err: firebase.FirebaseError) => {
          switch (err.code) {
            case "auth/invalid-email":
              obj.message = "Invalid email address";
              break;
            case "auth/user-disabled":
              obj.message = "This user has been disabled. Please contact us.";
              break;
            case "auth/user-not-found":
              obj.message = "The email was not found. Create an account";
              break;
            case "auth/wrong-password":
              obj.message = "Sorry, wrong password";
              break;
            default:
              obj.message = `Some error occured. Please contact us. The error is ${err.message}`;
              break;
          }
          reject({ res: obj });
        });

    });
  }

  signInWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result: any) => {
        this.router.navigate(['/']);
        const user: firebase.User = result.user;
      });
  }

  signInAnonymously() {
    this.afAuth.auth.signInAnonymously()
    .then(user => {
      if(user) {
        let isAnon = user.isAnonymous;
        let uid = user.uid;
        this.router.navigate(['/']);
      } else {

      }
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
  }

  signOut() {
    this.afAuth.auth.signOut();
    console.log(`USER IS SIGNED OUT!!!!`);
    this.router.navigate(['/signin']);
  }

}

