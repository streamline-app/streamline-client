import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { BackendService, UserDataResponse } from '../backend.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private username: string;
  private userData: UserDataResponse;

  constructor(private auth: AuthService, private backend: BackendService) {
    this.userData = {
      totalTasksCompleted: 0,
      taskEstFactor: 0,
      totalUnderTasks: 0,
      totalOverTasks: 0,
      avgTaskTime: 0
    }
    //get user date from backend
    this.getUserData(this.auth.getUserId());
  }

  ngOnInit() {
  }

  getUserData(userID: number) {
    this.backend.getUUID(userID).subscribe(UUID => {
      console.log(UUID);
      this.backend.getProfileInfo(UUID).subscribe(res => {
        console.log(res);
         if(res != null){
           this.userData = res;
         }
      });
    });
  }
}

