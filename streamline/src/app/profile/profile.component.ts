import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private username: string;

  constructor(auth: AuthService, backend: BackendService) { 
    this.username = auth.getUserName();
  }

  ngOnInit() {
  }

}
