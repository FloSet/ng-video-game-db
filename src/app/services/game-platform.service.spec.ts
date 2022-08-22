import { TestBed } from '@angular/core/testing';

import { GamePlatformService } from './game-platform.service';

describe('GamePlatformService', () => {
  let service: GamePlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamePlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
