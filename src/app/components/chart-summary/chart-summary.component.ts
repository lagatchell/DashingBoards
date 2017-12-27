import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';

import { DataSourceService } from '../../services/data-source.service';

import { ProjectTasksDialog } from '../../dialogs/project-tasks/project-tasks.dialog';

@Component({
  selector: 'chart-summary',
  templateUrl: './chart-summary.component.html',
  styleUrls: ['./chart-summary.component.css']
})
export class ChartSummaryComponent implements OnInit {
    
    isEmpty: boolean = true;
    totalTasks: any = null;

    projects = [];
    projectIdTotalKey = {};

    constructor(public DataSourceService: DataSourceService, public dialog: MatDialog) {}

    ngOnInit() {
        this.projects = this.DataSourceService.projects;
        
        this.DataSourceService.projectIdTotalKey$.subscribe(key => {
            this.projectIdTotalKey = key;
        });

        this.DataSourceService.totalTasks.subscribe(total => {
            this.totalTasks = total;
            this.isEmpty = (this.totalTasks)? false: true;
        });
    }

    getProjectTaskInfo(project) {
        let dialogRef = this.dialog.open(ProjectTasksDialog, {
            height: '700px',
            width: '1000px',
            data: project
        });
    }

}