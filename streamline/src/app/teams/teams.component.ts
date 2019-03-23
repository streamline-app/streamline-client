import { Component, OnInit } from '@angular/core';
import { Team } from '../app.module';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {


  public teams: Team[] = [];
  public displayedColumns = ['name', 'description', 'color', 'created_at', 'actions'];

  constructor(private backend: BackendService, private auth: AuthService) { 
    this.getUserTeams();
  }

  public getUserTeams() {
    let userId = this.auth.getUserId();
    this.backend.getTeams(userId).subscribe((res) => {
      this.teams = res as Team[];
      console.log(this.teams);
    })
  }

  public onManage(id) {
    window.alert(id);
  }

  public onDelete(id) {
    window.alert(id);
  }

}
