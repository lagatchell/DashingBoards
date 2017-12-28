// Angular
import { NgModule } from '@angular/core';

// Material
import { 
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
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
    MatCheckboxModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatExpansionModule
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
        MatSlideToggleModule,
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
        MatCheckboxModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatExpansionModule
    ]
})

export class MaterialDesignModule {}