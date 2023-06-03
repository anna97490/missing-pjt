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

  // Create Post - params formData contains infos of the post
  createPost(formData: FormData): Observable<Post> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.post<Post>(`${this.apiUrl}/create`, formData, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Get all the posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError('Error');
      })
    )
  }

  // Get Post by id - params postId
  getPostById(postId: string): Observable<Post> {
    const httpOptions = this.getHttpOptions();

    return this.http.get<Post>(`${this.apiUrl}/${postId}`, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError('Error');
      })
    )
  }

  // Edit post - params postId - updatedPost contains updated infos
  editPost(postId: string, updatedPost: Object): Observable<Post> {
    const httpOptions = this.getHttpOptions();
    const post = JSON.stringify(updatedPost)

    return this.http.put<Post>(`${this.apiUrl}/${postId}`, {post: post}, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while modifying the user.');
      })
    );
  }

  // Update picture - params formData contains the picture - postId
  updatePostPicture(formData: FormData, postId: string): Observable<Post> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.post<Post>(`${this.apiUrl}/${postId}/post-picture`, formData, httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while modifying the post picture.');
      })
    );
  }

  // Delete Post method - params postId
  deletePost(postId: string): Observable<Post> {
    const httpOptions = this.getHttpOptions();

    return this.http.delete<Post>(`${this.apiUrl}/${postId}`, httpOptions)
    .pipe(
      map(response => {
        this.getPosts();
        return response;
      })
    );
  }

  // Declare the httpOptions
  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }
}
