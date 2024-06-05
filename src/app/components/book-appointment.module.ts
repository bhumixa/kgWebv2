import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        // ReactiveFormsModule,
        IonicModule,
        TranslateModule
    ],
    declarations: [BookAppointmentComponent],
    exports: [BookAppointmentComponent]
})
export class BookAppointmentModule {}
