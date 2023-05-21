import { Component, Input } from '@angular/core';
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
  @Input() modalOpen : boolean = false;
  isLoggedIn: boolean = true;
  userId: any;
  postId: any;
  posts: Post[] = [];
  allPosts: Post[] = [];
  post: any;
  user: any;

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

    // Get the user
    this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
      this.user = user;
    });
    // Birth date formated to age
    const birthDate = new Date(this.post.birthDate);
    const today = new Date();
    const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    this.post.age = age;
  }

  // Get posts
  getPosts() {
    this.postService.getPosts().subscribe((posts) => {
      this.posts = posts.filter(post => post.userId === this.userId)
                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      this.posts.forEach((post: any) => {
        this.post = post;
      })
    });
  }
}
