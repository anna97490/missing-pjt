import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';
// import { Comment } from 'src/app/models/Comment.model';
import { CommentService } from '../../service/comment.service';
import { UserService } from '../../service/user.service';
import { PostService } from '../../service/post.service';
import { AuthService } from '../../service/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  // @Input() comment: any;
  // user       : any;
  // isLoggedIn : boolean = false;
  // userId     : any;
  // postId     : string = '';
  // comments   : Comment[] = [];

  // constructor(
  //   private authService: AuthService,
  //   private postService: PostService,
  //   private commentService: CommentService,
  //   private userService: UserService,
  //   private router: Router,
  //   private datePipe: DatePipe
  // ) {}

  // ngOnInit() {
  //   this.isLoggedIn = this.authService.isLoggedIn();
  //   this.userId = this.authService.getDecryptedUserId();
  //   // Get all comments
  //    this.commentService.getComments().subscribe((comments: Comment[]) => {
  //     this.comments = comments;
  //   });
  // }


  // Edit Comment
  // editComment(event: Event, postId: string) {
  //   event.preventDefault();

  //   this.comments.forEach(comment => {
  //     this.postId = post._id;

  //     if (postId === this.postId && this.isLoggedIn) {
  //       this.router.navigate(['/edit-post/', this.post.userId, postId], { state: { post: post }})
  //     }
  //   });
  // }

  // Delete Post
  // deletePost(event: Event, postId: string) {
  //   event.preventDefault();

  //   this.posts.forEach(post => {
  //     this.postId = post._id

  //     if (postId === this.postId && this.post.userId === post.userId && confirm("Êtes-vous sûr de vouloir supprimer cette fiche?")) {
  //       this.postService.deletePost(postId).subscribe(response => {
  //         console.log(response);
  //         window.location.reload();
  //       })
  //     }
  //   });
  // }

  // addComment(event: Event, postId: string) {
  //   event.preventDefault();

  //   this.posts.forEach(post => {
  //     postId = post._id;
  //   });

  //   console.log(this.commentArea)
  //   console.log("postId", postId)
  //   this.commentService.addComment(this.commentArea, postId).subscribe(response => {
  //     console.log(response)
  //     // this.router.navigate(['/posts-index']);
  //     // window.location.reload();
  //   });
  // }
}
