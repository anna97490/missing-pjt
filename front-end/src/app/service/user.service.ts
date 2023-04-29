import { Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { User } from '../models/User.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = 'http://localhost:3000/api/user';
  private token : any = localStorage.getItem('token');

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /*** Get the user method * @param {string} userId - user email * @return {string|error} - Sucessful insertion or Error*/
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

  /*** Edit the user method
  * @param {string} userId - user id
  * @param {object} updatedUser - datas updated
  * @return {string|error} - Sucessful insertion or Error
  */
  editUser(userId: string, updatedUser: Object): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    const user = JSON.stringify(updatedUser)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.authService.getAuthToken() })
    };

    return this.http.put<User>(url, {user: user}, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while modifying the user.');
      })
    );
  }

 /*** Delete the user method * @param {string} userId - user id * @return {string|error} - Sucessful insertion or Error*/
  deleteUser(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.authService.getAuthToken() })
    };

    return this.http.delete(url, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while deleting the user.');
      })
    );
  }
}
