// Angular
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

// Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DataSourceService } from '../../services/data-source.service';

import { Observable } from 'rxjs';

@Component({
    selector: 'info-dialog',
    templateUrl: './app-settings.dialog.html',
    styleUrls: ['./app-settings.dialog.css']
})

export class AppSettingsDialog {

    workspaces: any;
    selectedWorkspace: any;

    autoRefresh: boolean = true;
    refreshInterval: number;
      
    constructor(
        public dialogRef: MatDialogRef<AppSettingsDialog>,
        @Inject(MAT_DIALOG_DATA) public project: any,
        public DataSourceService: DataSourceService
    ){}
  
    ngOnInit() {
        this.workspaces = this.DataSourceService.workspaces;
        this.selectedWorkspace = this.DataSourceService.selectedWorkspace.id;
        this.autoRefresh = this.DataSourceService.autoRefresh;
        this.refreshInterval = this.DataSourceService.refreshWaitTime;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    saveSettings() {  
        if (this.DataSourceService.selectedWorkspace.id !== this.selectedWorkspace) {
            this.DataSourceService.selectedWorkspace.id = this.selectedWorkspace;
            this.DataSourceService.init();
        }

        if (this.refreshInterval !== this.DataSourceService.refreshWaitTime) {
            this.DataSourceService.refreshWaitTime = this.refreshInterval;
        }

        if (this.autoRefresh !== this.DataSourceService.autoRefresh) {
            if (this.autoRefresh) {
                this.DataSourceService.startBackgroundRefresh();
            } else {
                this.DataSourceService.stopBackgroundRefresh();
            }
        }

        this.onNoClick();
    }
}