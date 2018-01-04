import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { DataSourceService } from '../../services/data-source.service';

@Component({
  selector: 'chart-viewer',
  templateUrl: './chart-viewer.component.html',
  styleUrls: ['./chart-viewer.component.css']
})
export class ChartViewerComponent implements OnInit {

  data: any;
  chartType: string = '';
  chartOptions: any = {};
  isEmpty: boolean = true;

  constructor(public DataSourceService: DataSourceService) {}

  ngOnInit() {
    this.initializeChart();
  }

  initializeChart() {
    this.DataSourceService.getChartDataSource$().subscribe(ds => {
      this.chartType = ds.chartType;
      this.data = ds.data;
      this.chartOptions = ds.chartOptions;
      this.isEmpty = (this.chartType === '')? true: false;
      if (!this.isEmpty) {
        this.pollForChartImage();
      } else {
        this.DataSourceService.latestChartImage = '';
      }
    });
  }

  pollForChartImage() {
    setTimeout(()=>{
      let canvas = document.getElementsByTagName('canvas')[0];
      this.DataSourceService.latestChartImage = canvas.toDataURL("image/png");
    }, 1000);
  }

}
