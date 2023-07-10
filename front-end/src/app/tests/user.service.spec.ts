import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { User } from '../models/User.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService, AuthService],  // Injectez le service AuthService
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);  // Injectez le service AuthService
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a user by ID', () => {
    const userId = '1';
    const mockUser: User = new User('1', 'John', 'Doe', 'john@doe.com', 'password', 'token123', 'admin');

    service.getUserById(userId).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should edit a user', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const userId = '1';
    const mockUpdatedUser: User = new User('1', 'John', 'Doe', 'john@doe.com', 'newpassword', 'token123', 'admin');

    service.editUser(userId, mockUpdatedUser).subscribe(user => {
      expect(user).toEqual(mockUpdatedUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/user/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ user: JSON.stringify(mockUpdatedUser) });
    req.flush(mockUpdatedUser);
  });

  it('should delete a user', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const userId = '1';

    service.deleteUser(userId).subscribe(user => {
      expect(user).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/user/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
