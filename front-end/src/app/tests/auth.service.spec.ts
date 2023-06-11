import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { User } from '../models/User.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login API and store authentication data on successful login', () => {
  const email = 'test@example.com';
  const password = 'password';
  const user: User = {
    _id: 'user-id',
    firstname: 'John',
    lastname: 'Doe',
    birthDate: new Date(),
    email,
    password,
    image: '',
    token: 'auth-token'
  };

  service.login(email, password).subscribe(response => {
    expect(response).toEqual(user);
    expect(service.getDecryptedUserId()).toBe('user-id');
    expect(service.isLoggedIn()).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/posts-index']);
  });

  const request = httpMock.expectOne(`${service.apiUrl}/login`);
  expect(request.request.method).toBe('POST');
  });

  it('should handle login API error', () => {
    const email = 'test@example.com';
    const password = 'password';
    const error = { error: { message: 'Invalid credentials' } };

    service.login(email, password).pipe(
      catchError((err) => {
        expect(err).toEqual(error);
        expect(service.getDecryptedUserId()).toBe(null);
        expect(service.isLoggedIn()).toBe(false);
        expect(router.navigate).not.toHaveBeenCalled();
        return throwError(() => error);
      })
    ).subscribe();

    const request = httpMock.expectOne(`${service.apiUrl}/login`);
    expect(request.request.method).toBe('POST');
  });

  it('should call signUp API and store authentication data on successful sign up', () => {
    const user: User = {
      _id: 'user-id',
      firstname: 'John',
      lastname: 'Doe',
      birthDate: new Date(),
      email: 'test@example.com',
      password: 'password',
      image: '',
      token: 'auth-token'
    };

    service.signUp(user).subscribe(response => {
      expect(response).toEqual(user);
      expect(service.getDecryptedUserId()).toBe('user-id');
      expect(service.isLoggedIn()).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/posts-index']);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/signup`);
    expect(request.request.method).toBe('POST');
  });

  it('should handle signUp API error', () => {
    const user: User = {
      _id: 'user-id',
      firstname: 'John',
      lastname: 'Doe',
      birthDate: new Date(),
      email: 'test@example.com',
      password: 'password',
      image: '',
      token: 'auth-token'
    };

    const error = { error: { message: 'Email already exists' } };

    service.signUp(user).pipe(
      catchError((err) => {
        expect(err).toEqual(error);
        expect(service.getDecryptedUserId()).toBe(null);
        expect(service.isLoggedIn()).toBe(false);
        expect(router.navigate).not.toHaveBeenCalled();
        return throwError(() => error);
      })
    ).subscribe();

    const request = httpMock.expectOne(`${service.apiUrl}/signup`);
    expect(request.request.method).toBe('POST');

  });

  it('should log out the user', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getAuthToken()).toBe(null);
    expect(service.getDecryptedUserId()).toBe(null);
  });
});
