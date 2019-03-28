import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ConfirmLeaveDialog, RemoveTeamMemberDialog } from '../dialogs/dialogs.module';
import { MatDialog } from '@angular/material';
import { StateService } from '../state.service';


@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.css']
})
export class ManageTeamComponent{
  public t : any = null;
  public owner: boolean = false;
  public sentInvitations : any[] = null;
  public teamMembers : any[] = null;
  public displayedPendingColumns = ['email', 'message', 'created_at'];
  public displayedMembersColumns = ['name', 'email'];

  public team : FormGroup = new FormGroup( {
    title : new FormControl(),
    description : new FormControl(''),
    color: new FormControl('')
  });

  public invite : FormGroup = new FormGroup ( {
    email: new FormControl(''),
    message: new FormControl('')
  });

  constructor(private route: ActivatedRoute, private state: StateService, private router: Router, private backend: BackendService,  private dialog: MatDialog, private auth: AuthService) {
    let teamId = this.route.snapshot.paramMap.get('id');
    this.loadTeamData();
    this.loadInvitationData();
    this.loadTeamMemberData(teamId);
    

    
  }
  
  loadTeamMemberData(teamId) {
    this.backend.getTeamMembers(teamId).subscribe((res) =>  {
      this.teamMembers = res as any[];
    });
  }
  loadTeamData() {
    let teamId = this.route.snapshot.paramMap.get('id');
    this.backend.getTeam(teamId).subscribe((res) => {
      this.t = res;
      this.team.patchValue({
        title: this.t.name,
        description: this.t.description,
        color: this.t.color
      });

      if (this.t.owner == this.auth.getUserId()) {
        this.owner = true;
        this.displayedMembersColumns = ['name', 'email', 'actions'];
      }
    });
  }

  loadInvitationData() {
    this.backend.sentInvitations(this.auth.getUserId()).subscribe((res) => {
      this.sentInvitations = res as any[];
      console.log(this.sentInvitations);
    });
  }

  public inviteUser() {
    let email = this.invite.controls['email'].value as string;
    this.backend.getUserId(email).subscribe((res) => {
      var recipientId = res as number;
      this.sendInvite(recipientId);

    });
  }

  public sendInvite(recipientId) {
    let message = this.invite.controls['message'].value as string;
    let request : any = {
      senderId : this.auth.getUserId(),
      recipientId : recipientId,
      inviteMessage : message,
      team: this.route.snapshot.paramMap.get('id')
    };

    this.backend.sendInvitation(request).subscribe((res) => {
      if (res.message == 'multiple invitations') {
        window.alert('Inviation already exists');

      } else if (res.message == 'member exists'){
        window.alert('Member already on team');

      } else {
        this.loadInvitationData();
      }
    });
  }

  public onLeave() {
    const dialogRef = this.dialog.open(ConfirmLeaveDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let team = this.t.id;
        let user = this.auth.getUserId();
        let request : any = {
          team: team,
          user: user
        };
        this.backend.leaveTeam(request).subscribe((res) => {
          this.router.navigateByUrl('teams');
        })
      }
    });
  }

  submit() {
    let title = this.team.controls['title'].value;
    let description = this.team.controls['description'].value;
    let color = this.team.controls['color'].value;

    let request : any = {
      title: title,
      description: description,
      color: color
    }

    this.backend.updateTeam(this.t.id, request).subscribe((res) => {
      this.loadTeamData();
      this.state.signalTeamDataChange();
    })
  }

  onRemove(id) {
    window.alert(id);
    const dialogRef = this.dialog.open(RemoveTeamMemberDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let team = this.t.id;
        let user = id
        let request : any = {
          team: team,
          user: user
        };
        this.backend.leaveTeam(request).subscribe((res) => {
          this.loadTeamMemberData(this.t.id);
        })
      }
    });
  }

}
