import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { UserCreateComponent } from './user-create.component';
import { UserService } from '../user.service';
import { User } from '../models/user';

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['checkUsernameExists', 'createUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [UserCreateComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
        FormBuilder,
      ],
    });

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component = TestBed.createComponent(UserCreateComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a user', () => {
    const userData: User = {
      user_name: 'testUser',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      user_status: 'Active',
      department: 'IT'
    };

    userServiceSpy.checkUsernameExists.and.returnValue(of(false));
    userServiceSpy.createUser.and.returnValue(of(userData));

    component.userForm.patchValue(userData);
    component.createUser();

    expect(userServiceSpy.createUser).toHaveBeenCalledWith(userData);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should handle username exists error', () => {
    const userData: User = {
      user_name: 'existingUser',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      user_status: 'Active',
      department: 'HR'
    };

    userServiceSpy.checkUsernameExists.and.returnValue(of(true));

    component.userForm.patchValue(userData);
    component.createUser();

    expect(component.usernameExistsError).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
