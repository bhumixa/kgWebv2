import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { DatabaseServiceService } from 'src/app/service/database-service.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  ishttpLoaded: boolean = false;
  isLoaded: boolean = false;

  constructor(    public loadingService: DatabaseServiceService) {
  }

  ngOnInit() {
  }
  
  @Input() loading: boolean = false;
  @Input() httploading: boolean = false;

  ngOnChanges(changes: SimpleChange) {
    console.log(changes); //logging the changes in @Input()
  }

}
