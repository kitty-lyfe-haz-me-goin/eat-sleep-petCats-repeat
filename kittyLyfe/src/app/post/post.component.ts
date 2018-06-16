import { Component, OnInit, Input } from '@angular/core';
import { Post, Comment, Photo } from '../models/post.model';
import { MatSnackBar } from '@angular/material';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

enum EditMode {
  notEditable,
  displayEditButtons,
  editing,
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  public postEditingMode = EditMode.notEditable;

  // public commentEditingMode = EditMode.notEditable;

  updatedPostBody: String;

  alreadyLiked: boolean;

  numLikes: Number;
  nowComment: String;

  allComments = [];

  constructor(private router: Router, private authService: AuthService,
    private postService: PostService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (this.post.userId == this.authService.currentUsersUid) {
      this.postEditingMode = EditMode.displayEditButtons;
    }


    for (let i in this.post.comments) {
      let comment = {
        key: i,
        comment: this.post.comments[i],
        editable: this.post.comments[i].userId === this.authService._currentUsersUid,
      }
      this.allComments.push(comment);
    }

  }

  enableEditing(inputEl: HTMLInputElement) {
    this.postEditingMode = EditMode.editing;
    this.updatedPostBody = this.post.post;
    setTimeout(() => {
      inputEl.focus();
    }, 0);
  }

  editComment(obj) {
    this.deleteComment(obj.key).then((resp) => {
      if (resp.deleted)
        this.nowComment = obj.comment.comment;
    }).catch(err => {
      console.log(err);
    });
  }

  remove() {
    this.postService.remove(this.post.$key);
    const sbRef = this.snackBar.open('Post removed', 'UNDO', {
      duration: 5000,
    });

    sbRef.onAction().subscribe((post) => {
      const restoredPost = new Post();
      restoredPost.post = this.post.post;
      restoredPost.userId = this.authService.currentUsersUid;
      restoredPost.author = this.post.author
      restoredPost.comments = this.post.comments ? this.post.comments : [];
      restoredPost.time = this.post.time;
      this.postService.update(this.post.$key, restoredPost);

      this.snackBar.open('Post restored', '', {
        duration: 5000,
      });
    });
  }

  save() {
    const updatedPost = new Post();
    updatedPost.post = this.updatedPostBody;
    updatedPost.author = this.post.author;
    updatedPost.photo = this.post.photo;
    updatedPost.userId = this.post.userId;
    updatedPost.comments = this.post.comments ? this.post.comments : [];
    updatedPost.time = this.post.time;
    this.postService.update(this.post.$key, updatedPost);
    this.postEditingMode = EditMode.displayEditButtons;
  }

  cancel() {
    this.postEditingMode = EditMode.displayEditButtons;
  }

  // addLike() {
  //   console.log("blah");
  //   this.postService.addLike(this.post);
  // }

  comment() {
    // console.log(`now comment ${this.nowComment}`);
    this.postService.addComment(this.nowComment, this.post);
  }

  deleteComment(key: String): Promise<any> {
    return new Promise((resolve, reject) => {
      this.postService.deleteComment(key, this.post).then((res) => {
        if (res) {
          resolve({ deleted: true });
        } else {
          reject({ deleted: false });
        }
      }).catch((err) => {
        console.log(err);
      });
    });
    // console.log("delete comment here");
  }

  // unlike() {
  //   this.postService.unlike(this.post);
  // }

  reply() {

  }

  photoClicked(post: Post) {
    this.router.navigate(['/photo', post.$key]);
  }

}
