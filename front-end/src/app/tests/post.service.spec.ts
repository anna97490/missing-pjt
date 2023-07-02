import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from '../service/post.service';
import { AuthService } from '../service/auth.service';
import { Post } from '../models/Post.model';
import { throwError } from 'rxjs';

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
      new Post('1', 'John', 'Doe', 33, '123 Main St', new Date(), 'Park', 'Description 1', 'image1.jpg', 'open', [], new Date(), 'user1'),
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
    const postId = '1';
    const mockPost: Post = new Post('1', 'John', 'Doe', 33, '123 Main St', new Date(), 'Park', 'Description 1', 'image1.jpg', 'open', [], new Date(), 'user1');

    service.getPostById(postId);

  });

  it('should create a post', () => {
    const mockFormData = new FormData();
    mockFormData.append('firstname', 'John');
    mockFormData.append('lastname', 'Doe');
    mockFormData.append('age', '33');
    mockFormData.append('address', 'Nice');
    mockFormData.append('description', 'Description 1');
    mockFormData.append('status', 'En cours');
    mockFormData.append('image', 'image1.jpg');
    mockFormData.append('userId', 'user1');

    service.createPost(mockFormData).subscribe(response => {
      expect(response).toBeTruthy();
    });
  });

  it('should edit a post', () => {
    const postId = '1';
    const mockUpdatedPost: Post = new Post('1', 'John', 'Doe', 33, '123 Main St', new Date(), 'Park', 'Updated description', 'image1.jpg', 'open', [], new Date(), 'user1');

    service.editPost(postId, mockUpdatedPost);

  });

  it('should update the picture of a post', () => {
    const postId = '1';
    const mockFormData = new FormData();
    mockFormData.append('picture', new File(['image'], 'image.jpg'));

    service.updatePostPicture(mockFormData, postId);

  });

  it('should delete a post', () => {
    const mockPostId = '1';
    const mockUserId = '1';

    service.deletePost(mockPostId, mockUserId);

  });
});
