import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { DiaCompGeneralInfoComponent } from './dia-comp-general-info/dia-comp-general-info.component';
import { DiaCompUserAccountComponent } from './dia-comp-user-account/dia-comp-user-account.component';
import { DiaCompUserKycComponent } from './dia-comp-user-kyc/dia-comp-user-kyc.component';
import { DiaCompUserReferencesComponent } from './dia-comp-user-references/dia-comp-user-references.component';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, TranslateModule],
    declarations: [DiaCompGeneralInfoComponent, DiaCompUserAccountComponent, DiaCompUserKycComponent, DiaCompUserReferencesComponent],
    exports: [DiaCompGeneralInfoComponent, DiaCompUserAccountComponent, DiaCompUserKycComponent, DiaCompUserReferencesComponent]
})
export class KgGeneralInfoComponentsModule { }
