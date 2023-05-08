import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/Post.model';
import { PostService } from '../../service/post.service';
import { AuthService } from '../../service/auth.service';
import { CommentService } from '../../service/comment.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-missing',
  templateUrl: './card-missing.component.html',
  styleUrls: ['./card-missing.component.scss']
})

export class CardMissingComponent implements OnInit {
  @Input() post: any;
  isLoggedIn : boolean = this.authService.isLoggedIn();
  userId     : any = this.authService.getDecryptedUserId();;
  user       : any;
  postId     : string = '';
  posts      : Post[] = [];
  comments   : Comment[] = [];
  comment    : any = Comment;
  commentId  : any;
  commentArea: string = '';
  arrayCommentId = [];
  element: any

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    // Get all posts
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
      // Get the comment
      this.posts.forEach(post => {
        this.comment = post.comments.map(comment => comment.comment);
        this.commentId = post.comments.map(comment => comment._id);
      })
    });
    // Birth date formated to age
    const birthDate = new Date(this.post.birthDate);
    const today = new Date();
    const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    this.post.age = age;
  }

  // Edit Post
  editPost(event: Event) {
    event.preventDefault();

    this.posts.forEach(post => {
      this.postId = post._id;

      if (this.postId === this.postId && this.isLoggedIn) {
        this.router.navigate(['/edit-post/', this.post.userId, this.postId], { state: { post: post }})
      }
    });
  }

  // Delete Post
  deletePost(event: Event) {
    event.preventDefault();

    this.posts.forEach(post => {
      this.postId = post._id

      if (this.postId === this.postId && this.post.userId === post.userId && confirm("Êtes-vous sûr de vouloir supprimer cette fiche?")) {
        this.postService.deletePost(this.postId).subscribe(response => {
          window.location.reload();
        })
      }
    });
  }

  addComment(event: Event, postId: string) {
    event.preventDefault();

    this.posts.forEach(post => {
      postId = post._id;
    });

    this.commentService.addComment(this.commentArea, postId).subscribe(response => {
      console.log(response)
      window.location.reload();
    });
  }

  editComment(event: Event, postId: string) {

  }
}
