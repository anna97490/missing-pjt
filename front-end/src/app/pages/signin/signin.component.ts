import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  signinForm: any = FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder,private authService: AuthService, private router: Router) {
    this.signinForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[a-zA-Z]+$/)]],
      lastname : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[a-zA-Z]+$/)]],
      email    : ['', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,3}$/i)]],
      password : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    });
  }

  /**
   * Signup method
   * @param event - The form submission event.
   */
  signUp(event: Event) {
    event.preventDefault();

    // Get the values of the form
    const user = {
      firstname: this.signinForm.get('firstname').value,
      lastname : this.signinForm.get('lastname').value,
      email    : this.signinForm.get('email').value,
      password : this.signinForm.get('password').value
    }

    if (this.signinForm.valid) {
      this.authService.signUp(user, this.errorMessage)
      .subscribe(
        {
          next: response => {
            // Redirect to posts-index page
            this.router.navigate(['/posts-index']);
          },
          error: error => {
            if (error.message === 'Cet email existe déjà.') {
              this.errorMessage = error.message;
            }
            else {
              console.log(error.error.message);
            }
          }
        }
      );
    }
  }
}
