import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { Post } from '../models/Post.model';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts : Post[] = [];
  private apiUrl: string = 'http://localhost:3000/api/post';
  private token : any = this.authService.getAuthToken();

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.token = this.authService.getAuthToken();
  }


  /**
   * Create a new post
   * @param formData - Form data containing post information
   * @returns Observable<Post> - The created post
   */
  createPost(formData: FormData): Observable<Post> {
    // Set the HTTP headers with authorization token
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    };

    // Check if the user is authenticated
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Send a POST request to create a new post
    return this.http.post<Post>(`${this.apiUrl}/create`, formData, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        return throwError(() => new Error('An error occurred while creating the post'));
      })
    );
  }


  /**
   * Get all posts
   * @returns Observable<Post[]> - List of posts
   */
  getPosts(): Observable<Post[]> {
    // Send a GET request to retrieve all posts
    return this.http.get<Post[]>(this.apiUrl)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error('An error occurred while getting the posts'));
      })
    )
  }


  /**
   * Get a post by ID
   * @param postId - The ID of the post to get
   * @returns Observable<Post> - The requested post
   */
  getPostById(postId: string): Observable<Post> {
    // Get the HTTP options for making requests
    const httpOptions = this.getHttpOptions();

    // Check if the postId is invalid
    if (!postId) {
      return throwError(() => new Error('Invalid postId'));
    }

    // Check if the user is not authenticated
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Send a GET request to retrieve the post by its ID
    return this.http.get<Post>(`${this.apiUrl}/${postId}`, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error('An error occurred while getting the post'));
      })
    )
  }


  /**
   * Edit a post.
   * @param postId - The ID of the post to edit
   * @param updatedPost - The updated post datas
   * @returns Observable<Post> - The edited post
   */
  editPost(postId: string, updatedPost: Object): Observable<Post> {
    // Get the HTTP options for making requests
    const httpOptions = this.getHttpOptions();

    // Convert the updatedPost object to JSON string
    const post = JSON.stringify(updatedPost);

    // Check if the postId is invalid
    if (!postId) {
      return throwError(() => new Error('Invalid postId'));
    }

    // Check if the user is not authenticated
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Send a PUT request to edit the post
    return this.http.put<Post>(`${this.apiUrl}/${postId}`, {post: post}, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error('An error occurred while editing the post'));
      })
    );
  }


  /**
   * Update the picture of a post
   * @param formData - Form data containing the new picture
   * @param postId - The ID of the post to update
   * @returns Observable<Post> - The updated post
   */
  updatePostPicture(formData: FormData, postId: string): Observable<Post> {
    // Set the HTTP options for the request
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token })
    };

    // Check if the postId is invalid
    if (!postId) {
      return throwError(() => new Error('Invalid postId'));
    }

    // Check if the user is not authenticated
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Send a POST request to update the post picture
    return this.http.post<Post>(`${this.apiUrl}/${postId}/post-picture`, formData, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error('An error occurred while updating the post picture'));
      })
    );
  }


  /**
   * Delete a post
   * @param postId - The ID of the post to delete
   * @returns Observable<Post> - The deleted post
   */
  deletePost(postId: string, userId: string): Observable<Post> {
    // Get the HTTP options for the request
    const httpOptions = this.getHttpOptions();

    // Check if the postId is invalid
    if (!postId) {
      return throwError(() => new Error('Invalid postId'));
    }

    // Check if the user is not authenticated
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Send a DELETE request to delete the post
    return this.http.delete<Post>(`${this.apiUrl}/${userId}/${postId}`, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(() => new Error('An error occurred while deleting the post'));
      })
    );
  }


  /**
   * Get the HTTP options for making requests
   * @returns Object - The HTTP options
   */
  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }
}
