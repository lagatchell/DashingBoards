import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';

import { DataSourceService } from '../../services/data-source.service';

import { AppSettingsDialog } from '../../dialogs/app-settings/app-settings.dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  isLoading: boolean = true;
  loadingItem: string = '';

  constructor(
    public DataSourceService: DataSourceService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.DataSourceService.isLoading.subscribe(state => {
      this.isLoading = state;
    });

    this.DataSourceService.loadingItem.subscribe(loadingItem => {
      this.loadingItem = loadingItem;
    });
  }

  openSettings() {
      let dialogRef = this.dialog.open(AppSettingsDialog, {
        height: '500px',
        width: '500px',
        data: {}
    });
  }

}
