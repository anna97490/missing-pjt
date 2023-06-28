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


  /**
   * Get the user by userId
   * @param userId The ID of the user
   * @returns An observable that emits the user
   */
  getUserById(userId: string): Observable<User> {
    // Get the HTTP options for the request
    const httpOptions = this.getHttpOptions();

    // Check if the userId is invalid
    if (!userId) {
      return throwError(() => new Error('Invalid userId'));
    }

    // // Check if the user is not authenticated
    // if (!this.authService.isLoggedIn()) {
    //   return throwError(() => new Error('User not authenticated'));
    // }

    // Send a GET request to retrieve the user
    return this.http.get<User>(`${this.apiUrl}/${userId}`, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error('An error occurred while getting the user'));
      })
    );
  }


  /**
   * Update the user with new datas
   * @param userId The ID of the user to update
   * @param updatedUser The updated user datas
   * @returns An observable that emits the updated user
   */
  editUser(userId: string, updatedUser: Object): Observable<User> {
    // Convert the updatedUser object to JSON string
    const user = JSON.stringify(updatedUser);

    // Get the HTTP options for the request
    const httpOptions = this.getHttpOptions();

    // Check if the userId is invalid
    if (!userId) {
      return throwError(() => new Error('Invalid userId'));
    }

    // Check if the user is not authenticated
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Send a PUT request to update the user
    return this.http.put<User>(`${this.apiUrl}/${userId}`, {user: user}, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error('An error occurred while modifying the user'));
      })
    );
  }


  /**
   * Delete the user by userId
   * @param userId The ID of the user to delete
   * @returns An observable that emits the deleted user
   */
  deleteUser(userId: string): Observable<User> {
    // Get the HTTP options for the request
    const httpOptions = this.getHttpOptions();

    // Check if the userId is invalid
    if (!userId) {
      return throwError(() => new Error('Invalid userId'));
    }

    // Check if the user is not authenticated
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Send a DELETE request to delete the user
    return this.http.delete<User>(`${this.apiUrl}/${userId}`, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error('An error occurred while deleting the user'));
      })
    );
  }


  /**
   * Get the HTTP options with authorization header
   * @returns HTTP options with authorization header
   */
  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }
}
