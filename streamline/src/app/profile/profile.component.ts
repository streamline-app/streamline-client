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
  private numCompTasks: number;
  private numCurrTasks: number;
  private estAcc: number;

  constructor(private auth: AuthService, private backend: BackendService) { 
    //get user date from backend
    this.getUserDate(this.auth.getUserId());
  }

  ngOnInit() {
  }

  getUserDate(userID: number){
    this.backend.getProfileInfo(userID).subscribe(res => {
      if(res != null){
        //TODO change dummy values with actual values
        this.setUsername(res.user);
        this.setNumCompTasks(res.compNum);
        this.setNumCurrTasks(res.currNum);
        this.setEstAcc(res.estAcc);
      }
    });
  }

  setUsername(uname: string){
    this.username = uname;
  }

  setNumCompTasks(num: number){
    this.numCompTasks = num;
  }

  setNumCurrTasks(num: number){
    this.numCurrTasks = num;
  }

  setEstAcc(num: number){
    this.estAcc = num;
  }

}
