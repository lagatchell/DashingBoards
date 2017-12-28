import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {ChartModule} from 'primeng/primeng';

import { AppComponent } from './app.component';
import { ChartBuilderComponent } from './components/chart-builder/chart-builder.component';
import { MainComponent } from './components/main/main.component';

import { AppRoutingModule } from './shared/app.routing';
import { MaterialDesignModule } from './shared/mat.module';
import { ChartViewerComponent } from './components/chart-viewer/chart-viewer.component';
import { ChartSummaryComponent } from './components/chart-summary/chart-summary.component';

import { DataSourceService } from './services/data-source.service';

import { SnackBarComponent } from './shared/snackbar.component';

import { ProjectTasksDialog } from './dialogs/project-tasks/project-tasks.dialog';
import { AppSettingsDialog } from './dialogs/app-settings/app-settings.dialog';
import { ChartPrintComponent } from './components/chart-print/chart-print.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartBuilderComponent,
    MainComponent,
    ChartViewerComponent,
    ChartSummaryComponent,
    SnackBarComponent,
    ProjectTasksDialog,
    AppSettingsDialog,
    ChartPrintComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartModule,
    AppRoutingModule,
    MaterialDesignModule,
    FormsModule
  ],
  entryComponents: [
    ProjectTasksDialog,
    AppSettingsDialog
  ],
  providers: [
    DataSourceService,
    SnackBarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
