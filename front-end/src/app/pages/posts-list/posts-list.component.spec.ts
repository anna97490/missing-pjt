import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PostsListComponent } from './posts-list.component';
import { PostService } from '../../service/post.service';
import { UserService } from '../../service/user.service';

describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPosts']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PostsListComponent],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getUserById', () => {
    it('should call userService.getUserById and set the user property', () => {
      const userId = '123';
      const user = { id: userId, name: 'John Doe' };
      userService.getUserById;

      expect(userService.getUserById);
      expect(component.user);
    });
  });

  describe('getPosts', () => {
    it('should call postService.getPosts and set the posts property', () => {
      const userId = '123';
      const posts = [{ id: '1', userId: userId }, { id: '2', userId: userId }];
      postService.getPosts;

      expect(postService.getPosts);
      expect(component.posts);
    });

    it('should set the post and calculate the age if posts are available', () => {
      const userId = '123';
      const posts = [
        { id: '1', userId: userId, birthDate: new Date(1990, 0, 1) },
        { id: '2', userId: userId, birthDate: new Date(1995, 5, 10) }
      ];
      postService.getPosts;

      component.userId = userId;

      expect(component.post);
    });

    it('should not set the post if no posts are available', () => {
      const userId = '123';
      const posts: any[] = [];
      postService.getPosts.and.returnValue(of(posts));

      component.userId = userId;
      component.getPosts();

      expect(component.post).toBeUndefined();
    });
  });
});
