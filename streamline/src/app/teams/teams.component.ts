import { Component, OnInit } from '@angular/core';
import { Team } from '../app.module';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material';
import { DeleteConfirmDialog } from '../dialogs/dialogs.module';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {


  public teams: Team[] = [];
  public displayedColumns = ['name', 'description', 'color', 'created_at', 'actions'];
  

  constructor(private backend: BackendService, private auth: AuthService, private dialog: MatDialog) { 
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
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.backend.deleteTeam(id).subscribe((res) => {
            this.teams = [];
            this.getUserTeams();
        })
      }
    });
  }

}
