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
  isCorrectEmail: boolean = false;
  isCorrectPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });
  }

  login(event: Event) {
    event.preventDefault();
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    if (email && password && this.loginForm.valid) {
      this.authService.login(email, password)
      .subscribe(
        response => {
          this.router.navigate(['/posts-index']);
        },
        error => {
          if (error.error.message === 'Incorrect email') {
            this.isCorrectEmail = true;
            this.isCorrectPassword = false;
          } else if (error.error.message === 'Incorrect password') {
            this.isCorrectEmail = false;
            this.isCorrectPassword = true;
          } else {
            console.log(error.error.message);
          }
        }
      );
    }
  }
}
