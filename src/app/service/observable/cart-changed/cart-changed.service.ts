import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { skip, takeWhile } from 'rxjs/operators';
import { CompanyService } from '../../company/company.service';

@Injectable({
  providedIn: 'root'
})
export class CartChangedService {

  constructor(
    public _companyService: CompanyService
  ) { }

  public observables: any = new BehaviorSubject({});
  observable(pageName = '/'): Observable<any> {
    return this.observables.asObservable().pipe(skip(1)).pipe(takeWhile(value => pageName == this._companyService.currentPage));
  }

}

