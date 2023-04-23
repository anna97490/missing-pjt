import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User.model';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl  : string  = 'http://localhost:3000/api/user';
  private loggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  resetPassword(email: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { email });
  }


  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('token', response.token);
          localStorage.setItem('loggedIn', 'true');
          this.loggedIn = true;
          return response;
        })
      );
  }

  signin(data: Object): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http.post<User>(`${this.apiUrl}/signup`, data, httpOptions)
      .pipe(
        map(response => {
          localStorage.setItem('userId', response._id);
          localStorage.setItem('loggedIn', 'true');
          this.loggedIn = true;
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    this.loggedIn = false;
    this.router.navigate(['/index']);
    window.location.reload();
  }

  isLoggedIn(): boolean {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn === 'true') {
      return true;
    } else {
      // this.router.navigate(['/index']);
      return false;
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
