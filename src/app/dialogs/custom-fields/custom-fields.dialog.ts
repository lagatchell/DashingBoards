// Angular
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

// Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SnackBarComponent } from '../../shared/snackbar.component';
import { DataSourceService } from '../../services/data-source.service';

import { Observable } from 'rxjs';

@Component({
    selector: 'info-dialog',
    templateUrl: './custom-fields.dialog.html',
    styleUrls: ['./custom-fields.dialog.css']
})

export class CustomFieldsDialog {

    customFields: any;
      
    constructor(
        public dialogRef: MatDialogRef<CustomFieldsDialog>,
        @Inject(MAT_DIALOG_DATA) public project: any,
        public DataSourceService: DataSourceService,
        public snackbar: SnackBarComponent
    ){}
  
    ngOnInit() {
        this.getCustomFields();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    getCustomFields() {
        this.customFields = this.DataSourceService.custom_fields;
    }

    saveCustomFieldValues() {
        this.DataSourceService.custom_fields = this.customFields;
        this.snackbar.open('Custom Fields have been saved');
        this.onNoClick();
    }

    clearCustomFieldValues() {
        for (let i = 0; i < this.customFields.length; i++) {
            this.customFields[i].data.value = null;
          }
    }
}