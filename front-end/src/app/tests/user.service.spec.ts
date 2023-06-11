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
      providers: [UserService]
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
    const mockUser: User = new User('1', 'John', 'Doe', new Date(), 'john@example.com', 'password', 'profile.jpg', 'token123');

    service.getUserById(userId).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should edit a user', () => {
    const userId = '1';
    const mockUpdatedUser: User = new User('1', 'John', 'Doe', new Date(), 'john@example.com', 'newpassword', 'profile.jpg', 'token123');

    service.editUser(userId, mockUpdatedUser).subscribe(user => {
      expect(user).toEqual(mockUpdatedUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/user/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ user: JSON.stringify(mockUpdatedUser) });
    req.flush(mockUpdatedUser);
  });

  it('should update the profile picture of a user', () => {
    const userId = '1';
    const mockFormData = new FormData();
    mockFormData.append('picture', new File(['image'], 'profile.jpg'));

    const mockUpdatedUser: User = new User('1', 'John', 'Doe', new Date(), 'john@example.com', 'password', 'updated-profile.jpg', 'token123');

    service.updateProfilePicture(mockFormData, userId).subscribe(user => {
      expect(user).toEqual(mockUpdatedUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/user/${userId}/profile-picture`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFormData);
    req.flush(mockUpdatedUser);
  });

  it('should delete a user', () => {
    const userId = '1';

    service.deleteUser(userId).subscribe(user => {
      expect(user).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/user/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
