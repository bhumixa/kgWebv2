import { TestBed } from '@angular/core/testing';

import { NgxFormService } from './ngx-form.service';

describe('NgxFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxFormService = TestBed.get(NgxFormService);
    expect(service).toBeTruthy();
  });
});
