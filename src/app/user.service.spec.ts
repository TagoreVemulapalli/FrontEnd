import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from './models/user';
import { MatDialog } from '@angular/material/dialog';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle null response from getUserById', () => {
    const userId = 1;

    service.getUserById(userId).subscribe((user: User | null) => {
      expect(user).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/users/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });

});
