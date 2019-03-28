import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { StateService } from '../state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent {

  public invitations: any[] = [];
  public displayedColumns = ['team', 'message', 'senderEmail', 'actions'];

  constructor(private backend: BackendService, private auth: AuthService, private state: StateService, private router: Router) { 
    this.loadInvitations();
  }

  public loadInvitations() {
    this.backend.recievedInvitations(this.auth.getUserId()).subscribe((res) => {
      this.invitations = res as any[];
      console.log(this.invitations);
    });
  }

  public onAccept(id) {
    let inv = this.invitations.find(x => x.id == id);
    let request : any = {
      userId: this.auth.getUserId(),
      teamId: inv.team,
      invitationId: id
    }

    console.log(request);
    this.backend.acceptInvitation(request).subscribe((res) => {
      this.loadInvitations();
      this.state.signalTeamDataChange();
    });

  }

  public onDecline(id) {
    let inv = this.invitations.find(x => x.id == id);
    let request : any = {
      userId: this.auth.getUserId(),
      teamId: inv.team,
      invitationId: id
    }

    this.backend.declineInvitation(request).subscribe((res) => {
      this.loadInvitations();
    });
  }

  public onBack() {
  this.router.navigateByUrl('teams');
  }

}
