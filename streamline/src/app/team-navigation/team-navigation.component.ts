import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { Team } from '../app.module';
import { Router, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { StateService } from '../state.service';

@Component({
  selector: 'app-team-navigation',
  templateUrl: './team-navigation.component.html',
  styleUrls: ['./team-navigation.component.css']
})
export class TeamNavigationComponent {

  public teams : Team[] = null;
  constructor(private backend: BackendService, private auth: AuthService, private router: Router, private state: StateService) { 
    this.router.events.subscribe((val) => {
      let t = val as RouterEvent;
      
      console.log(t.url);
      if (((t.url == "/home" || t.url == "/teams") && t instanceof NavigationEnd) || (t instanceof NavigationStart && t.id == 1)) {
        this.backend.getTeams(this.auth.getUserId()).subscribe((res) => {
        this.teams = res as Team[];
       });
      }
      
    })

    this.state.teamDataChange.subscribe((val) => {
      this.backend.getTeams(this.auth.getUserId()).subscribe((res) => {
        this.teams = res as Team[];
      });
    });
  }

  onClick(id: number) {
    if (id != 0) {
      let team = this.teams.find(x => x.id == id);
      this.state.setTeamView(team.id, team.name);
    } else {
      this.state.setUserView();
    }
    

  }

}
