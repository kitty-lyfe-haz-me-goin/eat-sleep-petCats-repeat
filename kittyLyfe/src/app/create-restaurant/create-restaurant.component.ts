import { Component, OnInit } from '@angular/core';

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

  constructor() { 
    
  }

  ngOnInit() {
  }

  close(){
    console.log("close");
  }
  submit(){
    console.log("submit");
  }

}
