import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/Post.model';
import { User } from 'src/app/models/User.model';
import { PostService } from '../../service/post.service';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-card-missing',
  templateUrl: './card-missing.component.html',
  styleUrls: ['./card-missing.component.scss']
})
export class CardMissingComponent implements OnInit {
  @Input() post: any;
  isLoggedIn = false;
  userId: any;
  user: any = User;
  posts: Post[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.getPosts();
    if (this.isLoggedIn) {
      this.userId = this.authService.getDecryptedUserId();
      // Get user
      this.getUser();
    }
  }


  /**
  * Edit the post
  * @param event - The event object
  */
  editPost(event: Event) {
    event.preventDefault();

    if (this.isLoggedIn) {
      const post = this.posts.find(post => post._id === this.post._id);

      if (post) {
        this.router.navigate(['/edit-post/', post.userId, post._id], { state: { post: post }});
      }
    }
  }


  /**
  * Delete the post with postId
  * @param event - The event object
  * @param postId - The ID of the post to delete
  */
  deletePost(event: Event, postId: string) {
    event.preventDefault();
    const post = this.posts.find(post => post.userId === this.userId && post._id === this.post._id);

    // Check if user is connected and if "Ok" to confirm
    if (this.isLoggedIn && confirm("Êtes-vous sûr de vouloir supprimer cette fiche?") &&
      post?.userId === this.userId || this.user.status === 'admin' ) {
      this.postService.deletePost(postId, this.userId)
      .subscribe({
        next: (response: any) => {
          window.location.reload(); // a supprimer
          // this.getPosts();
          // return this.posts;
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  /**
  Get the user by Id
  */
  getUser() {
    this.userService.getUserById(this.userId)
    .subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (error) => {
        console.error('An error occurred while getting user:', error);
      }
    });
  }


  /**
  * Get the posts
  */
  getPosts() {
    this.postService.getPosts()
    .subscribe((posts: Post[]) => {
      // Array of posts
      this.posts = posts;
    });
  }
}
