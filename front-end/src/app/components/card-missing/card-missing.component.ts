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
    this.userId = this.authService.getDecryptedUserId();
    this.calculateAge();
    this.getPosts();
    this.getUser();
  }

  /**
   * Get the user information based on the post's userId
   */
  getUser() {
    this.userId = this.authService.getDecryptedUserId();

    if (!this.userId) {
      console.error('Invalid userId');
      return;
    }
  }


  /**
   * Edit the post
   * @param event - The event object
   */
  editPost(event: Event) {
    event.preventDefault();

    if (this.isLoggedIn) {
      const post = this.posts.find(post => post.userId === this.userId && post._id === this.post._id);

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
      post?.userId === this.userId) {
      this.postService.deletePost(postId).subscribe({
        next: (response: any) => {
          window.location.reload(); // a supprimer
          // this.removePostFromArray(postId);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }


  /**
   * Get the posts
   */
  private getPosts() {
    this.postService.getPosts().subscribe((posts: Post[]) => {
      // Array of posts
      this.posts = posts;
    });
  }


  /**
   * Calculate the age from birthDate and update the post's age property
   */
  private calculateAge() {
    // Calculate age from birthDate
    const birthDate = new Date(this.post.birthDate);
    const today = new Date();
    const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    this.post.age = age;
  }


  /**
   * Update the posts array after deleting a post
   * @param postId - The ID of the post to remove from the array
   */
  private removePostFromArray(postId: string) {
    this.getPosts();
    const index = this.posts.findIndex(post => post._id === postId);
    if (index !== -1) {
      this.posts.splice(index, 1);
    }
  }
}
