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

  // Get the user - params userId
  getUserById(userId: string): Observable<User> {
    const httpOptions = this.getHttpOptions();

    return this.http.get<User>(`${this.apiUrl}/${userId}`, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while retrieving the user');
      })
    );
  }

  // Update the user - params userId - updatedUser contains infos updated
  editUser(userId: string, updatedUser: Object): Observable<User> {
    const user = JSON.stringify(updatedUser)
    const httpOptions = this.getHttpOptions();

    return this.http.put<User>(`${this.apiUrl}/${userId}`, {user: user}, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while modifying the user.');
      })
    );
  }

  // Update profile picture - params formData contains picture - userId
  updateProfilePicture(formData: FormData, userId: string): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.post<User>(`${this.apiUrl}/${userId}/profile-picture`, formData, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

 // Delete user - params userId
  deleteUser(userId: string): Observable<User> {
    const httpOptions = this.getHttpOptions();

    return this.http.delete<User>(`${this.apiUrl}/${userId}`, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  // Declare the httpOptions
  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }
}
