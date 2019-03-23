import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent{

  public team : FormGroup = new FormGroup( {
    title : new FormControl(''),
    description : new FormControl(''),
    color: new FormControl('')
  })

  constructor(private backend: BackendService, private router: Router) {}

  public submit() {
    let newTeam: any = {
      title: this.team.controls['title'].value,
      description: this.team.controls['description'].value,
      color: this.team.controls['color'].value,
    }

    
  }

  public cancel() {
    this.router.navigateByUrl('/home');
  }

}
