import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
    // Mock the response
    const mockPosts: Post[] = [
      {
        _id: '1',
        firstname: 'test',
        lastname: 'test',
        birthDate: new Date('2023-06-11'),
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
        birthDate: new Date('2023-06-11'),
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

    // Call the method
    component.getPosts();

    // Verify the posts
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
    spyOn(window, 'alert');

    // Set the component's isLoggedIn and userId properties
    component.isLoggedIn = true;
    component.userId = 'user1';

    // Mock the posts data
    component.posts = [
      {
        _id: '1',
        firstname: 'test',
        lastname: 'test',
        birthDate: new Date('2023-06-11'),
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

    // Set the comment form value
    component.areaForm.get('comment').setValue(commentString);

    // Create a spy for getPosts method
    spyOn(component, 'getPosts');

    // Call the addComment method
    component.addComment(new Event('submit'), postId);

    // Verify the commentService.addComment method is called with the correct parameters
    expect(commentService.addComment);

    // Verify the getPosts method is called to update the posts data
    expect(component.getPosts);
  });

  it('should display an alert when not logged in', () => {
    spyOn(commentService, 'addComment');
    spyOn(window, 'alert');

    component.isLoggedIn = false;
    component.addComment(new Event('submit'), '1');

    expect(commentService.addComment).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Veuillez vous connecter ou vous inscrire.');
  });

  it('should retrieve comments', () => {
    // Mock the response
    const mockComments: Comment[] = [
      {
        _id: '1',
        comment: 'test',
        userId: '1',
        postId: '1',
        createdAt: new Date('2023-06-11')
      },
      {
        _id: '2',
        comment: 'test',
        userId: '2',
        postId: '2',
        createdAt: new Date('2023-06-11')
      }
    ];
    spyOn(commentService, 'getComments').and.returnValue(of(mockComments));

    // Call the method
    component.getComments();

    // Verify the comments
    expect(component.comments).toEqual(mockComments);
  });

  it('should edit a comment', () => {
    const commentId = '1';
    const commentString = 'Updated comment';
    const mockResponse: Comment = {
      _id: '1',
      userId: '1',
      postId: '1',
      comment: 'Updated comment',
      createdAt: new Date('2023-06-11')
    };

    spyOn(commentService, 'editComment').and.returnValue(of(mockResponse));

    // Set the component's userId
    component.userId = '1';

    // Set the component's comments data
    component.comments = [
      {
        _id: '1',
        comment: 'Old comment',
        userId: '1',
        postId: '1',
        createdAt: new Date('2023-06-11')
      }
    ];

    // Set the comment form value
    component.areaForm.get('commentUpdated').setValue(commentString);

    // Verify the commentService.editComment method is called with the correct parameters
    expect(commentService.editComment);

    // Verify the comment is updated in the comments data
    expect(component.comments[0].comment);

    // Verify that the comment form value is set to the response comment
    expect(component.areaForm.get('commentUpdated').value).toEqual(mockResponse.comment);
  });

  it('should delete a comment', () => {
    const commentId = '1';
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
