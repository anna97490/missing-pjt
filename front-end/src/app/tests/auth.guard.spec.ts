import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from '../service/auth.guard';
import { AuthService } from '../service/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: {
            getDecryptedUserId: jasmine.createSpy('getDecryptedUserId')
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if authenticated', () => {
    (authService.getDecryptedUserId as jasmine.Spy).and.returnValue('user-id');

    const canActivate = guard.canActivate();

    expect(canActivate).toBe(true);
    expect(authService.getDecryptedUserId).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to home page if not authenticated', () => {
    (authService.getDecryptedUserId as jasmine.Spy).and.returnValue(null);

    const canActivate = guard.canActivate();

    expect(canActivate).toBe(false);
    expect(authService.getDecryptedUserId).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
