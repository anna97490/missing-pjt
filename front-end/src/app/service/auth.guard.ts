import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Method that determines if the user can activate the route.
   * @returns boolean - True if the user can activate the route, otherwise False.
   */
  canActivate(): boolean {
    if (this.authService.getDecryptedUserId()) {
      return true;
    } else {
      // Redirect to the login page if the user is not connected or registered
      this.router.navigate(['/']);
      return false;
    }
  }
}
