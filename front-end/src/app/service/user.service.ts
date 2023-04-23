import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { User } from '../models/User.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{
  private apiUrl: string = 'http://localhost:3000/api/user';
  token         : any = localStorage.getItem('token');

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {

  }

  getUserIdLS() {
    return localStorage.getItem('userId');
  }

  getUserById(userId: string): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    const token = this.authService.getAuthToken();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + token })
    };

    return this.http.get<User>(url, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Une erreur est survenue lors de la récupération de l\'utilisateur');
      })
    );
  }

  // Edit user
  editUser(userId: string, updatedUser: Object): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    console.log(updatedUser)
    const user = JSON.stringify(updatedUser)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.authService.getAuthToken() })
    };
    return this.http.put<User>(url, {user: user}, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Une erreur est survenue lors de la modification de l\'utilisateur');
      })
    );
  }

  // Delete the user
  deleteUser(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.authService.getAuthToken() })
    };
    return this.http.delete(url, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Une erreur est survenue lors de la suppression de l\'utilisateur');
      })
    );
  }
}
