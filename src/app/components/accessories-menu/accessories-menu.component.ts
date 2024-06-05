import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { ConfigServiceService } from 'src/app/service/config-service.service';
import { DatabaseServiceService } from 'src/app/service/database-service.service';

@Component({
  selector: 'app-accessories-menu',
  templateUrl: './accessories-menu.component.html',
  styleUrls: ['./accessories-menu.component.scss'],
})
export class AccessoriesMenuComponent implements OnInit {
  @Output() itemSelected = new EventEmitter<string>();
  image: string;
  selectedItem: any;
  // categoryId: any;
  categoryId: any = 0;
  @Output() valueEmitter = new EventEmitter<string>();

  constructor(
    private elementRef: ElementRef,
    public http: HttpClient,
    private databaseService: DatabaseServiceService,
    private configService: ConfigServiceService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.getAllLayouts().then(() => {
      this.selectedItem = this.items[0] ?? [];
      this.itemSelected.emit(this.selectedItem);
    });
  }
  selectItem(item: any) {
    this.selectedItem = item;
    this.itemSelected.emit(item);
  }

  items: { image: string; title: string; id: any; isActive: any }[] = [];

  async getAllLayouts() {
    try {
      const url = `https://apin.lattice-dev.atishae.com/layoutCategory`;
      let response: any = await this.http.get(url).toPromise();
      if (response.data) {
        this.items = response?.data?.map((item: any) => {
          let temp: { image: string; title: string; id: any; isActive: any } = {
            image: '',
            title: '',
            id: '',
            isActive: '',
          };
          this.categoryId = item.id;

          temp.image = item.imageUrl;
          temp.title = item.title;
          temp.id = item.id;
          temp.isActive = item.isActive;

          return temp;
        });
      }

      return response;
    } catch (e) {
      return e;
    }
  }
}
