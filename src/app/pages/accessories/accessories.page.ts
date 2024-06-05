import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.page.html',
  styleUrls: ['./accessories.page.scss'],
})
export class AccessoriesPage implements OnInit {
  selectedMenuItem: string = 'bracelet';
  @Input() categoryId: any = 0;
  items: any;
  constructor(
    private toastController: ToastController,
    public http: HttpClient
  ) {}

  ngOnInit() {}
  async onItemSelected(item: string) {
    this.selectedMenuItem = item;
  }
  ngOnChanges() {}
}
