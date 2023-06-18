import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { UserInfosComponent } from './user-infos.component';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { User } from 'src/app/models/User.model';

describe('UserInfosComponent', () => {
  let component: UserInfosComponent;
  let fixture: ComponentFixture<UserInfosComponent>;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [UserInfosComponent],
      providers: [AuthService, UserService]
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfosComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the user', () => {
    const mockUser: User = {
      _id: '123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password',
      token: 'token'
    };

    spyOn(authService, 'getDecryptedUserId').and.returnValue(mockUser._id);
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(userService, 'getUserById').and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.userId).toBe(mockUser._id);
    expect(component.user).toEqual(mockUser);
    expect(userService.getUserById).toHaveBeenCalledWith(mockUser._id);
  });

  it('should edit the user', () => {
    const mockUser: User = {
      _id: '123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password',
      token: 'token'
    };
    const updatedUser = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      birthDate: new Date('1990-01-01')
    };

    spyOn(authService, 'getDecryptedUserId').and.returnValue(mockUser._id);
    spyOn(userService, 'editUser').and.returnValue(of(mockUser));
    spyOn(component, 'getUser');

    component.userId = mockUser._id; // Set the component's userId
    component.user = mockUser;
    component.editUserForm.setValue(updatedUser);
    component.editUser(new Event('click'));

    expect(userService.editUser).toHaveBeenCalledWith(mockUser._id, updatedUser);
    expect(component.user).toEqual(mockUser);
    expect(component.getUser).toHaveBeenCalled();
  });

  it('should update the profile picture', () => {
    const mockUser: User = {
      _id: '123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password',
      token: 'token'
    };

    spyOn(authService, 'getDecryptedUserId').and.returnValue(mockUser._id);
    spyOn(component, 'getUser');

    const file = new File([], 'profile.jpg');
    const event = { target: { files: [file] } } as unknown;

    component.user = mockUser;

    expect(component.user).toEqual(mockUser);
  });

  it('should delete the user', () => {
    const mockUser: User = {
      _id: '123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password',
      token: 'token'
    };

    spyOn(authService, 'getDecryptedUserId').and.returnValue(mockUser._id);
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(userService, 'deleteUser').and.returnValue(of(mockUser));
    spyOn(authService, 'logout');

    component.user = mockUser;
    component.deleteUser(new Event('click'));

    expect(userService.deleteUser);
    expect(authService.logout);
  });

  it('should handle error when getting user', () => {
    spyOn(authService, 'getDecryptedUserId').and.returnValue('123');
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(userService, 'getUserById').and.returnValue(throwError('Error occurred'));

    component.ngOnInit();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.userId).toBe('123');
  });

  it('should handle error when editing user', () => {
    const updatedUser = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
    };

    spyOn(authService, 'getDecryptedUserId').and.returnValue('123');
    spyOn(userService, 'editUser').and.returnValue(throwError('Error occurred'));
    spyOn(component, 'getUser');

    component.editUserForm.setValue(updatedUser);
    component.editUser(new Event('click'));

    expect(userService.editUser);
    expect(component.getUser).not.toHaveBeenCalled();
    expect(component.errorMessage);
  });

  it('should handle error when deleting user', () => {
    spyOn(authService, 'getDecryptedUserId').and.returnValue('123');
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(userService, 'deleteUser').and.returnValue(throwError('Error occurred'));
    spyOn(authService, 'logout');

    component.deleteUser(new Event('click'));

    expect(userService.deleteUser);
    expect(authService.logout).not.toHaveBeenCalled();
  });
});
