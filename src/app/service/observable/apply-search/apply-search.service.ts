import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApplySearchService {

  constructor() { }

  public observables: any = new BehaviorSubject({});
  public searchCriteria: any = new BehaviorSubject(false);
  observable(): Observable<any> {
    return this.observables.asObservable().pipe(skip(1));
  }

}

