import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-accuracy-graph',
  templateUrl: './accuracy-graph.component.html',
  styleUrls: ['./accuracy-graph.component.css']
})
export class AccuracyGraphComponent implements OnInit {

  data: any[];

  view: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date and Time';
  showYAxisLabel = true;
  yAxisLabel = 'Accuracy';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  
  constructor(private auth: AuthService, private backend: BackendService) { 
    this.backend.getUUID(this.auth.getUserId()).subscribe(UUID => {
      console.log(UUID);
      this.backend.getEstimationData(UUID).subscribe(res => {
        console.log(res);
         if(res != null){
           this.data = res;
           this.view = [700, 400];
         }
      });
    });

  }

  ngOnInit() {
  }

}
