import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User.model';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl: string  = 'http://localhost:3000/api/user';
  private loggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  // Login method - email - password
  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
    .pipe(
      map(response => {
        const userId = response._id;
        const token = response.token;
        // Encrypted userId
        const encryptedUserId = CryptoJS.AES.encrypt(userId, "Secret Passphrase").toString();

        //  Set token and userId in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('encryptedUserId', encryptedUserId);
        localStorage.setItem('loggedIn', 'true');
        this.loggedIn = true;
        this.router.navigate(['/posts-index']);
        location.href = '/posts-index';
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Signup method - user contains user infos
  signUp(user: Object): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/signup`, user)
    .pipe(
      map(response => {
        const userId = response._id;
        const token = response.token;

        // Encrypted userId
        const encryptedUserId = CryptoJS.AES.encrypt(userId, "Secret Passphrase").toString();

        //  Set token and userId in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('encryptedUserId', encryptedUserId);
        localStorage.setItem('loggedIn', 'true');
        this.loggedIn = true;
        this.router.navigate(['/posts-index']);
        location.href = '/posts-index';
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Logout method
  logout() {
    this.loggedIn = false;
    localStorage.removeItem('encryptedUserId');
    localStorage.removeItem('token');
    localStorage.setItem('loggedIn', 'false');
    this.router.navigate(['/']);
    location.href = '/';
  }

  // Get the loogedIn from Local Storage
  isLoggedIn(): boolean {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn === 'true') {
      return true;
    } else {
      return false;
    }
  }

  // Get token from Local Storage
  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get the userId crypted from Local Storage
  getUserIdLs(): string | null  {
    return localStorage.getItem('encryptedUserId');
  }

  // Decrypt the userId from Local Storage
  getDecryptedUserId(): string | null {
    const encryptedUserId = localStorage.getItem('encryptedUserId');
      if (!encryptedUserId) {
      return null;
    }

    // Decrypt the userId from the local storage
    const bytes = CryptoJS.AES.decrypt(encryptedUserId, "Secret Passphrase");
    const decryptedUserId = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedUserId;
  }
}

