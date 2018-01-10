import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';

import { DataSourceService } from '../../services/data-source.service'
import { isEmpty } from 'rxjs/operator/isEmpty';

@Component({
  selector: 'chart-print',
  templateUrl: './chart-print.component.html',
  styleUrls: ['./chart-print.component.css']
})
export class ChartPrintComponent implements OnInit {

  panelOpenState: boolean = false;
  isEmpty: boolean = true;
  projects = [];
  printChart: boolean = false;
  projectsToPrint: any = {};

  showPrintChartOption: boolean = false;

  constructor(public DataSourceService: DataSourceService, public dialog: MatDialog) {}

  ngOnInit() {
    this.projects = this.DataSourceService.projects;
    this.projectsToPrint = this.DataSourceService.projectPrintState;

    if (this.projects.length > 0) {
      this.isEmpty = false;
    }

  }

  print(): void {
      let printContents = '', popupWin;
      let projectTasks = (this.DataSourceService.hasFilters)? this.DataSourceService.filteredProjectTasks: this.DataSourceService.projectTasks;

      // #region Chart
      if (this.printChart && this.DataSourceService.latestChartImage !== '' && this.DataSourceService.latestChartImage !== undefined) {
        printContents += `<img id='chart' class='chart-image' name='chart' style='width: 100%;' src="${this.DataSourceService.latestChartImage}" />`;
      }
      // #endregion

      // #region Chart Configuration
      let config = this.DataSourceService.latestChartConfig;
      printContents += `<div class="project-header"><h3>Chart Filters</h3></div><table>
            <tr>
              <th>Chart Type</th>
              <th>Date Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Year</th>
            </tr>
            <tr>
              <td>${this.formattedChartType(config.chartType)}</td>
              <td>${this.formattedDateType(config.dateType)}</td>
              <td>${this.formattedDate(config.startDate)}</td>
              <td>${this.formattedDate(config.endDate)}</td>
              <td>${config.year}</td>
            <tr />
      </table><br />`;
      // #endregion

      // #region Custom Fields
      let customFields = this.DataSourceService.custom_fields;
      printContents += `<div class="project-header"><h3>Custom Fields</h3></div><table>
            <tr>
              <th>Field Name</th>
              <th>Field Value</th>
            </tr>
      `;
      for (let i = 0; i < customFields.length; i++) {
        if (customFields[i].data.value !== null && customFields[i].data.value !== '') {
          printContents += `<tr><td>${customFields[i].data.name}</td>`;
          printContents += `<td>${customFields[i].data.value}</td></tr>`;
        }
      }
      printContents += `</table><br />`;
      // #endregion

      // #region Project Tasks
      for (const projectID in this.projectsToPrint) {
        if (this.projectsToPrint.hasOwnProperty(projectID)) {
          if (this.projectsToPrint[projectID]){
            printContents += `<div class="project-header"><h3>${this.DataSourceService.projectIdNameKey[projectID]} 
            (${this.DataSourceService.projectIdTotalKey[projectID]})</h3></div><table>`;

            printContents += `<tr>
              <th>Task Name</th>
              <th>Created Date</th>
              <th>Due Date</th>
              <th>Completed Date</th>
            </tr>`;

            let proj = projectTasks[projectID];
            for (let i = 0; i < proj.length; i++) {
              printContents += `<tr><td>${proj[i].name}</td>`;
              printContents += `<td>${this.formattedDate(proj[i].created_at)}</td>`;
              printContents += `<td>${this.formattedDate(proj[i].due_on)}</td>`;
              printContents += `<td>${this.formattedDate(proj[i].completed_at)}</td></tr>`;
            }
            printContents += `</table><br />`;
          }
        }
      }
      // #endregion

      // #region Print Window
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Dashing Boards</title>
            <link href="//fonts.googleapis.com/css?family=Nunito:400,400i,700,700i,900" rel="stylesheet" />
            <style>
              body {
                font-family: nunito;
              }
              .project-header {
                padding: 5px;
                background-color: #686868;
                border: 1px solid #686868;
                color: #fff;
              }
              .project-header>h3 {
                margin: 5px;
              }
              .chart-image {
                margin-bottom: 10px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              td, th {
                border: 1px solid #686868;
                text-align: left;
                padding: 8px;
              }
              th:first-of-type {
                width: 45%;
              }
              tr:nth-child(even) {
                background-color: #e1e1e1;
              }
            </style>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );
      popupWin.document.close();
      // #endregion
  }

  formattedDate(date) {
    if (this.DataSourceService.IsNullorUndefined(date) || date === '') {
      return '';
    }

    date = new Date(date);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear(); 
  }

  formattedChartType(type) {
    switch (type) {
      case 'doughnut':
        type = 'Doughnut';
        break;
      case 'pie':
        type = 'Pie';
        break;
      case 'line':
        type = 'Line';
        break;
      case 'bar':
        type = 'Bar';
        break;
      case 'polarArea':
        type = 'Polar Area';
        break;
      case 'radar':
        type = 'Radar';
        break;
    };

    return type;
  }

  formattedDateType(type) {
    switch (type) {
      case 'created_at':
        type = 'Created Date';
        break;
      case 'due_on':
        type = 'Date Date';
        break;
      case 'completed_at':
        type = 'Completed Date';
        break;
    };

    return type;
  }
}
