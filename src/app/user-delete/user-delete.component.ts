import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent {
  userId!: number;
  userNotFound: boolean = false;
  deletionSuccess: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  onDelete(): void {
    if (!this.userId || isNaN(this.userId) || this.userId < 1) {
      this.userNotFound = false; 
      alert('Please Enter Valid User Id!')
      return;
    }

    this.userService.checkUserIdExists(this.userId).subscribe(
      exists => {
        if (exists) {
          if (confirm('Are you sure you want to delete this user?')) {
            this.userService.deleteUser(this.userId).subscribe(() => {
              console.log(`User with ID ${this.userId} deleted.`);
              this.deletionSuccess = true;
              alert('User deleted successfully!');
              this.router.navigate(['/users']);
            }, error => {
              console.error('Error deleting user:', error);
              alert('Error deleting User!');
            });
          }
        } else {
          alert('User Id Doesnot Exists!');
          this.userNotFound = true;
          this.deletionSuccess = false;
        }
      },
      error => {
        alert('Error checking user ID!');
        console.error('Error checking user ID:', error);
        this.userNotFound = true;
        this.deletionSuccess = false;
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
