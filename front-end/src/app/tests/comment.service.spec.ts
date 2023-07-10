import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from '../service/comment.service';
import { AuthService } from '../service/auth.service';
import { Comment } from '../models/Comment.model';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService, AuthService]
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all comments', () => {
    const mockComments: Comment[] = [
      new Comment('1', 'user1', 'post1', 'Comment 1', new Date()),
      new Comment('2', 'user2', 'post2', 'Comment 2', new Date())
    ];

    service.getComments().subscribe(comments => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/comment');
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('should add a comment', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const mockComment: Comment = new Comment('1', 'user1', 'post1', 'New comment', new Date());

    service.addComment(mockComment).subscribe(comment => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/comment/create-comment');
    expect(req.request.method).toBe('POST');
    req.flush(mockComment);
  });

  it('should delete a comment', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const mockUserId = '1';
    const mockCommentId = '1';

    service.deleteComment(mockUserId, mockCommentId).subscribe(comment => {
      expect(comment).toBeTruthy();
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/comment/${mockUserId}/${mockCommentId}/delete-comment`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
