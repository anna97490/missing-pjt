import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from '../service/comment.service';
import { Comment } from '../models/Comment.model';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
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
    const mockComment: Comment = new Comment('1', 'user1', 'post1', 'New comment', new Date());

    service.addComment(mockComment).subscribe(comment => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/comment/create-comment');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ comment: JSON.stringify(mockComment) });
    req.flush(mockComment);
  });

  it('should edit a comment', () => {
    const mockCommentId = '1';
    const mockUpdatedComment: Comment = new Comment('1', 'user1', 'post1', 'Updated comment', new Date());

    service.editComment(mockUpdatedComment, mockCommentId).subscribe(comment => {
      expect(comment).toEqual(mockUpdatedComment);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/comment/${mockCommentId}/update-comment`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ comment: JSON.stringify(mockUpdatedComment) });
    req.flush(mockUpdatedComment);
  });

  it('should delete a comment', () => {
    const mockCommentId = '1';

    service.deleteComment(mockCommentId).subscribe(comment => {
      expect(comment).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/comment/${mockCommentId}/delete-comment`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
