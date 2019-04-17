import { Component, OnInit } from '@angular/core';
import { BackendService, UserDataResponse } from '../backend.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';
import { CreateTagDialog, EditTagDialog, DeleteConfirmDialog } from '../dialogs/dialogs.module';
import { StateService } from '../state.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  opened: boolean;
  displayed_tags: Tag[] = [];
  currDisp: number; //1 is regular tags, 2 is prio
  tags: Tag[] = [];
  prio_tags: Tag[] = [];
  tagData: UserDataResponse;
  selectedTag: Tag;

  constructor(private backend: BackendService,
    public create_dialog: MatDialog,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private state: StateService
  ) {
    //make sure sidenav is closed
    this.opened = false;
    this.state.dataViewChange.subscribe((val) => {
      this.loadData();
    })
    //fill display
    this.loadData();
  }

  ngOnInit() {
  }

  loadData() {
    if (this.state.teamId != 0) {
      this.getTeamTags();
    } else {
      this.getUserTags();
    }
  }

  createTag() {
    //console.log('Hello Moto Tags');
    const dialogRef = this.create_dialog.open(CreateTagDialog, {
      width: '250px',
      data: { name: '', desc: '', color: "#c4c4c4" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //check if tag already exists under given name
        let exists: boolean = false;
        this.tags.forEach(element => {
          if (element.name === result.name) {
            //notify user
            let snackbarRef = this.snackbar.open('You already have a tag with that name!', 'Ok', { duration: 3000 });

            //mark flag
            exists = true;
          }
        });

        if (exists) //if it already exists, don't make a new one
          return;
        //else construct Tag object with input values
        let newTag: Tag = {
          id: 1,    //this value is arbitrary and will not be saved in the DB
          name: result.name,
          description: result.desc,
          tasks_comp: 0,
          average_time: 0,
          average_acc: 0,
          task_overunder: 0,
          color: result.color,
          userID: this.auth.getUserId(),
          team: this.state.teamId
        }

        console.log(newTag);
        //send data to backend
        this.backend.createTag(newTag).subscribe(result => {

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Tag Created!', 'Ok', { duration: 3000 });

        }, error => {
          console.log(error.message);
          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
        });

        //update display with new tag
        this.loadData();
      }
      else { /* Do Nothing */ }
    });


  }

  onSelect(tag: Tag): void {
    if (this.opened) { //if already open, close it.
      this.opened = false;
    }


    //load data for that tag ------
    this.selectedTag = tag;
    //open tab again
    this.opened = true;
  }

  getUserTags() {
    this.backend.getUserTags(this.auth.getUserId()).subscribe(result => { //TODO change userID
      console.log(result);
      //window.alert('Got Tags');

      //set display to show result
      this.sortTagsIntoLists(result);

      //get analytics data for regular tags
      this.tags.forEach(t => {
        this.backend.getUUID(this.auth.getUserId()).subscribe(UUID => {
          this.backend.getTagData(UUID, t.name).subscribe(res => {
            //     console.log(res);
            t.tagData = res;
          })
        })
      });

      //get analytics data for prio tags
      this.prio_tags.forEach(t => {
        this.backend.getUUID(this.auth.getUserId()).subscribe(UUID => {
          this.backend.getTagData(UUID, t.name).subscribe(res => {
            //    console.log(res);
            t.tagData = res;
          })
        })
      });


    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });


  }

  getTeamTags() {
    this.backend.getTeamTags(this.state.teamId).subscribe(result => {
      console.log(result);
      this.sortTagsIntoLists(result);

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  public sortTagsIntoLists(rawList: Tag[]) {
    //clear lists
    this.tags = [];
    this.prio_tags = [];

    //sort out tags into their respective lists
    rawList.forEach(tag => {
      if (tag.name.includes('priority')) {
        //add to prio list
        this.prio_tags.push(tag);
      } else {
        //add to regular tag list
        this.tags.push(tag);
      }
    });

    if (this.currDisp === 1)
      this.displayed_tags = this.tags;
    else if (this.currDisp === 2)
      this.displayed_tags = this.prio_tags;
    else
      this.displayed_tags = this.tags;

  }

  public showTags(val: number) {
    switch (val) {
      case 1:
        this.displayed_tags = this.tags;
        this.currDisp = 1;
        break;
      case 2:
        this.displayed_tags = this.prio_tags;
        this.currDisp = 2;
        break;
      default:
        this.displayed_tags = this.tags;
        this.currDisp = 1;
    }
  }

  deleteTag(id: number) {
    const dialogRef = this.create_dialog.open(DeleteConfirmDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { //if confirmed, delete
        this.backend.deleteTag(id).subscribe(result => {
          console.log(result);

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Tag Deleted!', 'Ok', { duration: 3000 });

          //update display
          this.loadData();

          //close sidebar showing deleted tags details
          this.opened = false;
        }, error => {
          console.log(error.message);
          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
        });
      }
      else { /*do nothing */ }
    });
  }

  editTag(tag: Tag) {
    const dialogRef = this.create_dialog.open(EditTagDialog, {
      width: '325px',
      data: { name: this.selectedTag.name, desc: this.selectedTag.description, color: this.selectedTag.color, isPrio: this.selectedTag.name.includes('priority') } /* Make sure to set fields to details of selected tag*/
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        //check if tag already exists under given name
        let exists: boolean = false;
        if (result.name != tag.name) { //if new tag name given is different from the old one
          this.tags.forEach(element => { //check to make sure it doesn't match any other tag names
            if (element.name === result.name) {
              //notify user
              let snackbarRef = this.snackbar.open('You already have a tag with that name!', 'Ok', { duration: 3000 });

              //mark flag
              exists = true;
            }
          });
        }

        if (exists) //if it already exists, don't make a new one
          return;
        //close sidebar showing old tags details
        this.opened = false;

        //result is formatted to send directly to backend
        this.backend.editTag(tag.id, result).subscribe(res => {
          console.log('tag ' + tag.id + ' udpated');

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Tag Updated!', 'Ok', { duration: 3000 });

          //update display
          this.loadData();
        }, error => {
          console.log(error.message);
          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });

        })

      }
      else { /* Do Nothing */ }
    });
  }
}

interface Tag {
  id: number,
  name: string,
  description: string
  tasks_comp: number,
  average_time: number,
  average_acc: number,
  task_overunder: number,
  color: string,
  userID: number,
  team: number
  tagData?: UserDataResponse
};