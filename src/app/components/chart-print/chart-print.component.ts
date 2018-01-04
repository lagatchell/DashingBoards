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

      if (this.printChart && this.DataSourceService.latestChartImage !== '' && this.DataSourceService.latestChartImage !== undefined) {
        printContents += `<img id='chart' class='chart-image' name='chart' style='width: 100%;' src="${this.DataSourceService.latestChartImage}" />`;
      }

      for (const projectID in this.projectsToPrint) {
        if (this.projectsToPrint.hasOwnProperty(projectID)) {
          if (this.projectsToPrint[projectID]){
            printContents += `<div class="project-header"><h3>${this.DataSourceService.projectIdNameKey[projectID]} 
            (${this.DataSourceService.projectIdTotalKey[projectID]})</h3></div><ul>`;
            let proj = projectTasks[projectID];
            for (let i = 0; i < proj.length; i++) {
              printContents += `<li>${proj[i].name}</li>`;
            }
            printContents += `</ul>`;
          }
        }
      }

      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Print tab</title>
            <style>
              .project-header {
                padding: 5px;
                background-color: #686868;
                color: #fff;
              }
              .project-header>h3 {
                margin: 5px;
              }
              .chart-image {
                margin-bottom: 10px;
              }
              li {
                  padding: 5px;
              }
              li:nth-child(even) {
                background-color: #e1e1e1; 
              }
              ul {
                list-style-type: none;
                margin: 0;
                padding: 0;
              }
            </style>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );
      popupWin.document.close();
    }

}
