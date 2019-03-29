import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {


  public userView: boolean = true;
  public teamView: boolean = false;
  public teamId: number = 0;
  public teamName: string = '';

  dataViewChange: Subject<number> = new Subject<number>();
  teamDataChange: Subject<number> = new Subject<number>();

  constructor() { 
  }

  public setTeamView(id, name) {
    this.teamId = id;
    this.teamView = true;
    this.userView = false;
    this.teamName = name;
    this.dataViewChange.next(this.teamId);
  }

  public setUserView() {
    this.teamId = 0;
    this.teamView = false;
    this.userView = true;
    this.dataViewChange.next(0);
  }

  public signalTeamDataChange() {
    this.teamDataChange.next(Math.random() * 1000);
  }
}
