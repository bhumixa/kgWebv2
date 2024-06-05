import { Component, OnInit } from '@angular/core';
import { FieldType } from "@ngx-formly/core";

@Component({
  selector: 'app-ngx-number',
  templateUrl: './ngx-number.component.html',
  styleUrls: ['./ngx-number.component.scss'],
})
export class NgxNumberComponent extends FieldType implements OnInit {

  constructor() {
    super()
  }

  change($event) {
    if (!!this.to.change) {
      this.to.change(this, $event);
    }
  }

  ngOnInit() { }

}

