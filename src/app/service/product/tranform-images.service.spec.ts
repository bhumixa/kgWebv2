import { TestBed } from '@angular/core/testing';

import { TranformImagesService } from './tranform-images.service';

describe('TranformImagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TranformImagesService = TestBed.get(TranformImagesService);
    expect(service).toBeTruthy();
  });
});
