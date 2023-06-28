import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email   : ['', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,3}$/i)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    });
  }


  /**
   * Method triggered when the login form is submitted.
   * @param event - The form submission event.
   */
  login(event: Event) {
    event.preventDefault();
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    // Check if email and password are valid
    if (email && password && this.loginForm.valid) {
      // Call the authService
      this.authService.login(email, password)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/posts-index']);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}
