import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {

  public team : FormGroup = new FormGroup( {
    title : new FormControl(''),
    description : new FormControl(''),
    color: new FormControl('')
  })

  constructor() { }

  ngOnInit() {
  }

}
