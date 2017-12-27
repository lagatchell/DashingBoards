// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Components
import { MainComponent } from '../components/main/main.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '**' , component: MainComponent }
        ])
    ],
    exports: [
        RouterModule
    ],
    declarations: [
    ]
})
export class AppRoutingModule {}