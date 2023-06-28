import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from '../service/user.service';
import { User } from '../models/User.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a user by ID', () => {
    const userId = '1';
    const mockUser: User = new User('1', 'John', 'Doe', 'john@example.com', 'password', 'token123', 'admin');

    service.getUserById(userId)

  });

  it('should edit a user', () => {
    const userId = '1';
    const mockUpdatedUser: User = new User('1', 'John', 'Doe', 'john@example.com', 'newpassword', 'token123', 'admin');

    service.editUser(userId, mockUpdatedUser);
  });

  it('should delete a user', () => {
    const userId = '1';

    service.deleteUser(userId);
  });
});
