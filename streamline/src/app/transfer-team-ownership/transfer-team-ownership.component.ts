import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { ConfirmTransferDialog } from '../dialogs/dialogs.module';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';

@Component({
  selector: 'app-transfer-team-ownership',
  templateUrl: './transfer-team-ownership.component.html',
  styleUrls: ['./transfer-team-ownership.component.css']
})
export class TransferTeamOwnershipComponent {

  public teamId: string = null;
  public displayedMembersColumns = ['name', 'email', 'role', 'actions'];
  public teamMembers: TeamMember[] = null;
  public selectedUser: TeamMember = null;
  constructor(private route: ActivatedRoute, private backend: BackendService, private auth: AuthService, private dialog: MatDialog, private snackbar: MatSnackBar, private location: Location) {
    this.teamId = this.route.snapshot.paramMap.get('id');
    this.loadTeamMemberData(+this.teamId);
  }

  public loadTeamMemberData(teamId: number) {
    this.backend.getTeamMembers(teamId).subscribe((res) => {
      this.teamMembers = res as TeamMember[];
      console.log(this.teamMembers);
    })
  }

  public transfer() {
    const dialogRef = this.dialog.open(ConfirmTransferDialog, {
      width: '325px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      let previous = this.auth.getUserId();
      let newOwner = this.selectedUser.id;
      let team = this.teamId;

      let request : any = {
        previous: previous,
        newOwner: newOwner,
        team: team
      };

      this.backend.transferTeamOwnership(request).subscribe((res) => {
        this.snackbar.open('Team ownership transferred.', 'Ok', { duration: 3000 });
        this.location.back();

      });
    });
  }

  public onSelect(id: number) {
    

    for(var a of this.teamMembers) {
      let temp = a as TeamMember;
      if (temp.id == id) {
        this.selectedUser = temp;
        return;
      }
    }
  }
}

interface TeamMember {
  id: number,
  name: string,
  email: string,
  admin: string
}
