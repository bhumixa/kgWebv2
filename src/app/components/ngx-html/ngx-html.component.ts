import { Component, OnInit } from '@angular/core';
import { FieldType } from "@ngx-formly/core";

@Component({
  selector: 'app-ngx-html',
  templateUrl: './ngx-html.component.html',
  styleUrls: ['./ngx-html.component.scss'],
})
export class NgxHtmlComponent extends FieldType implements OnInit {

  constructor() {
    super()
  }


  ngOnInit() {}

}


