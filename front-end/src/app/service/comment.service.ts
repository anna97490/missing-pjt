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

  // Get all the comments
  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl)
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

  // Create Comment method - params comment
  addComment(comment: Object): Observable<Comment> {
    const commentToSend = JSON.stringify(comment)
    const httpOptions = this.getHttpOptions();

    return this.http.post<Comment>(`${this.apiUrl}/create-comment`, {comment: commentToSend}, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Edit comment - params updatedComment - commentId
  editComment(updatedComment: Object, commentId: string): Observable<Comment> {
    const commentToSend = JSON.stringify(updatedComment);
    const httpOptions = this.getHttpOptions();

    return this.http.put<Comment>(`${this.apiUrl}/${commentId}/update-comment`, {comment: commentToSend}, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Delete Comment - params commentId
  deleteComment(commentId: string): Observable<Comment> {
    const httpOptions = this.getHttpOptions();

    return this.http.delete<Comment>(`${this.apiUrl}/${commentId}/delete-comment`, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
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
