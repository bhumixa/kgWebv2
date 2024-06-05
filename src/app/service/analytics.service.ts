import { Injectable } from '@angular/core';
import mixpanel from 'mixpanel-browser';
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor() {}

  identify(number) {
    mixpanel.identify(number);
  }

  setUserProfile(userData) {
    mixpanel.people.set(userData);
  }

  addEvents(eventType: string, data: any) {
    return new Promise((resolve, reject) => {
      mixpanel.track(eventType, data, (err: any) => {
        if (!!err) reject(err);
        resolve(`${eventType} event tracked successfully`);
      });
    });
  }

  logout(number) {
    mixpanel.reset(true);
  }
}
