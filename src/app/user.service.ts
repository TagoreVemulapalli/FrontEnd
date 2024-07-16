import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from './models/user';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  getUserById(userId: number): Observable<User | null> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<User>(url).pipe(
      catchError(error => {
        console.error('Error fetching user:', error);
        return of(null);
      })
    );
  }

  private apiUrl = `http://localhost:8080/api/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  getUser(id: number): Observable<User> {
    const url = `${this.apiUrl}`;
    return this.http.get<User>(url);
  }

  fetchUserDetails(id: number): Observable<User> {
    const url = `${this.apiUrl}`;
    return this.http.get<User>(url);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  checkUsernameExists(userName: string): Observable<boolean> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users: User[]) => users.some(user => user.user_name === userName))
    );
  }

  
  checkUserIdExists(userId: number): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}`).pipe(
      map((users: User[]) => users.some(user => user.user_id === userId))
    );
  }

  updateUser(userId: number, updatedUser: User): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put(url, updatedUser);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
