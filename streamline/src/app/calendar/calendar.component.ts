import {
  Component,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { AuthService } from '../auth.service';
import { BackendService, TaskEdit } from '../backend.service';
import { Task, Tag } from '../app.module';
import { MatSnackBar } from '@angular/material';
import { EventColor } from 'calendar-utils';
import { Router } from '@angular/router';
import { StateService } from '../state.service';
import { formatDate } from '@angular/common';

const colors: any = {
  red: {
    primary: '#AD2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#2121AD',
    secondary: '#E2E2FA'
  },
  yellow: {
    primary: '#E3BC08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#21AD21',
    secondary: '#E3FAE3'
  },
  grey: {
    primary: '#666666',
    secondary: '#D1D1D1'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  private tasks: Task[] = [];

  private header: string = 'Your Calendar';
  constructor(
    private modal: NgbModal,
    private auth: AuthService,
    private backend: BackendService,
    private snackbar: MatSnackBar,
    private router: Router,
    private state: StateService
  ) {
    this.events = [];

    this.loadData();
    this.state.teamDataChange.subscribe((val) => {
      this.events = [];
      this.loadData();
    });
  }

  onHome() {
    this.router.navigateByUrl('home');
  }

  loadData() {
    if (this.state.teamId != 0) {
      this.getTeamTasks();
      this.header = this.state.teamName + '\'s Calendar';
    } else {
      this.header = 'Your Calendar';
      this.getUserTasks();
    }
  }

  getTeamTasks() {
    this.backend.getTeamTasks(this.state.teamId).subscribe(res => {
      console.log('calendar: tasks retreived');
      //set display to show result
      res.forEach(e => {
        if (!e.isFinished) { //only add if not finished
          this.tasks.push(e);

          //get tags for each task
          this.getTaskTags(e);

        }
      });
    },
      error => {
        console.log(error.message);
        //three second snackbar pop up notification
        let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
      });
  }

  getUserTasks() {
    this.backend.getUserTasks(this.auth.getUserId()).subscribe(res => {
      console.log('calendar: tasks retreived');
      //set display to show result
      res.forEach(e => {
        if (!e.isFinished) { //only add if not finished
          this.tasks.push(e);

          //get tags for each task
          this.getTaskTags(e);

        }
      });
    },
      error => {
        console.log(error.message);
        //three second snackbar pop up notification
        let snackbarRef = this.snackbar.open('Oh no, something went wrong!', 'Ok', { duration: 3000 });
      });
  }

  getTaskTags(task: Task) {
    this.backend.getTaskTags(task.id).subscribe(res => {
      var count = 0;
      this.tasks.forEach(t => {
        if (t.id === task.id) {
          this.tasks[count].tags = res;
        }
        count++;
      });

      this.addEvent(task);

    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }


  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {

    console.log(newStart);

    //update Task with new start date
    //find task object with given name
    let task: Task = null;
    for (var i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].title === event.title) {
        task = this.tasks[i];
        break;
      }
    }

    //construct edit object
    let edit: TaskEdit = {
      title: task.title,
      body: task.body,
      workedDuration: task.workedDuration,
      estimatedMin: task.estimatedMin,
      estimatedHour: task.estimatedHour,
      expDuration: task.expDuration,
      completeDate: formatDate(newStart, 'yyyy-MM-dd', 'en-US') //format date for backend
    }

    //send update
    this.backend.editTask(task.id, edit).subscribe(() => {
      console.log('task date updated');
    }, error => {
      console.log('error with moving task');
    });

    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(task: Task): void {
    let color: EventColor = { primary: '#999999', secondary: '#999999' };

    if (task.lastWorkedAt != null) { //in-progress
      color = colors.green;
    }
    else if (task.lastWorkedAt == null && task.workedDuration === 0) { //not started yet
      color = colors.blue;
    }
    else if (task.lastWorkedAt == null && task.workedDuration > 0) { //paused
      color = colors.red;
    }
    else { //default
      color = colors.grey;
    }

    this.events = [
      ...this.events,
      {
        title: task.title,
        start: startOfDay(task.completeDate),
        //   end: endOfDay(new Date()),
        color: color,
        draggable: true, //false for now, setting to true would require update 
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        allDay: true
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
