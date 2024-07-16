import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserDeleteComponent } from './user-delete.component';
import { UserService } from '../user.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('UserDeleteComponent', () => {
  let component: UserDeleteComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['deleteUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [UserDeleteComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
      ],
    });

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component = TestBed.createComponent(UserDeleteComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete user', () => {
    const userId = 1;

    userServiceSpy.deleteUser.and.returnValue(of(undefined));

    component.userId = userId;
    component.onDelete();

    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(userId);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
  });

});
