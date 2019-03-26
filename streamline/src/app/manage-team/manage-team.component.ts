import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.css']
})
export class ManageTeamComponent{
  public t : any = null;
  public sentInvitations : any[] = null;
  public displayedPendingColumns = ['email', 'message', 'created_at'];

  public team : FormGroup = new FormGroup( {
    title : new FormControl(),
    description : new FormControl(''),
    color: new FormControl('')
  });

  public invite : FormGroup = new FormGroup ( {
    email: new FormControl(''),
    message: new FormControl('')
  });

  constructor(private route: ActivatedRoute, private backend: BackendService, private auth: AuthService) {
    let teamId = this.route.snapshot.paramMap.get('id');
    this.backend.getTeam(teamId).subscribe((res) => {
      this.t = res;
      this.team.patchValue({
        title: this.t.name,
        description: this.t.description,
        color: this.t.color
      });
    });

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

      } else {
        window.alert('Invitation sent');

      }
    });


  }



}
