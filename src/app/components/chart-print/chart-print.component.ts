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
      /* let printContents, popupWin;
      printContents = ""; 
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Print tab</title>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );
      popupWin.document.close(); */
    }

}
