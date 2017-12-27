// Angular
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

// Material
import { MatPaginator, MatTableDataSource, MatSort, Sort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DataSourceService } from '../../services/data-source.service';

@Component({
    selector: 'info-dialog',
    templateUrl: './project-tasks.dialog.html',
    styleUrls: ['./project-tasks.dialog.css']
  })

  export class ProjectTasksDialog {

    displayedColumnKeys = ['name', 'created_at', 'due_on', 'completed_at'];
    displayedColumns = [
        {
            id: 'name',
            display: 'Task Name',
            type: 'text'
        },
        {
            id: 'created_at',
            display: 'Created Date',
            type: 'date'
        },
        {
            id: 'due_on',
            display: 'Due Date',
            type: 'date'
        },
        {
            id: 'completed_at',
            display: 'Completed Date',
            type: 'date'
        }
    ];

    dataSource: MatTableDataSource<any>;

    constructor(
        public dialogRef: MatDialogRef<ProjectTasksDialog>,
        @Inject(MAT_DIALOG_DATA) public project: any,
        public DataSourceService: DataSourceService
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.DataSourceService.getCachedProjectTasksById(this.project.id).then((tasks: any) => {
            this.dataSource = new MatTableDataSource<any>(tasks);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); 
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

  }