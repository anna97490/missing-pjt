import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { User } from '../models/User.model';

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

  it('should authenticate the user and store authentication datas on successful login', () => {
  const email = 'john@edoe.com';
  const password = 'password';

  service.login(email, password).subscribe(response => {
    expect(service.getDecryptedUserId()).toBe('user-id');
    expect(service.isLoggedIn()).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/posts-index']);
  });

  const request = httpMock.expectOne(`${service.apiUrl}/login`);
  expect(request.request.method).toBe('POST');
  });

  it('should sign up the user and store authentication datas on successful sign up', () => {
    const user: User = {
      _id: 'user-id',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      password: 'password',
      token: 'auth-token',
      status: 'admin'
    };

    const message = 'error'

    service.signUp(user, message).subscribe(response => {
      expect(response).toEqual(user);
      expect(service.getDecryptedUserId()).toBe('user-id');
      expect(service.isLoggedIn()).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/posts-index']);
    });

    const request = httpMock.expectOne(`${service.apiUrl}/signup`);
    expect(request.request.method).toBe('POST');
  });

  it('should log out the user', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getAuthToken()).toBe(null);
    expect(service.getDecryptedUserId()).toBe(null);
  });
});
