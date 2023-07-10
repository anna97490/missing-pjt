import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../service/auth.service';
import { of, throwError } from 'rxjs';
import { User } from '../../models/User.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create the LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login', () => {
    const email = 'test@example.com';
    const password = 'password';

    spyOn(authService, 'login').and.returnValue(of({} as User));

    component.loginForm.patchValue({ email, password });
    component.login(new Event('click'));

    expect(authService.login).toHaveBeenCalledWith(email, password);
    expect(router.navigate).toHaveBeenCalledWith(['/posts-index']);
  });

  it('should log the error message when receiving an error', () => {
    const email = 'john@doe.com';
    const password = 'password';
    const error = { error: { message: 'Unknown error' } };

    spyOn(authService, 'login').and.returnValue(throwError(() => error));
    spyOn(console, 'log');

    component.loginForm.patchValue({ email, password });
    component.login(new Event('click'));
  });
});
