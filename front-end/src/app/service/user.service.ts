import { Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { User } from '../models/User.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = 'http://localhost:3000/api/user';
  private token : any = this.authService.getAuthToken();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get the user method
  getUserById(userId: string): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.get<User>(url, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while retrieving the user');
      })
    );
  }

  // Edit the user method
  editUser(userId: string, updatedUser: Object): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    const user = JSON.stringify(updatedUser)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.put<User>(url, {user: user}, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while modifying the user.');
      })
    );
  }

  // Update profile picture
  updateProfilePicture(formData: FormData, userId: string): Observable<User> {
    const url = `${this.apiUrl}/${userId}/profile-picture`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.post<User>(url, formData, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while modifying the prifile picuture.');
      })
    );
  }

 // Delete user
  deleteUser(userId: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.delete(url, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while deleting the user.');
      })
    );
  }
}
