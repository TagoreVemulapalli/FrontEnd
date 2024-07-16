import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['user_id', 'user_name', 'first_name', 'last_name', 'email', 'user_status', 'department'];
  dataSource: MatTableDataSource<User>;
  userId: number | undefined; 
  editedUser: User = {
    user_id: 0, user_name: '', first_name: '', last_name: '',
    email: '',
    user_status: '',
    department: '',
  };

  constructor(private userService: UserService) {
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.dataSource.data = users;
    });
  }
}
