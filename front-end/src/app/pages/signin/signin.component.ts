import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      birthDate: ['', [Validators.required, this.minimumAgeValidator(18)]],
    });
  }

  minimumAgeValidator(minimumAge: number) {
    return (control: AbstractControl) => {
      if (control.value) {
        const today = new Date();
        const birthDate = new Date(control.value);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < minimumAge) {
          return { minimumAge: true };
        }
      }
      return null;
    };
  }

  signUp(event: Event) {
    event.preventDefault();

    const user = {
      firstname: this.signinForm.get('firstname').value,
      lastname : this.signinForm.get('lastname').value,
      email    : this.signinForm.get('email').value,
      birthDate: this.signinForm.get('birthDate').value,
      password : this.signinForm.get('password').value
    }

    if (this.signinForm.valid) {
      this.authService.signUp(user).subscribe(response => {
        this.router.navigate(['/posts-index']);
      })
    } else {
      this.signinForm.markAllAsTouched();
      this.isErrorEmail = this.signinForm.get('email').value === '';
      this.isErrorDate = this.signinForm.get('birthDate').value === '';
      this.isErrorPassword = this.signinForm.get('password').value === '';
    }
  }
}
