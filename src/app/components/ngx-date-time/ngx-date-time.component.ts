import { Component, OnInit } from '@angular/core';
import { FieldType } from "@ngx-formly/core";
import { format } from 'date-fns';

@Component({
  selector: 'app-ngx-date-time',
  templateUrl: './ngx-date-time.component.html',
  styleUrls: ['./ngx-date-time.component.scss'],
})
export class NgxDateTimeComponent extends FieldType implements OnInit {
  public myDate = format(new Date(), 'dd/MM/yyyy');
  public datePickerObj: any = {};
  constructor() {
    super()
  }

  ngOnInit() {
    this.datePickerObj = {
      setLabel: 'Set',  // default 'Set'
      todayLabel: 'Today', // default 'Today'
      closeLabel: 'Close', // default 'Close'
      titleLabel: 'Select a Date', // default null
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      dateFormat: 'DD/MM/YYYY',
      clearButton: false, // default true
      momentLocale: 'pt-BR', // Default 'en-US'
      yearInAscending: true, // Default false
      btnCloseSetInReverse: true, // Default false
      btnProperties: {
        expand: 'block',
        size: 'small',
      },
      arrowNextPrev: {
        nextArrowSrc: 'assets/images/arrow_right.svg',
        prevArrowSrc: 'assets/images/arrow_left.svg'
      },

      isSundayHighlighted: {
        fontColor: '#ee88bf'
      },

      ...this.to.options
    };
  }
}
