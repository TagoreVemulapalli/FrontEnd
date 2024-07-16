import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { UserDeleteDialogComponent } from './user-delete/user-delete-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private dialog: MatDialog) {}
  openUpdateDialog(): void {
    const dialogRef = this.dialog.open(UserUpdateComponent, {
      width: '400px',
      data: { userId: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.userId) {
        console.log('User ID to update:', result.userId);
      }
    });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(UserDeleteDialogComponent, {
      width: '400px',
      data: { userId: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.userId) {
        console.log('User ID to delete:', result.userId);
      }
    });
  }
}
