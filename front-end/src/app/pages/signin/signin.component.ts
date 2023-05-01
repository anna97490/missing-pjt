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
  signinForm     : any = FormGroup;
  isErrorEmail   : boolean = false;
  isErrorDate    : boolean = false;
  isErrorPassword: boolean= false;

  constructor(private formBuilder: FormBuilder,private authService: AuthService, private router: Router) {
    this.signinForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      lastname : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      email    : ['', [Validators.required, Validators.email,Validators.pattern(/^\w+([\.-]?\w+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(com|fr)$/i)]],
      password : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(18)]],
      birthDate: ['', [Validators.required]],
    });
  }

  signin(event: Event) {
    event.preventDefault();
    const birthDate = this.signinForm.get('birthDate').value;
    const ageLimit = new Date();
    ageLimit.setFullYear(ageLimit.getFullYear() - 18);

    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
    }

    if (new Date(birthDate) > ageLimit) {
      this.isErrorDate = true;
    }

    const body = {
      firstname: this.signinForm.get('firstname').value,
      lastname : this.signinForm.get('lastname').value,
      email    : this.signinForm.get('email').value,
      birthDate: this.signinForm.get('birthDate').value,
      password : this.signinForm.get('password').value }

    if (this.signinForm.valid) {
      this.authService.signin(body).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/posts-index']);
        },
        error: (error) => {
          console.error(error);
          if (error.status === 409) {
            this.isErrorEmail = true;
          }
        }
      })
    } else {
      this.isErrorEmail = this.signinForm.get('email').value === '';
      this.isErrorDate = this.signinForm.get('birthDate').value === '';
      this.isErrorPassword = this.signinForm.get('password').value === '';
    }
  }
}
