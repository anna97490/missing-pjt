import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from '../service/post.service';
import { Post } from '../models/Post.model';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all posts', () => {
    const mockPosts: Post[] = [
      new Post('1', 'John', 'Doe', new Date(), '123 Main St', new Date(), 'Park', 'Description 1', 'image1.jpg', 'open', [], new Date(), 'user1'),
      new Post('2', 'Jane', 'Smith', new Date(), '456 Elm St', new Date(), 'Street', 'Description 2', 'image2.jpg', 'closed', [], new Date(), 'user2')
    ];

    service.getPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/post');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should retrieve a post by ID', () => {
    const postId = '1';
    const mockPost: Post = new Post('1', 'John', 'Doe', new Date(), '123 Main St', new Date(), 'Park', 'Description 1', 'image1.jpg', 'open', [], new Date(), 'user1');

    service.getPostById(postId).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/post/${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should create a post', () => {
    const mockFormData = new FormData();
    mockFormData.append('firstname', 'John');
    mockFormData.append('lastname', 'Doe');
    mockFormData.append('birthDate', '1990-01-01');
    mockFormData.append('address', 'Nice');
    mockFormData.append('missingPlace', 'Paris');
    mockFormData.append('missingDate', '2023-06-11');
    mockFormData.append('description', 'Description 1');
    mockFormData.append('status', 'En cours');
    mockFormData.append('image', 'image1.jpg');
    mockFormData.append('userId', 'user1');

    const mockPost: Post = new Post('1', 'John', 'Doe', new Date(), 'Nice', new Date(), 'Paris', 'Description 1', 'image1.jpg', 'En cours', [], new Date(), 'user1');

    service.createPost(mockFormData).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/post/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFormData);
    req.flush(mockPost);
  });

  it('should edit a post', () => {
    const postId = '1';
    const mockUpdatedPost: Post = new Post('1', 'John', 'Doe', new Date(), '123 Main St', new Date(), 'Park', 'Updated description', 'image1.jpg', 'open', [], new Date(), 'user1');

    service.editPost(postId, mockUpdatedPost).subscribe(post => {
      expect(post).toEqual(mockUpdatedPost);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/post/${postId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ post: JSON.stringify(mockUpdatedPost) });
    req.flush(mockUpdatedPost);
  });

  it('should update the picture of a post', () => {
    const postId = '1';
    const mockFormData = new FormData();
    mockFormData.append('picture', new File(['image'], 'image.jpg'));

    const mockUpdatedPost: Post = new Post('1', 'John', 'Doe', new Date(), '123 Main St', new Date(), 'Park', 'Description 1', 'updated-image.jpg', 'open', [], new Date(), 'user1');

    service.updatePostPicture(mockFormData, postId).subscribe(post => {
      expect(post).toEqual(mockUpdatedPost);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/post/${postId}/post-picture`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFormData);
    req.flush(mockUpdatedPost);
  });

  it('should delete a post', () => {
    const postId = '1';

    service.deletePost(postId).subscribe(post => {
      expect(post).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/post/${postId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
