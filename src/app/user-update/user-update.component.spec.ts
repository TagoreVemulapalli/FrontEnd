import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserUpdateComponent } from './user-update.component';
import { UserService } from '../user.service';
import { of } from 'rxjs';
import { User } from '../models/user';
import { MatDialog } from '@angular/material/dialog';

describe('UserUpdateComponent', () => {
  let component: UserUpdateComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(() => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['getUserById', 'updateUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpyObj = {
      snapshot: { params: { id: '1' } }
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [UserUpdateComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteSpyObj }
      ],
    });

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    component = TestBed.createComponent(UserUpdateComponent).componentInstance;
  });

  it('should fetch user details by ID', () => {
    const userId = 1;
    const user: User = {
      user_id: userId,
      user_name: 'testUser',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      user_status: 'Active',
      department: 'IT'
    };

    userServiceSpy.getUserById.and.returnValue(of(user));

    component.ngOnInit();
    expect(userServiceSpy.getUserById).toHaveBeenCalledWith(userId);
    expect(component.userForm.value).toEqual(user);
    expect(component.userNotFound).toBeFalse();
  });

  it('should handle user not found', () => {
    const userId = 99;

    userServiceSpy.getUserById.and.returnValue(of(null));

    component.fetchUserDetailsById(userId);

    expect(component.userNotFound).toBeTrue();
  });

  it('should update user', () => {
    const userId = 1;
    const updatedUser: User = {
      user_id: userId,
      user_name: 'updatedUser',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      user_status: 'Inactive',
      department: 'HR'
    };

    userServiceSpy.updateUser.and.returnValue(of(updatedUser));

    component.userForm.patchValue(updatedUser);
    component.updateUser();

    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(userId, updatedUser);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should handle update user with null response', () => {
    const userId = 1;

    userServiceSpy.updateUser.and.returnValue(of(null));

    component.userForm.patchValue({
      user_id: userId,

    });

    component.updateUser();

    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(userId, component.userForm.value);
  });

});
