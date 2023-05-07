import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { PostService } from '../service/post.service';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { Post } from '../models/Post.model';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comment: Comment[] = [];
  private apiUrl : string = 'http://localhost:3000/api/comment';
  private token  : any = this.authService.getAuthToken();

  constructor(
    private router: Router,
    private userService: UserService,
    private postService: PostService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.token = this.authService.getAuthToken();
  }

  // Create Post method
  addComment(comment: string, postId: string): Observable<Comment> {
    const userId =  this.authService.getDecryptedUserId();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };

    return this.http.post<Comment>(`${this.apiUrl}/create`, {text: comment, postId: postId, userId: userId}, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // // Get all the posts method
  // getPosts(): Observable<Post[]> {
  //   return this.http.get<Post[]>(this.apiUrl).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       console.error(error);
  //       return throwError('Error');
  //     })
  //   )
  // }

  // // Get Post by id method
  // getPostById(id: string): Observable<Post> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.get<Post>(url);
  // }

  // // Edit post
  // editPost(postId: string, updatedPost: Object): Observable<Post> {
  //   const url = `${this.apiUrl}/${postId}`;
  //   const post = JSON.stringify(updatedPost)

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type' : 'application/json',
  //       'Authorization': 'Bearer ' + this.token })
  //   };

  //   return this.http.put<Post>(url, {post: post}, httpOptions).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       return throwError('An error occurred while modifying the user.');
  //     })
  //   );
  // }

  // // Delete Post method
  // deletePost(postId: string): Observable<Post> {
  //   const url = `${this.apiUrl}/${postId}`;
  //   this.getPostById(postId);

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type' : 'application/json',
  //       'Authorization': 'Bearer ' + this.token })
  //   };

  //   return this.http.delete<Post>(url, httpOptions).pipe(
  //     map(response => {
  //       console.log(response);
  //       this.getPosts();
  //       return response;
  //     })
  //   );
  // }
}
