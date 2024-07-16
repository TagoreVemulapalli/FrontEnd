import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  userForm!: FormGroup;
  usernameExistsError: boolean = false;

  user: User = {
    user_name: '',
    first_name: '',
    last_name: '',
    email: '',
    user_status: '',
    department: '',
    user_id: 0,
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void  {
    this.userForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
      ]],
      user_status: ['', Validators.required],
      department: ['']
    });
  }

  createUser(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    const username = this.userForm.value.user_name;

    this.userService.checkUsernameExists(username).subscribe(exists => {
      if (exists) {
        this.usernameExistsError = true;
        alert('UserName already Exists!');
      } else {
        const userData = {
          user_name: this.userForm.value.user_name,
          first_name: this.userForm.value.first_name,
          last_name: this.userForm.value.last_name,
          email: this.userForm.value.email,
          user_status: this.userForm.value.user_status,
          department: this.userForm.value.department
        };

        this.userService.createUser(userData).subscribe(() => {
          alert('User created successfully!');
          this.router.navigate(['/users']);
        });
      }
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
