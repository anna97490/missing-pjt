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

  // Create Post
  createPost(formData: FormData): Observable<Post> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
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


  // Get Post by id
  getPostById(postId: string): Observable<Post> {
    const url = `${this.apiUrl}/${postId}`;
    return this.http.get<Post>(url)
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

  // Edit post
  editPost(postId: string, updatedPost: Object): Observable<Post> {
    const url = `${this.apiUrl}/${postId}`;
    const post = JSON.stringify(updatedPost)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.put<Post>(url, {post: post}, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while modifying the user.');
      })
    );
  }

  // Update profile picture
  updatePostPicture(formData: FormData, postId: string): Observable<Post> {
    console.log('postId', postId)
    const url = `${this.apiUrl}/${postId}/post-picture`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.post<Post>(url, formData, httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('An error occurred while modifying the post picture.');
      })
    );
  }

  // Delete Post method
  deletePost(postId: string): Observable<Post> {
    const url = `${this.apiUrl}/${postId}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.delete<Post>(url, httpOptions).pipe(
      map(response => {
        this.getPosts();
        return response;
      })
    );
  }
}
