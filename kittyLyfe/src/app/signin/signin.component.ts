import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CreateRestaurantComponent } from '../create-restaurant/create-restaurant.component';
import { MatDialog, MatDialogConfig } from "@angular/material";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(public authService: AuthService, private dialog: MatDialog) { }

  ngOnInit() {
  }

  displayAcountCreation(){
    console.log("PRESSED DA SHIT");

    const dialogConfig = new MatDialogConfig();
    let diaLogRef = this.dialog.open(CreateRestaurantComponent);
    // diaLogRef.afterClosed().subscribe((result: Photo) => {
    //   this.photo = result;
    //   this.post = result.caption;
    // });
  }

}
