import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CreateRestaurantComponent } from '../create-restaurant/create-restaurant.component';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(public authService: AuthService, private dialog: MatDialog, public postService: PostService) { }

  ngOnInit() {
  }

  displayAcountCreation(){
    const dialogConfig = new MatDialogConfig();
    let diaLogRef = this.dialog.open(CreateRestaurantComponent);
    diaLogRef.afterClosed().subscribe((result: Object) => {  
        this.postService.addRestaurant(result);
    });
  }


}
