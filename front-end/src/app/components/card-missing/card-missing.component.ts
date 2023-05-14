import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User.model';
import { Post } from 'src/app/models/Post.model';
import { PostService } from '../../service/post.service';
import { UserService } from '../../service/user.service';
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
  isLoggedIn : boolean = false;
  userId     : any;
  user       : any;
  postId     : string = '';
  posts      : Post[] = [];
  comments   : Comment[] = [];
  comment    : any = Comment;
  commentId  : any;
  commentArea: string = '';
  commentAreaEdit: string = '';
  element: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userId = this.authService.getDecryptedUserId();
    if (this.isLoggedIn) {
      // Get the user
      this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
        this.user = user;
      });
    }
    // Get all posts
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.posts.forEach(post => {
        post.comments.forEach((comment, i) => {
          post.comments[i].comment
        })
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

  addComment(event: Event) {
    event.preventDefault();

    this.posts.forEach(post => {
      this.postId = post._id;
    });

    let comment = {
      comment: this.commentArea,
      userId: this.userId,
      postId: this.postId
    }

    this.commentService.addComment(comment, this.postId).subscribe(response => {
      console.log(response)
      window.location.reload();
    });
  }

  editComment(event: Event, commentId: string, comment: string) {
    event.preventDefault();

    console.log('comment', comment)

    this.posts.forEach(post => {
      this.postId = post._id;
    });

    let updatedComment = {
      _id: commentId,
      comment: comment,
      userId: this.userId,
      postId: this.postId
    }

    this.commentService.editComment(updatedComment, this.postId).subscribe(response => {
      console.log(response)
      window.location.reload();
    });
  }

  deleteComment(event: Event, commentId: string) {
    event.preventDefault();
    console.log(commentId)

    if (confirm("Êtes-vous sûr de vouloir supprimer votre commentaire?")) {
      this.commentService.deleteComment(commentId).subscribe(response => {
        console.log(response)
        // window.location.reload();
      });
    }
  }
}
