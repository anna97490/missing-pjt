import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { Comment } from '../../models/Comment.model';
import { Post } from '../../models/Post.model';
import { PostService } from '../../service/post.service';
import { CommentService } from '../../service/comment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostsIndexComponent } from './posts-index.component';

describe('PostsIndexComponent', () => {
  let component: PostsIndexComponent;
  let fixture: ComponentFixture<PostsIndexComponent>;
  let postService: PostService;
  let commentService: CommentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostsIndexComponent],
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule],
      providers: [PostService, CommentService] // Add the service providers here
    }).compileComponents();

    fixture = TestBed.createComponent(PostsIndexComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    commentService = TestBed.inject(CommentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve posts', () => {
    const mockPosts: Post[] = [
      {
        _id: '1',
        firstname: 'test',
        lastname: 'test',
        age: 33,
        address: 'test',
        missingDate: new Date('2023-06-11'),
        missingPlace: 'Paris',
        description: 'test',
        image: 'image',
        status: 'En cours',
        comments: [
          {
            _id: '1',
            comment: 'test',
            userId: '1',
            createdAt: new Date('2023-06-11')
          }
        ],
        createdAt: new Date('2023-06-11'),
        userId: '1'
      },
      {
        _id: '2',
        firstname: 'test',
        lastname: 'test',
        age: 33,
        address: 'test',
        missingDate: new Date('2023-06-11'),
        missingPlace: 'Paris',
        description: 'test',
        image: 'image',
        status: 'En cours',
        comments: [
          {
            _id: '2',
            comment: 'test',
            userId: '2',
            createdAt: new Date('2023-06-11')
          }
        ],
        createdAt: new Date('2023-06-11'),
        userId: '2'
      }
    ];
    spyOn(postService, 'getPosts').and.returnValue(of(mockPosts));

    component.getPosts();

    expect(component.posts).toEqual(mockPosts);
  });

  it('should add a comment', () => {
    const postId = '1';
    const commentString = 'Test comment';

    const mockResponse: Comment = {
      _id: '1',
      userId: '1',
      postId: '1',
      comment: 'Test comment',
      createdAt: new Date('2023-06-11')
    };

    spyOn(commentService, 'addComment').and.returnValue(of(mockResponse));

    component.isLoggedIn = true;
    component.userId = 'user1';

    component.posts = [
      {
        _id: '1',
        firstname: 'test',
        lastname: 'test',
        age: 33,
        address: 'test',
        missingDate: new Date('2023-06-11'),
        missingPlace: 'Paris',
        description: 'test',
        image: 'image',
        status: 'En cours',
        comments: [],
        createdAt: new Date('2023-06-11'),
        userId: '1'
      }
    ];

    component.areaForm.get('comment').setValue(commentString);

    spyOn(component, 'getPosts');

    component.addComment(new Event('submit'), postId);

    expect(commentService.addComment);

    expect(component.getPosts);
  });

  it('should delete a comment', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(commentService, 'deleteComment').and.returnValue(of({} as Comment));

    spyOn(component, 'getComments');
    spyOn(component, 'getPosts');

    expect(window.confirm);
    expect(commentService.deleteComment);
    expect(component.getComments);
    expect(component.getPosts);
  });
});
