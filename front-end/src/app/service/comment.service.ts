import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { PostService } from '../service/post.service';
import { UserService } from '../service/user.service';
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

  // Create Comment method
  addComment(comment: Object): Observable<Comment> {
    const url = `${this.apiUrl}/create-comment`;
    const commentToSend = JSON.stringify(comment)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };

    return this.http.post<Comment>(url, {comment: commentToSend}, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Edit comment
  editComment(updatedComment: Object, commentId: string): Observable<Comment> {
    const url = `${this.apiUrl}/${commentId}/update-comment`;
    const commentToSend = JSON.stringify(updatedComment);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.put<Comment>(url, {comment: commentToSend}, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Delete Comment
  deleteComment(commentId: string): Observable<Comment> {
    const url = `${this.apiUrl}/${commentId}/delete-comment`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.delete<Comment>(url, httpOptions)
    .pipe(
      map((response: any) => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
