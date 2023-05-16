import { Component } from '@angular/core';
import { User } from '../../models/User.model';
import { Post } from '../../models/Post.model';
import { PostService } from '../../service/post.service';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent {
  isLoggedIn: boolean = false;
  posts: Post[] = [];
  postId: string = '';
  user: any;
  userId: any = '';

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    // Get the userId
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userId = this.authService.getDecryptedUserId();
    this.getPosts();

    if (this.isLoggedIn) {
      // Get the user
      this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
        this.user = user;
      });
    }
  }

  // Get posts
  getPosts() {
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts.filter(post => post.userId === this.userId)
                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });
  }

  // Edit Post
  editPost(event: Event) {
    event.preventDefault();

    this.posts.forEach(post => {
      if (this.isLoggedIn) {
        this.router.navigate(['/edit-post/', post.userId, post._id], { state: { post: post }})
      }
    });
  }

  // Delete Post
  deletePost(event: Event) {
    event.preventDefault();

    this.posts.forEach(post => {
      if (this.isLoggedIn && confirm("Êtes-vous sûr de vouloir supprimer cette fiche?")) {
        this.postService.deletePost(post._id).subscribe(response => {
          window.location.reload();
        })
      }
    });
  }
}
