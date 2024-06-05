import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RazorkeyService {

  public razorloaded: boolean = false;

  constructor() { }

  loadScript(url = 'https://checkout.razorpay.com/v1/checkout.js') {
    if (!this.razorloaded) {
      this.razorloaded = true;
      // console.log('preparing to load...')
      let node = document.createElement('script');
      node.src = url;
      node.type = 'text/javascript';
      node.async = true;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    }

  }

}
