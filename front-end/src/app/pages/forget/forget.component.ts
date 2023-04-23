import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
  forgetForm: FormGroup;
  isSuccess: boolean = false;
  isFailure: boolean = false;
  right : string = '';
  errorMessage : string ='';

  constructor(
    private authService: AuthService,
    private router: Router,
    private title: Title,
    private fb: FormBuilder
  ) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern(/^\w+([\.-]?\w+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(com|fr)$/i)]]
    });
  }

  ngOnInit(): void {
    this.title.setTitle('Forgot Password - My App');
  }

  onSubmit(): void {
    if (this.forgetForm.valid) {
      this.authService.resetPassword(this.forgetForm.value.email).subscribe(
        () => {
          this.isSuccess = true;
          this.isFailure = false;
        },
        (error) => {
          this.isSuccess = true;
          this.isFailure = false;
          if (error.status === 404) {
            this.errorMessage = "Votre adresse mail est incorrecte.";
          }
        }
      );
    } else {
      this.isSuccess = false;

      this.isFailure = true;
    }
  }
  
   
}
