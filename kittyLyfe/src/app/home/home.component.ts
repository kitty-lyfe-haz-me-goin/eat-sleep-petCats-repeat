import { Component, OnInit } from '@angular/core';
// import { Post, Photo } from '../models/post.model';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post, Photo } from '../models/post.model';
import { UploadPictureComponent } from '../upload-picture/upload-picture.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  post: String;

  photo: Photo;

  address: String;

  phone: String;
  isExpanded = false;

  constructor(private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    public postService: PostService) {
  }

  ngOnInit(){
  }

  onSubmit() {
    let p = new Post({
      author: this.authService._currentUsersDisplayName,
      post: this.post,
      time: (new Date()).getTime().toString(),
      userId: this.authService._currentUsersUid,
      likes: [],
      comments: [],
      photo: this.photo,
    });
    this.postService.addPost(p);
    this.post = '';
  }

  showPhotoDialog() {
    const dialogConfig = new MatDialogConfig();

    let diaLogRef = this.dialog.open(UploadPictureComponent);
    diaLogRef.afterClosed().subscribe((result: Post) => {
      console.log("this is the results");
      console.log(result)
      this.photo = result.photo;
      this.post = result.photo.caption;
      this.address = result.address;
      this.phone = result.phone;
      
      let p = new Post({
        author: this.authService._currentUsersDisplayName,
        post: this.post,
        address: this.address,
        phone: this.phone,
        time: (new Date()).getTime().toString(),
        userId: this.authService._currentUsersUid,
        comments: [],
        photo: this.photo,
      });
      this.postService.addPost(p);
      this.post = '';
      this.address = '';
    });
  }

}
