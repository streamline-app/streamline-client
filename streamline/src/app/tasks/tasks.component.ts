import { Component, OnInit } from '@angular/core';
import { BackendService, TaskEdit } from '../backend.service';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DeleteConfirmDialog, EditTaskDialog, AddTagDialog } from '../dialogs/dialogs.module';
import { Tag, Task } from '../app.module'
import { formatDate } from '@angular/common';
import { StateService } from '../state.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {

  private tasks: Task[] = null;
  private unfilteredTasks: Task[]; //used to save list of tasks
  private sort_by: number = 0;
  private rawTagsForm: FormControl = new FormControl();
  private filteredTags: Observable<Tag[]>; //used by html with ngFor
  private tags: Tag[];
  private assignedControl: {[id: number]: FormControl} = [];
  private teamId: number = 0;
  public displayMessage = 'Your Tasks';
  public teamMembers: any[] = [];

  constructor(private backend: BackendService,
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private router: Router,
    private create_dialog: MatDialog,
    private state: StateService
  ) {

    this.state.dataViewChange.subscribe((val) => {
      this.tasks = null;
      this.loadData();
      if (this.state.teamId != 0) {
        this.displayMessage = this.state.teamName + '\'s Tasks';
        this.loadTeamMemberData();
      } else {
        this.displayMessage = 'Your tasks';
      }
    })
    //update tasks display

    if (this.state.teamId != 0) {
      this.displayMessage = this.state.teamName + '\'s Tasks';
      this.loadTeamMemberData();
    } else {
      this.loadData();
    }


  }

  loadTeamMemberData() {
    this.teamId = this.state.teamId;
    this.backend.getTeamMembers(this.teamId).subscribe((res) => {
      this.teamMembers = res as any[];
      let temp : any = {
        id: 0, 
        name: "None", 
        email: "None", 
        admin: "False"
      }

      this.teamMembers.push(temp);
      console.log("LOOK HERE");
      console.log(this.teamMembers);
      this.loadData();
    })
  }

  loadData() {
    if (this.state.teamId != 0) {
      this.getTeamTasks();
      this.getTeamTags();
    } else {
      this.getUserTasks();
      this.getUserTags();
    }
  }

  checkSort() {
    switch (this.sort_by) {
      case 0:   //no sort
        break;
      case 1:   //prio
        //   this.sortbyPrio();
        break;
      case 2:   //creation_date
        this.sortbyCreationDate();
        break;
      case 3: 
        this.sortByAssigned();
      default:
        break;
    }
  }

  getTeamTags() {
    this.backend.getTeamTags(this.state.teamId).subscribe(res => {
      if (res != null) {
        this.tags = res;
        //set up autofill for tags
        this.filteredTags = this.rawTagsForm.valueChanges
          .pipe(
            startWith(''),
            map(tag => tag ? this._filterTags(tag) : this.tags.slice())
          );
      }
      else {
        console.log('Could not retrieve tags');
      }
    })
  }

  getUserTags() {
    this.backend.getUserTags(this.auth.getUserId()).subscribe(res => {
      if (res != null) {
        this.tags = res;
        //set up autofill for tags
        this.filteredTags = this.rawTagsForm.valueChanges
          .pipe(
            startWith(''),
            map(tag => tag ? this._filterTags(tag) : this.tags.slice())
          );
      }
      else {
        console.log('Could not retrieve tags');
      }
    })
  }

  onAssign(id: number) {
    let user = this.assignedControl[id].value as TeamMember;
    this.backend.assignUserToTask(id, +user.id).subscribe((res) => {
      let snackbarRef = this.snackbar.open('Task Assigned to User', 'Ok', { duration: 3000 });
      this.loadTeamMemberData();

    })
  }

  getTeamTasks() {
    console.log('we are in team tasks');

    this.backend.getTeamTasks(this.state.teamId).subscribe((result) => {
      console.log(result);
      this.tasks = [];
      this.tasks = result as Task[];
      for(let task of this.tasks) {
        this.assignedControl[task.id] = new FormControl('');

        if (task.assigned > 0) {
          for (let member of this.teamMembers) {
            if (member.id == task.assigned) {
              this.assignedControl[task.id].setValue(member);              
            }
          }
        } 
      }
      result.forEach(e => {
        if (!e.isFinished) { //only add if not finished
          //this.tasks.push(e);
          this.getTaskTags(e.id);

        }
        //clear tag filter
        this.rawTagsForm.setValue('');
        //save list in case of filtering
        this.unfilteredTasks = this.tasks;
      });

      //check sort option
      this.checkSort();

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  getUserTasks() {
    //clear list first

    this.backend.getUserTasks(this.auth.getUserId()).subscribe(result => {
      console.log('retrieved tasks:');
      console.log(result);
      //window.alert('Got Tags');

      this.tasks = [];
      //set display to show result
      this.tasks = result as Task[];
      result.forEach(e => {
        if (!e.isFinished) { //only add if not finished
          //get tags for each task
          this.getTaskTags(e.id);

        }

        //clear tag filter
        this.rawTagsForm.setValue('');

        //save list in case of filtering
        this.unfilteredTasks = this.tasks;

      });

      //check sort option
      this.checkSort();

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  getTaskTags(taskID: number) {
    this.backend.getTaskTags(taskID).subscribe(res => {
      console.log('tags retrieved for task ' + taskID + ':');
      console.log(res);

      var count = 0;
      this.tasks.forEach(t => {
        if (t.id === taskID) {
          this.tasks[count].tags = res;
        }
        count++;
      });

    });
  }

  removeTag(taskID: number, tagID: number) {
    const dialogRef = this.create_dialog.open(DeleteConfirmDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { //if confirmed, delete
        this.backend.removeTag(taskID, tagID).subscribe(res => {
          console.log('TagID ' + tagID + ' removed From TaskID ' + taskID);

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Tag removed from that task!', 'Ok', { duration: 3000 });

          //reload tags
          this.getTaskTags(taskID);

          //maintain sort option
          this.checkSort();
        },
          error => {
            console.log(error.message);
            //three second snackbar pop up notification
            let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
          });
      }
      else { /* do nothing */ }
    });
  }

  addTag(task: Task) {
    const dialogRef = this.create_dialog.open(AddTagDialog, {
      width: '325px',
      data: { tagID: -1, userID: this.auth.getUserId() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        let exists: boolean = false;

        task.tags.forEach(t => {
          if (t.id === result.tagID || (result.isPrio && t.name.includes('priority'))) { //if this task already has that tag, or if they are trying to add another priority to the task, stop
            //three second snackbar pop up notification
            let snackbarRef = this.snackbar.open('Invalid Tag to add to that Task', 'Ok', { duration: 3000 });
            exists = true;
          }
        });

        if (!exists) {
          this.backend.addTag(task.id, result.tagID).subscribe(res => {
            //three second snackbar pop up notification
            let snackbarRef = this.snackbar.open('Tag added to that Task!', 'Ok', { duration: 3000 });

            this.getTaskTags(task.id);

            //maintain sort option
            this.checkSort();
          },
            error => {
              console.log(error.message);
              //three second snackbar pop up notification
              let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
            }
          );
        }
      }
      else { /* do nothing for now */ }
    });
  }

  deleteTask(task: Task) {
    const dialogRef = this.create_dialog.open(DeleteConfirmDialog, {
      width: '325px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { //if confirmed, delete

        //get index of the task
        const index = this.tasks.indexOf(task);

        //remove task from task list displayed
        this.tasks.splice(index, 1);

        //snackbar pop-up to give user option to undo
        let snackbarRef = this.snackbar.open('Task deleted!', 'Undo', { duration: 3000 });

        //if user chooses to undo, splice task back to where it was in the list
        snackbarRef.onAction().subscribe(res => {
          console.log('tasks: task was not deleted (undo action)');
          this.tasks.splice(index, 0, task);
        });

        //after snackbar is dimissed, check to see if action was done
        snackbarRef.afterDismissed().subscribe(res => {
          if (!res.dismissedByAction) { //only delete if action wasn't done
            this.backend.deleteTask(task.id).subscribe(res => {
              console.log('delete request sent');
            },
              error => {
                console.log(error.message);
                //three second snackbar pop up notification
                let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });

                //add task back into list
                this.tasks.splice(index, 0, task);
              });
          }
        });
      }
      else { /*do nothing */ }
    });
  }

  editTask(task: Task) {
    let dialogRef = this.create_dialog.open(EditTaskDialog, {
      width: '400px',
      data: {
        title: task.title,
        body: task.body,
        workedDuration: task.workedDuration,
        estimatedHour: task.estimatedHour,
        estimatedMin: task.estimatedMin,
        expDuration: task.expDuration,
        completeDate: task.completeDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      let edit : TaskEdit = result as TaskEdit;
      if (edit != null) {
        //check if task already exists under given name
        let exists: boolean = false;
        if (edit.title != task.title) { //if new task name given is different from the old one
          this.tasks.forEach(element => { //check to make sure it doesn't match any other tag names
            if (element.title === edit.title) {
              //notify user
              let snackbarRef = this.snackbar.open('You already have a task with that name!', 'Ok', { duration: 3000 });

              //mark flag
              exists = true;
            }
          });
        }

        if (exists) { //if it already exists, don't make a new one
          return;
        }

        //format Date into string for backend
        edit.completeDate = formatDate(edit.completeDate, 'yyyy-MM-dd', 'en-US');

        this.backend.editTask(task.id, edit).subscribe(res => {
          console.log('task ' + task.id + ' updated');

          //three second snackbar pop up notification
          let snackbarRef = this.snackbar.open('Task Updated!', 'Ok', { duration: 3000 });

          //update display
          this.getUserTasks();
        },
          error => {
            console.log(error.message);
            //three second snackbar pop up notification
            let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
          });
      }
      else { /* do nothing */ }
    })
  }

  startTask(taskID: number, index: number) {
    this.backend.startTask(taskID).subscribe(res => {

      //update that task only
      this.backend.getTask(taskID).subscribe(r => {
        this.tasks[index] = r;
        this.getTaskTags(taskID);

      },
        error => {

        });

      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Task Started!', 'Ok', { duration: 3000 });

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  stopTask(taskID: number, index: number) {
    this.backend.stopTask(taskID).subscribe(res => {
      //update that task only
      this.backend.getTask(taskID).subscribe(r => {
        this.tasks[index] = r;
        this.getTaskTags(taskID);
      },
        error => {

        });
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Task Stopped!', 'Ok', { duration: 3000 });

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  finishTask(taskID: number, index: number) {
    this.backend.finishTask(taskID).subscribe(res => {
      let val = ((+res.actualDuration / +res.expDuration) * 10).toFixed(2);
      //remove task from list
      this.tasks.splice(index, 1);

      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('This task\'s Estimation Accuracy: ' + val + '%', 'Ok', { duration: 3000 });

    }, error => {
      console.log(error.message);
      //three second snackbar pop up notification
      let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
    });
  }

  getMinutes(seconds: number): number {
    var hrs = 0;
    if (seconds > 3600)
      hrs = Math.floor(seconds / 3600);

    var min = (seconds - (hrs * 3600)) / 60;
    return Math.floor(min);
  }

  getHours(seconds: number): number {
    if (seconds > 3600)
      return Math.floor(seconds / 3600);
    else
      return 0;
  }

  sortbyPrio() {
    this.sort_by = 1;
    this.tasks.sort(function (a: Task, b: Task) {
      var aprio = '';
      var bprio = '';

      a.tags.forEach(atag => {
        if (atag.name.includes('priority'))
          aprio = atag.name;
      });

      b.tags.forEach(btag => {
        if (btag.name.includes('priority'))
          bprio = btag.name;
      });

      return bprio.localeCompare(aprio);
    });
  }

  sortByAssigned() {
    this.sort_by = 3;
    this.tasks.sort(function (a: Task, b: Task){
      let assignedOne = a.assigned;
      let assignedTwo = b.assigned;
      

      if (assignedOne > assignedTwo) {
        return 1.0;
      } else if (assignedOne == assignedTwo) {
        return 0.0;
      } else {
        return -1.0;
      }
    })
  }

  sortbyCreationDate() {
    this.sort_by = 2;
    this.tasks.sort(function (a: Task, b: Task) {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); //sort from first to last
      //for some reason we have to instantiate another Date object for getTime() to work
    });

  }

  public onTagSelect(tagName: string) {
    this.rawTagsForm.setValue(tagName); //set value of autocomplete

    //clear list of tasks, add only ones with queried tag
    this.tasks = [];
    this.unfilteredTasks.forEach(t => {
      t.tags.forEach(e => {
        if (e.name === tagName) { //if tag is somewhere in the tasks list of tags
          this.tasks.push(t);
        }
      });

    });
  }

  public onClearSelect() {
    //set list of tasks to equal unfiltered array
    this.tasks = this.unfilteredTasks;

    //clear tag filter
    this.rawTagsForm.setValue('');
  }

  private _filterTags(value: string): Tag[] {
    const filterValue = value.toLowerCase();

    return this.tags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0);
  }

  collapse(id) {
    var content = document.getElementById('content_' + id).style;
    if (content.display == "block") {
      content.display = "none";
    } else {
      content.display = "block"
    }
  }

  onCreatePressed() {
    this.router.navigateByUrl('create/task');
  }

  _formatDate(d: Date): string { //special function to format date for UI
    return formatDate(d, 'MMMM dd, yyyy', 'en-US');
  }
}

interface TeamMember {
  id: number,
  name: string,
  email: string,
  admin: string
}

