import { Component, OnInit } from '@angular/core';

/* Stub filler for Tags */
const TAGS: Tag[] = [
  { id: 11, name: 'CS homework', description: 'something something' },
  { id: 12, name: 'Laundry', description: 'another desc' },
  { id: 13, name: 'Gym', description: 'filler text' },
];

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  opened: boolean;
  tags: Tag[];
  selectedTag: Tag;

  constructor() {
    this.tags = TAGS;
    this.opened = false;
   }

  ngOnInit() {
  }

  createTag(){
    alert("hello");
  }

  onSelect(tag: Tag): void {
    if(this.opened){ //if already open, close it.
      this.opened = false;
    }

    //load data for that tag ------
    this.selectedTag = tag;

    //open tab again
    this.opened = true;
  }
}


interface Tag {
  id: number,
  name: string,
  description: string
  /* add later when analytics are applicable
    tasks_comp: int,
    average_time: double,
    average_acc: double,
    task_overunder: double,
    color?
  */
};