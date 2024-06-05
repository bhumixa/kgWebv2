import { Component, OnInit, Input } from "@angular/core";
import { IonicSelectableComponent } from "ionic-selectable";
import { ModalController } from "@ionic/angular";
import { SelectedValuesService } from "../../service/observable/selected-values/selected-values.service";

@Component({
  selector: 'app-ionic-selectable-comp',
  templateUrl: './ionic-selectable-comp.component.html',
  styleUrls: ['./ionic-selectable-comp.component.scss']
})
export class IonicSelectableCompComponent implements OnInit {
  @Input() list: any;
  @Input() selectedValue: any;
  @Input() id: any;
  @Input() name: any

  constructor(public modalCtrl: ModalController,
    public _selectedValuesService: SelectedValuesService) {
  }

  ngOnInit() {
    // console.log("inside select component ngOnInit", this.list, this.selectedValue);
  }

  valueChange(event: { component: IonicSelectableComponent; value: any }) {
    // console.log("selected values:", event);
    this._selectedValuesService.observables.next(event.value);
  }

  public closeModal() {
    this.modalCtrl.dismiss();
  }
}
