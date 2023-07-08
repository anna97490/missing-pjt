import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SigninComponent } from './signin.component';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { User } from '../../models/User.model';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SigninComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call authService.signUp and navigate on successful sign up', () => {
    const user = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      password: 'password'
    };

    const message = '';

    spyOn(authService, 'signUp').and.returnValue(of({} as User));

    component.signinForm.patchValue(user);
    component.signUp(new Event('click'));

    expect(authService.signUp).toHaveBeenCalledWith(user, message);
    expect(router.navigate).toHaveBeenCalledWith(['/posts-index']);
  });

  it('should set errorMessage when receiving Email already registered error', () => {
    const user = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      password: 'password'
    };

    const errorMessage = 'Cet email existe déjà.';
    const error = { message: 'Cet email existe déjà.' };

    spyOn(authService, 'signUp').and.returnValue(throwError(() => error));

    component.signinForm.patchValue(user);
    component.signUp(new Event('click'));

    expect(component.errorMessage).toBe(errorMessage);
  });
});
