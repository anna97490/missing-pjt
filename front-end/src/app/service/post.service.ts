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
  posts         : Post[] = [];
  private apiUrl: string = 'http://localhost:3000/api/post';
  token         : any = localStorage.getItem('token');
  userId        : any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError('Error');
      })
    )
  }

  createPost(formData: FormData, userId: string): Observable<Post> {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type' : 'multipart/form-data; boundary=something',
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.post<Post>(`${this.apiUrl}/create`, formData, httpOptions)
    .pipe(
      map((response: any) => {
        this.router.navigate(['/posts-index']);
        return response;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError('Error');
      })
    )
  }

  getPostById(id: string): Observable<Post> {
    console.log('id', id)
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Post>(url);
  }

  editPost(id: string, post: any): Observable<Post> {
    const url = `${this.apiUrl}/${id}`;

    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type' : 'multipart/form-data; boundary=something',
        'Authorization': 'Bearer ' + this.token })
    };
    return this.http.put<Post>(url, post, httpOptions).pipe(
      map(response => {
        console.log(response);
        this.getPosts();
        return response;
      })
    );
  }

  deletePost(postId: string): Observable<Post> {
    const url = `${this.apiUrl}/${postId}`;
    this.getPostById(postId);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization': 'Bearer ' + this.token })
    };

    return this.http.delete<Post>(url, httpOptions).pipe(
      map(response => {
        console.log(response);
        this.getPosts();
        return response;
      })
    );
  }
}
