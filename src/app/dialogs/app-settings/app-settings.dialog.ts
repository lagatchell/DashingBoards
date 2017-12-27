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
      
    constructor(
        public dialogRef: MatDialogRef<AppSettingsDialog>,
        @Inject(MAT_DIALOG_DATA) public project: any,
        public DataSourceService: DataSourceService
    ){}
  
    ngOnInit() {
        this.workspaces = this.DataSourceService.workspaces;
        this.selectedWorkspace = this.DataSourceService.selectedWorkspace.id;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    saveSettings() {  
        if (this.DataSourceService.selectedWorkspace.id !== this.selectedWorkspace) {
            this.DataSourceService.selectedWorkspace.id = this.selectedWorkspace;
            this.DataSourceService.init();
        }

        this.onNoClick();
    }
}