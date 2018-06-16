import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialogRef } from '@angular/material'

@Component({
  selector: 'app-create-restaurant',
  templateUrl: './create-restaurant.component.html',
  styleUrls: ['./create-restaurant.component.css']
})
export class CreateRestaurantComponent implements OnInit {
  name:String;
  email: String;
  address: String;
  phone: String;

  constructor(private dialogRef: MatDialogRef<CreateRestaurantComponent>) { 
    
  }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }
  submit(){
    try{
      let restaurant = {
        name: this.name,
        email: this.email,
        address: this.address,
        phone: this.phone 
      }

      this.name = "";
      this.email = "";
      this.address = "";
      this.phone = "";
      this.dialogRef.close(restaurant);
    } catch (error) {
      console.error('submit failed');
    }
    
  }

}
