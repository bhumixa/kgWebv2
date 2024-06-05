import { Component, OnInit } from '@angular/core';
import { FieldType } from "@ngx-formly/core";

@Component({
  selector: 'app-ngx-time',
  templateUrl: './ngx-time.component.html',
  styleUrls: ['./ngx-time.component.scss'],
})
export class NgxTimeComponent extends FieldType implements OnInit {

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
