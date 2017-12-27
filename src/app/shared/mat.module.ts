// Angular
import { NgModule } from '@angular/core';

// Material
import { 
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule
  } from '@angular/material';
  import {CdkTableModule} from '@angular/cdk/table';
  import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    exports: [
        BrowserAnimationsModule,
        CdkTableModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatToolbarModule,
        MatMenuModule,
        MatSidenavModule,
        MatCardModule,
        MatDialogModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule
    ]
})

export class MaterialDesignModule {}