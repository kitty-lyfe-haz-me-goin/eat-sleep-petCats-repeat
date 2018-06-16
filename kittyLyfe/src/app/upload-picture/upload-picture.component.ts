import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { finalize } from 'rxjs/operators';

import { Photo } from '../models/post.model';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import * as firebase from 'firebase';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-upload-picture',
  templateUrl: './upload-picture.component.html',
  styleUrls: ['./upload-picture.component.scss']
})
export class UploadPictureComponent implements OnInit {

  url: string;
  caption: string;
  desc: String;
  address:String;
  phone:String;

  photoListStream: AngularFireList<Photo[]>;

  constructor(public db: AngularFireDatabase, public authService: AuthService, public postService: PostService,
    public snackBar: MatSnackBar, private dialogRef: MatDialogRef<UploadPictureComponent>,
    private storage: AngularFireStorage) {
      this.photoListStream = this.db.list('/photos');
     }

  ngOnInit() {
  }

  onSubmit() {
    try {
      const photo = new Photo({
        url: this.url,
        caption: this.caption,
      });

      const post = {
        uid: this.authService._currentUsersUid,
        image: photo,
        address: this.address,
        phone: this.phone,
        desc: this.desc
      }

      // this.postService.addPhoto(photo);
      // const sbRef = this.snackBar.open('Photo added', '', {
      //   duration: 5000,
      // });

      // this.photoListStream.update(nextKey, photo);
      this.url = '';
      this.caption = '';
      this.desc = '';
      this.address = '';
      this.phone = '';
      console.log("this is the post");
      console.log(post);
      this.dialogRef.close(post);
    } catch (error) {
      console.error('submit failed');
    }
  }

  randomString() {
    let length = 32
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

  photoSelected(event: any) {
    const file: File = event.target.files[0];
    // const nextKey = this.photoListStream.push({}).key;
    let path = `/photos/${this.randomString()}`;
    const storageRef = this.storage.ref(path);
    const uploadTask = this.storage.upload(path, file);
    console.log(`Uploading: ${file.name}`);
    document.getElementById('spinner').style.display = 'flex';
    document.getElementById('upload').style.display = 'none';

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        console.log(`Upload is complete!`);
        console.log(uploadTask);
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('upload').style.display = 'block';
        document.getElementsByName('url')[0].focus();
        storageRef.getDownloadURL().toPromise().then(ref => {
          this.url = ref;
          console.log(this.url);
        });
      })
   )
  .subscribe()

    // uploadTask.then((uploadSnapshot) => {
    //   console.log(`Upload is complete!`);
    //   console.log(uploadTask);
    //   document.getElementById('spinner').style.display = 'none';
    //   document.getElementById('upload').style.display = 'block';
    //   document.getElementsByName('url')[0].focus();
    //   // firebase.database().ref(`/photos/list/${nextKey}`).set(nextKey);
    //   this.url = uploadSnapshot.downloadURL;
    //   console.log(this.url);
    // });
  }

}
