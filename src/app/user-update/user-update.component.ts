import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user';


@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  userForm!: FormGroup;
  usernameExistsError: boolean = false;
  userNotFound: boolean = false;
  userDetailsFetched: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      user_id: ['', Validators.required],
      user_name: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      user_status: ['', Validators.required],
      department: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = +params['id'];
      if (userId) {
        this.fetchUserDetailsById(userId);
      }
    });
  }

  fetchUserDetails(): void {
    const userId = this.userForm.get('user_id')?.value;
    if (userId) {
      this.fetchUserDetailsById(userId);
      this.userNotFound = false;
    } else {
      this.userNotFound = true;
      
    }
  }

  fetchUserDetailsById(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      user => {
        if (user) {
          console.log('Fetched User:', user);
          this.userForm.patchValue({
            user_name: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            user_status: user.user_status,
            department: user.department
          });
          this.userDetailsFetched = true;
          this.userNotFound = false;
        } else {
          this.userNotFound = true;
          alert('User Id Doesnot Exist!');
        }
      },
      error => {
        alert('User Doesnot Exist!');
        console.error('Error fetching user:', error);
        this.userNotFound = true;
      }
    );
  }

  updateUser(): void {
    
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    const userData: User = {
      user_id: this.userForm.value.user_id,
      user_name: this.userForm.value.user_name,
      first_name: this.userForm.value.first_name,
      last_name: this.userForm.value.last_name,
      email: this.userForm.value.email,
      user_status: this.userForm.value.user_status,
      department: this.userForm.value.department
    };



    if(this.userNotFound == true){
      alert('User Id Doesnot Exist!');
    }
    this.userService.updateUser(this.userForm.value.user_id, userData).subscribe(() => {
      if(this.userNotFound == false)
      alert('User updated successfully!');
      this.router.navigate(['/users']);
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: FormGroup<any>) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
