import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from '../service/post.service';
import { AuthService } from '../service/auth.service';
import { Post } from '../models/Post.model';
import { throwError } from 'rxjs';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all posts', () => {
    const mockPosts: Post[] = [
      new Post('1', 'John', 'Doe', 33, 'Toulouse', new Date(), 'Nice', 'Description 1', 'image1.jpg', 'open', [], new Date(), 'user1'),
      new Post('2', 'Jane', 'Smith', 33, '456 Elm St', new Date(), 'Street', 'Description 2', 'image2.jpg', 'closed', [], new Date(), 'user2')
    ];

    service.getPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/post');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should retrieve a post by ID', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const postId = '1';
    const mockPost: Post = new Post('1', 'John', 'Doe', 33, 'Toulouse', new Date(), 'Nice', 'Description 1', 'image1.jpg', 'open', [], new Date(), 'user1');

    service.getPostById(postId).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/post/${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should send a POST request to create a new post', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);

    const formData = new FormData();
    formData.append('firstname', 'John');
    formData.append('lastname', 'Doe');
    formData.append('age', '33');
    formData.append('address', 'Nice');
    formData.append('description', 'Description 1');
    formData.append('status', 'En cours');
    formData.append('image', 'image1.jpg');
    formData.append('userId', 'user1');

    const mockPost: Post = new Post('1', 'John', 'Doe', 33, 'Nice', new Date(), 'Toulouse', 'Description 1', 'image1.jpg', 'open', [], new Date(), 'user1');

    const result = service.createPost(formData);

    result.subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/post/create');
    expect(req.request.method).toBe('POST');
    req.flush(mockPost);
  });

  it('should edit a post', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const postId = '1';
    const mockUpdatedPost: Post = new Post('1', 'John', 'Doe', 33, 'Toulouse', new Date(), 'Nice', 'Updated description', 'image1.jpg', 'open', [], new Date(), 'user1');

    service.editPost(postId, mockUpdatedPost).subscribe(post => {
      expect(post).toEqual(mockUpdatedPost);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/post/${postId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockUpdatedPost);
  });

  it('should update the picture of a post', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const postId = '1';
    const mockFormData = new FormData();
    mockFormData.append('picture', new File(['image'], 'image.jpg'));

    service.updatePostPicture(mockFormData, postId).subscribe(() => {
      expect().nothing();
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/post/${postId}/post-picture`);
    expect(req.request.method).toBe('POST');
    req.flush({}); // Empty response

  });

  it('should delete a post', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const mockPostId = '1';
    const mockUserId = '1';

    service.deletePost(mockPostId, mockUserId).subscribe(() => {
      expect().nothing();
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/post/${mockUserId}/${mockPostId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
