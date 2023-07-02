import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { Comment } from '../models/Comment.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comment: Comment[] = [];
  private apiUrl : string = 'http://localhost:3000/api/comment';
  private token  : any = this.authService.getAuthToken();

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.token = this.authService.getAuthToken();
  }


  /**
   * Get all comments
   * @returns Observable<Comment[]> - The array of comments
   */
  getComments(): Observable<Comment[]> {
    // Send a GET request to retrieve the comments
    return this.http.get<Comment[]>(this.apiUrl)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(() => new Error('An error occurred while getting the comments'));
      })
    )
  }


  /**
   * Create a comment
   * @param comment - The comment object to create
   * @returns Observable<Comment> - The created comment
   */
  addComment(comment: Object): Observable<Comment> {
    // Convert the comment object to JSON string
    const commentToSend = JSON.stringify(comment)
    const httpOptions = this.getHttpOptions();

    // Check if the user is not authenticated
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Send a POST request to create the comment
    return this.http.post<Comment>(`${this.apiUrl}/create-comment`, {comment: commentToSend}, httpOptions)
    .pipe(
      map((response: Comment) => {
        return response;
      }),
      catchError(error => {
        console.log(error);
        return throwError(() => new Error('An error occurred while creating the comment'));
      })
    );
  }


  /**
   * Delete a comment
   * @param commentId - The ID of the comment to delete
   * @returns Observable<Comment> - The deleted comment
   */
  deleteComment(userId: string, commentId: string): Observable<Comment> {
    const httpOptions = this.getHttpOptions();
    // Check if the user is not authenticated
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Check if the commentId is invalid
    if (!commentId) {
      return throwError(() => new Error('Invalid commentId'));
    }

    // Send a DELETE request to delete the comment
    return this.http.delete<Comment>(`${this.apiUrl}/${userId}/${commentId}/delete-comment`, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        console.log(error);
        return throwError(() => new Error('An error occurred while deleting the comment'));
      })
    );
  }


  /**
   * Get the HTTP options with authorization header
   * @returns any - The HTTP options object
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
