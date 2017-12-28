import { Component, OnInit } from '@angular/core';

import { DataSourceService } from '../../services/data-source.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'chart-builder',
  templateUrl: './chart-builder.component.html',
  styleUrls: ['./chart-builder.component.css']
})
export class ChartBuilderComponent implements OnInit {

  chartTypes = [
    {value: 'bar', display: 'Bar'}, 
    {value: 'pie', display: 'Pie'}, 
    {value: 'doughnut', display: 'Doughnut'}, 
    {value: 'radar', display: 'Radar'}, 
    {value: 'polarArea', display: 'Polar Area'}, 
    {value: 'line', display: 'Line'}
  ];

  dateTypes = [
    {value: 'created_at', display: 'Created Date'}, 
    {value: 'due_on', display: 'Due Date'}, 
    {value: 'completed_at', display: 'Completed Date'}
  ];

  years = [
    '2015',
    '2016',
    '2017',
    '2018'
  ];

  customFields = [];
  customFieldValues = {};

  selectedChartType: string = 'bar';
  selectedDateType: string = 'created_at';
  startDate: string = '';
  endDate: string = '';
  selectedYear: string = new Date().getFullYear().toString();
  showYearSelector: boolean = false;

  constructor(public DataSourceService: DataSourceService) { }

  ngOnInit() {
    this.getCustomFields();
  }

  buildChart() {
    this.DataSourceService.custom_fields = this.customFields;
    this.DataSourceService.setChartConfig(this.selectedChartType, this.selectedDateType, this.startDate, this.endDate, this.selectedYear);
  }

  clearChart() {
    this.selectedChartType = 'bar';
    this.selectedDateType = 'created_at';
    this.startDate = null;
    this.endDate = null;
    this.selectedYear = new Date().getFullYear().toString();
    this.showYearSelector = false;

    for (let i = 0; i < this.customFields.length; i++) {
      this.customFields[i].data.value = null;
    }

    this.DataSourceService.clearDataSource();
  }

  onChartTypeChange() {
    this.showYearSelector = (this.selectedChartType === "line")? true: false;
  }

  getCustomFields() {
    this.customFields = this.DataSourceService.custom_fields;
  }
}
