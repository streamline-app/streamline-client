import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService, FileHandle } from '../backend.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ConfirmLeaveDialog, ConfirmRevokeDialog, RemoveTeamMemberDialog, UploadDocDialog, ConfirmPromotionDialog, ConfirmDemotionDialog } from '../dialogs/dialogs.module';
import { MatDialog, MatSnackBar } from '@angular/material';
import { StateService } from '../state.service';


@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.css']
})

export class ManageTeamComponent{
  public t : any = null;
  public teamId : any = 0;
  public ownerId : number = -1;
  public isAdmin: boolean = false
  public owner: boolean = false;
  public sentInvitations : any[] = null;
  public teamMembers : any[] = null;
  public favoriteTeamMemberIds: number[] = null;
  public favoriteTeamMemberEmails: string[] = null;
  public displayedPendingColumns = ['email', 'message', 'created_at', 'actions'];
  public displayedMembersColumns = ['name', 'email', 'role', 'actions'];
  public fileHandles: FileHandle[] = [];

  public team: FormGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(''),
    color: new FormControl('')
  });

  public invite: FormGroup = new FormGroup({
    email: new FormControl(''),
    message: new FormControl('')
  });

  constructor(private route: ActivatedRoute, private state: StateService, private router: Router, private backend: BackendService, private snackbar: MatSnackBar, private dialog: MatDialog, private auth: AuthService) {
    this.teamId = this.route.snapshot.paramMap.get('id');
    this.loadTeamData();
    this.loadInvitationData();
    this.loadTeamMemberData(this.teamId);
    this.loadAdminStatus();

    this.getTeamFiles();
  }

  loadAdminStatus() {
    let request : any = {
      id: this.auth.getUserId(),
      teamId: this.teamId
    }
    this.backend.checkTeamAdmin(request).subscribe((res) => {
      let temp = res as string[];
      if (temp.length > 0) {
        let val = temp[0];
        if (val == "true") {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
    })
  }

  onTransferOwnership() {
    this.router.navigateByUrl('transfer/' + this.teamId);
  }

  onPromote(id: number) {

    const dialogRef = this.dialog.open(ConfirmPromotionDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      let request : any = {
        id: id,
        teamId: this.teamId,
        promotion: "admin"
      }
  
      this.backend.promoteTeamMember(request).subscribe((res) => {
        if (res.message == 'success') {
          this.snackbar.open('User promoted.', 'Ok', { duration: 3000 });
          this.favoriteTeamMemberIds = [];
          this.loadTeamMemberData(this.teamId);
        }
      })
    });
        
  }

  onDemote(id: number) {
    const dialogRef = this.dialog.open(ConfirmDemotionDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      let request : any = {
        id: id,
        teamId: this.teamId,
        promotion: "admin"
      }
  
      this.backend.demoteTeamMember(request).subscribe((res) => {
        if (res.message == 'success') {
          this.snackbar.open('User demoted.', 'Ok', { duration: 3000 });
          this.favoriteTeamMemberIds = [];
          this.loadTeamMemberData(this.teamId);
          this.loadAdminStatus();
        }
      })
    });
  }

  loadFavoritesData() {
    this.backend.getFavoriteTeamMembers(this.auth.getUserId()).subscribe((res) => {
      this.favoriteTeamMemberIds = res as number[];
      console.log(this.favoriteTeamMemberIds);
    });

    this.backend.getFavoriteTeamMemberEmails(this.auth.getUserId()).subscribe((res) => {
      this.favoriteTeamMemberEmails = res as string[];
      console.log(this.favoriteTeamMemberEmails);
    });
  }

  loadTeamMemberData(teamId) {
    this.backend.getTeamMembers(teamId).subscribe((res) => {
      this.teamMembers = res as any[];
      console.log(this.teamMembers);
      this.loadFavoritesData();
    });
  }
  loadTeamData() {
    let teamId = this.route.snapshot.paramMap.get('id');
    this.backend.getTeam(teamId).subscribe((res) => {
      this.t = res;
      this.ownerId = this.t.owner;
      this.team.patchValue({
        title: this.t.name,
        description: this.t.description,
        color: this.t.color
      });

      if (this.t.owner == this.auth.getUserId()) {
        this.owner = true;
        this.displayedMembersColumns = ['name', 'email', 'role', 'actions'];
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
      if (res == 'not found') {
        this.snackbar.open('No user of that email foud!', 'Ok', { duration: 3000 });
        return;
      }
      var recipientId = res as number;
      this.sendInvite(recipientId);

    });
  }

  public sendInvite(recipientId) {
    let message = this.invite.controls['message'].value as string;
    let request: any = {
      senderId: this.auth.getUserId(),
      recipientId: recipientId,
      inviteMessage: message,
      team: this.route.snapshot.paramMap.get('id')
    };

    this.backend.sendInvitation(request).subscribe((res) => {
      if (res.message == 'multiple invitations') {
        window.alert('Inviation already exists');

      } else if (res.message == 'member exists') {
        window.alert('Member already on team');

      } else {
        this.snackbar.open('Invitation sent.', 'Ok', { duration: 3000 });
        this.loadInvitationData();
      }
    });
  }

  public onRevokeInvite(id) {
    
    const dialogRef = this.dialog.open(ConfirmRevokeDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      let request : any = {
        id: id
      }
      if (res) {
        this.backend.revokeInvitation(request).subscribe((res) => {
          this.snackbar.open('Invitation revoked successfully.', 'Ok', { duration: 3000 });
          this.loadInvitationData();
        })
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
        let request: any = {
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

    let request: any = {
      title: title,
      description: description,
      color: color
    }

    this.backend.updateTeam(this.t.id, request).subscribe((res) => {
      this.loadTeamData();
      this.state.signalTeamDataChange();
      this.snackbar.open('Team updated!', 'Ok', { duration: 3000 });
    })
  }

  favoriteTeamMember(id) {
    let userid = this.auth.getUserId();
    let favoriteId = id;
    let request : any = {
      user: userid,
      favorite: favoriteId
    }

    this.backend.favoriteTeamMember(request).subscribe((res) => {
      this.snackbar.open(res.message, 'Ok', { duration: 3000 });
    //  this.teamMembers = [];
      this.favoriteTeamMemberIds = [];
      this.loadTeamMemberData(this.route.snapshot.paramMap.get('id'));
    })
  }

  unFavoriteTeamMember(id) {
    let userid = this.auth.getUserId();
    let favoriteId = id;
    let request : any = {
      user: userid,
      favorite: favoriteId
    }

    this.backend.unFavoriteTeamMember(request).subscribe((res) => {
      this.snackbar.open(res.message, 'Ok', { duration: 3000 });
    //  this.teamMembers = [];
      this.favoriteTeamMemberIds = [];
      this.loadTeamMemberData(this.route.snapshot.paramMap.get('id'));
    })
  }

  onRemove(id) {
    // window.alert(id);
    const dialogRef = this.dialog.open(RemoveTeamMemberDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let team = this.t.id;
        let user = id
        let request: any = {
          team: team,
          user: user
        };
        this.backend.leaveTeam(request).subscribe((res) => {
          this.loadTeamMemberData(this.t.id);
        })
      }
    });
  }

  openUploadDialog() {
    const dialogRef = this.dialog.open(UploadDocDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe(res =>{
      if(res){
        this.uploadFile(res);
      }
    })
  }

  uploadFile(files: FileList) {
    //console.log(files.item(0).name);



    this.backend.uploadFile(files.item(0), this.teamId).subscribe(res => {

      //refresh team files list
      this.getTeamFiles();

    });
  }

  getTeamFiles() {
    this.backend.getTeamFiles(this.teamId).subscribe(res => {
      this.fileHandles = res;
    });
  }

  downloadFile(fileID: number, fileName: string) {
    this.backend.downloadFile(fileID).subscribe(res => {
      var newBlob = new Blob([res.body], { type: 'application/pdf' });

      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }

      // For other browsers: 
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = data;
      link.download = fileName;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    });

  }
}
