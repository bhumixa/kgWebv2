import { Component, OnInit } from '@angular/core';
import { FieldType } from "@ngx-formly/core";

import { IonicSelectableComponent } from "ionic-selectable";
import { Subscription, Observable } from "rxjs";
import { delay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-ngx-typeahead',
  templateUrl: './ngx-typeahead.component.html',
  styleUrls: ['./ngx-typeahead.component.scss'],
})
export class NgxTypeaheadComponent extends FieldType implements OnInit {

  port: any;
  text: string = 'label';
  public items: any = [];
  public selected: any;
  public displayData: any;
  public startFrom = 0;
  public endFrom = 20;
  public itemsPerPage = 20;
  public currentPage = 1;
  public dataList: any = [];
  public minLength = 0;
  public isMultiple = false;
  portsSubscription: Subscription;
  public search = '';
  public companyName: any = [];

  constructor(
    public _httpClient: HttpClient,
  ) {
    super();
  }

  ngOnInit() {

    this.dataList = this.to.options;

    if (!this.to.search) {
      this.getPaginationData();
    }
    if (this.to.minLength) {
      this.minLength = this.to.minLength;
    }
    if (this.to.isMultiple) {
      this.isMultiple = this.to.isMultiple;
      if (!!this.to.defaultValue && this.to.defaultValue.length > 0) {
        let allLables = this.to.defaultValue.map(a => a.label);
        this.selected = this.dataList.filter(a => allLables.indexOf(a.label) != -1);
      } else {
        this.selected = [];
      }
    } else {
      if (!!this.to.defaultValue) {
        this.selected = this.dataList.filter(a => a.label == this.to.defaultValue.label)[0];
      } else {
        this.selected = {};
      }
    }

  }

  change($event) {
    if (!!this.to.change) {
      this.to.change(this, $event);
    }
  }

  async getPaginationData() {
    this.portsSubscription = (await this.getPortsAsync(this.currentPage, this.itemsPerPage, '')).subscribe(ports => {
      // Subscription will be closed when unsubscribed manually.
      if (this.portsSubscription.closed) {
        return;
      }
      this.items = ports;
    });
  }

  async getMorePorts(event) {
    this.currentPage++;
    this.portsSubscription = (await this.getPortsAsync(1, this.currentPage * this.itemsPerPage, '')).subscribe(ports => {
      // Subscription will be closed when unsubscribed manually.
      if (this.portsSubscription.closed) {
        return;
      }

      this.items = ports;

      event.component.endInfiniteScroll();
    });

  }

  filterPorts(ports, text: string) {
    return ports.filter(port => {
      return port[this.text].toLowerCase().indexOf(text) != -1;
    });
  }

  async searchItem(event: { component: IonicSelectableComponent; text: string }) {
    this.currentPage = 1;
    this.search = event.text.trim().toLowerCase();
    event.component.startSearch();
    // Close any running subscription.
    if (this.portsSubscription) {
      this.portsSubscription.unsubscribe();
    }

    this.portsSubscription = (await this.getPortsAsync(this.currentPage, this.itemsPerPage, this.search, 0)).subscribe((ports: any[]) => {
      // Subscription will be closed when unsubscribed manually.
      if (this.portsSubscription.closed) {
        return;
      }
      event.component.items = ports;
      event.component.endSearch();
    });

  }

  postRequest(url, object) {
    let _httpClient = this._httpClient;
    return new Promise(function (resolve, reject) {
      _httpClient.post(url, object).subscribe(
        res => {
          resolve(res);
        },
        (err: any) => {
          reject(err.error.error.message);
        }
      );
    });
  }

  async getPorts(page?: number, size?: number, search = '') {
    let ports = [];
    let upcoming = [];
    if (search.length > this.to.minLength) {
      let returnData = {};

      Object.keys(this.to.extra).map(data => { returnData[data] = this.to.extra[data] == "$search" ? search : this.to.extra[data] })
      let requestResponse: any;
      try {
        requestResponse = await this.postRequest(this.to.url, returnData);
        this.dataList = eval(this.to.returnValue);
      } catch (e) {
        this.dataList = [];
      }

    }

    if (Object.keys(this.selected).length > 0) {
      ports.push(this.selected);
    }

    this.dataList.forEach(data => {
      if (!!this.selected && Array.isArray(this.selected) && this.selected.length > 0 && this.selected.filter(select => select[this.text].toLowerCase() == data[this.text].toLowerCase()).length > 0) {
        if (search.length > 0) {
          if (data[this.text].toLowerCase().search(search.toLowerCase()) >= 0) {
            ports.push(data);
          }
        } else {
          ports.push(data);
        }
        if (this.companyName.filter(old => old[this.text].toLowerCase() == data[this.text].toLowerCase()).length == 0) {
          this.companyName.push(data);
        }
      } else {
        if (search.length > 0) {
          if (data[this.text].toLowerCase().search(search.toLowerCase()) >= 0) {
            upcoming.push(data);
          }
        } else {
          upcoming.push(data);
        }
        this.companyName.forEach((key, value) => {
          if (key.name == data.name) {
            this.companyName.splice(value, 1)
          }
        })
      }
    });

    upcoming.forEach(country => {
      if (country.value != this.selected.value) {
        ports.push(country);
      }
    });

    if (page && size) {
      ports = ports.slice((page - 1) * size, ((page - 1) * size) + size);
    }

    return ports;
  }

  async getPortsAsync(page?: number, size?: number, search = '', timeout = 0) {
    return new Observable(observer => {
      this.getPorts(page, size, search).then(res => {
        observer.next(res);
        observer.complete();
      });
    }).pipe(delay(timeout));
  }

}

