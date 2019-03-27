import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {


  public userView: boolean = true;
  public teamView: boolean = false;
  public teamId: number = 0;

  dataViewChange: Subject<number> = new Subject<number>();

  constructor() { 
  }

  public setTeamView(id) {
    this.teamId = id;
    this.teamView = true;
    this.userView = false;
    this.dataViewChange.next(this.teamId);
  }

  public setUserView() {
    this.teamId = 0;
    this.teamView = false;
    this.userView = true;
    this.dataViewChange.next(0);
  }
}
