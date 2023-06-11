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
  @Input() modalOpen: boolean = false;
  userId: any;
  postId: any;
  isLoggedIn: boolean = true;
  posts: Post[] = [];
  allPosts: Post[] = [];
  post: any;
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userId = this.authService.getDecryptedUserId();
    this.getUserById();
    this.getPosts();
  }

  getUserById() {
    this.userService.getUserById(this.userId).subscribe((user: User) => {
      this.user = user;
    });
  }

  calculateAge(birthDate: Date) {
    const today = new Date();
    const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return age;
  }

  getPosts() {
    this.postService.getPosts().subscribe((posts) => {
      this.posts = posts
        .filter(post => post.userId === this.userId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      if (this.posts.length > 0) {
        this.post = this.posts[0];
        this.post.age = this.calculateAge(new Date(this.post.birthDate));
      }
    });
  }
}
