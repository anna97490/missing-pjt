import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm  : any = FormGroup;
  isErrorEmail: boolean = false;
  isErrorDate : boolean = false;
  isErrorPassword : boolean= false;
  isLengthValid: boolean = false;
  hasUppercase: boolean = false;
  hasLowercase: boolean = false;
  hasNumber: boolean = false;
  isValid : boolean = false;
  showPasswordInfo : boolean = false;


  constructor(private formBuilder: FormBuilder,private authService: AuthService, private router: Router) {
    this.signinForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      lastname : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      email    : ['', [Validators.required, Validators.email,Validators.pattern(/^\w+([\.-]?\w+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(com|fr)$/i)]],
      password : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(18)]],
      birthDate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

  }

  checkPasswordValidity(): void {
    const password = this.signinForm.get('password').value;

    // Check length (between 8 and 18 characters)
    this.isLengthValid = password.length >= 8 && password.length <= 18;
    const lengthInfo = document.getElementById('length-info');
    if (lengthInfo) {
      lengthInfo.innerHTML = 'Entre 8 et 18 caractères ' + (this.isLengthValid ? '<i class="fa-solid fa-check" style="color: #1eff00;"></i>' : '<i class="fa-solid fa-xmark" style="color: #ff0000;"></i>');
      lengthInfo.classList.remove('text-green-500', 'text-red-500');
      lengthInfo.classList.add(this.isLengthValid ? 'text-green-500' : 'text-red-500');
    }



    // Check for uppercase letter
    this.hasUppercase = /[A-Z]/.test(password);
    const uppercaseInfo = document.getElementById('uppercase-info');
    if (uppercaseInfo) {
      uppercaseInfo.innerHTML = 'Au moins une majuscule ' + (this.hasUppercase ? '<i class="fa-solid fa-check" style="color: #1eff00;"></i>' : '<i class="fa-solid fa-xmark" style="color: #ff0000;"></i>');
      uppercaseInfo.classList.remove('text-green-500', 'text-red-500');
      uppercaseInfo.classList.add(this.hasUppercase ? 'text-green-500' : 'text-red-500');
    }

    // Check for number
    this.hasNumber = /[0-9]/.test(password);
    const numberInfo = document.getElementById('number-info');
    if (numberInfo) {
      numberInfo.innerHTML = 'Au moins 1 chiffre ' + (this.hasNumber ? '<i class="fa-solid fa-check" style="color: #1eff00;"></i>' : '<i class="fa-solid fa-xmark" style="color: #ff0000;"></i>');
      numberInfo.classList.remove('text-green-500', 'text-red-500');
      numberInfo.classList.add(this.hasNumber ? 'text-green-500' : 'text-red-500');
    }

    // Check if password is valid
    this.isValid = this.isLengthValid && this.hasUppercase && this.hasLowercase && this.hasNumber;
  }



  preventDefault(event: Event) {
    event.preventDefault();
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
      password: this.signinForm.get('password').value }

    if (this.signinForm.valid) {
      this.authService.signin(body).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/index']);
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
