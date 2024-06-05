import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'loader-button',
  templateUrl: './loader-button.component.html',
  styleUrls: ['./loader-button.component.scss'],
})
export class LoaderButtonComponent implements OnInit {

  @Input() text: string;
  @Input() expand: string;
  @Input() colorName: boolean;
  @Input() check: boolean;
  @Output() click = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

}
