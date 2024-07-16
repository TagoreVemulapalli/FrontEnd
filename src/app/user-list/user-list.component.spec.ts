import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../user.service';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { User } from '../models/user';
import { MatDialog } from '@angular/material/dialog';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    
    await TestBed.configureTestingModule({
      declarations: [ UserListComponent ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
      ]
    })
    .compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', () => {
    const users: User[] = [
      { user_id: 1, user_name: 'user1', first_name: 'First', last_name: 'User', email: 'user1@example.com', user_status: 'Active', department: 'IT' },
      { user_id: 2, user_name: 'user2', first_name: 'Second', last_name: 'User', email: 'user2@example.com', user_status: 'Inactive', department: 'HR' }
    ];
    userService.getUsers.and.returnValue(of(users));

    component.ngOnInit();

    expect(component.users).toEqual(users);
    expect(component.dataSource.data).toEqual(users);
  });

  it('should handle empty user list on init', () => {
    const emptyUsers: User[] = [];
    userService.getUsers.and.returnValue(of(emptyUsers));

    component.ngOnInit();

    expect(component.users).toEqual(emptyUsers);
    expect(component.dataSource.data).toEqual(emptyUsers);
  });

  it('should handle error when fetching users', () => {
    const errorMessage = 'Error fetching users';
    userService.getUsers.and.throwError(errorMessage);

    component.ngOnInit();

    expect(component.users).toEqual([]);
    expect(component.dataSource.data).toEqual([]);
    expect(component.dataSource.filteredData).toEqual([]);
    expect(component.dataSource.paginator).toBeFalsy();
    expect(component.dataSource.sort).toBeFalsy();
  });

});
