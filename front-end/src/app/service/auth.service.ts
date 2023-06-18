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
  apiUrl: string  = 'http://localhost:3000/api/user';
  private loggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}


  /**
   * Login method.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns Observable<User> - The logged-in user.
   */
  login(email: string, password: string): Observable<User> {
    // Send a POST request to sign up the user
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        // Extract the user ID and token from the response
        const { _id, token } = response;

        // Encrypt the user ID
        const encryptedUserId = this.encryptData(_id);

        // Store the encrypted user ID and token in the local storage
        this.storeAuthData(token, encryptedUserId);

        // Set the loggedIn to true
        this.loggedIn = true;

        // Redirect to the posts-index page
        this.router.navigate(['/posts-index']);
        location.href = '/posts-index';
        return response;
      }),
      catchError(error => {
        console.log(error);
        return throwError(() => new Error('An error occurred while connecting the user'));
      })
    );
  }

  /**
   * Signup method.
   * @param user - The user object containing user info.
   * @returns Observable<User> - The signed-up user.
   */
  signUp(user: Object): Observable<User> {
    // Send a POST request to sign up the user
    return this.http.post<User>(`${this.apiUrl}/signup`, user).pipe(
      map(response => {
        // Extract the user ID and token from the response
        const { _id, token } = response;

        // Encrypt the user ID
        const encryptedUserId = this.encryptData(_id);

        // Store the encrypted user ID and token in the local storage
        this.storeAuthData(token, encryptedUserId);

        // Set the loggedIn to true
        this.loggedIn = true;
        // Redirect to the posts-index page
        this.router.navigate(['/posts-index']);
        location.href = '/posts-index';
        return response;
      }),
      catchError(error => {
        console.log(error);
        return throwError(() => new Error('An error occurred while registering the user'));
      })
    );
  }


  /**
   * Logout the user.
   * Clears authentication data, sets the `loggedIn` flag to false,
   * and redirects to the home page.
   */
  logout(): void {
    this.loggedIn = false;
    try {
        this.removeAuthData();
        // Redirect to the home page
        this.router.navigate(['/']);
        location.href = '/';
    } catch (error) {
        console.error('An error occurred while logging out:', error);
    }
  }


  /**
   * Check if the user is logged in.
   * @returns boolean - True if the user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    const isLoggedIn = localStorage.getItem('loggedIn');
    return isLoggedIn === 'true';
  }


  /**
   * Get the authentication token from Local Storage.
   * @returns string | null - The authentication token.
   */
  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }


  /**
   * Get the encrypted userId from Local Storage.
   * @returns string | null - The encrypted userId.
   */
  getUserIdLs(): string | null  {
    return localStorage.getItem('encryptedUserId');
  }


  /**
   * Decrypt the userId from Local Storage.
   * @returns string | null - The decrypted userId.
   */
  getDecryptedUserId(): string | null {
    const encryptedUserId = this.getUserIdLs();

    if (!encryptedUserId) {
      return null;
    }

    const bytes = CryptoJS.AES.decrypt(encryptedUserId, 'Secret Passphrase');
    return bytes.toString(CryptoJS.enc.Utf8);
  }


  /**
   * Encrypts the provided data using AES encryption.
   * @param data - The data to be encrypted.
   * @returns The encrypted data as a string.
   */
  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, 'Secret Passphrase').toString();
  }


  /**
   * Store authentication data in the local storage.
   * @param token - The authentication token to be stored.
   * @param encryptedUserId - The encrypted user ID to be stored.
   */
  private storeAuthData(token: string, encryptedUserId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('encryptedUserId', encryptedUserId);
    localStorage.setItem('loggedIn', 'true');
  }


  /**
   * Remove authentication data from the local storage.
   * Clears the authentication token, encrypted user ID, and sets the `loggedIn` flag to false.
   */
  private removeAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('encryptedUserId');
    localStorage.setItem('loggedIn', 'false');
  }
}

