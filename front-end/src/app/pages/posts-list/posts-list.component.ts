import { Component } from '@angular/core';
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
  isLoggedIn   : boolean = false;
  posts        : Post[] = [];
  postsOfUser  : Post[] = [];
  allPosts     : Post[] = [];
  comment      : any;
  filteredPosts: any = [];
  searchText   : string = '';
  selectedDate : any = Date;
  id           : string = '';
  user         : any;
  userId       : any = '';
  modalOpen    = false;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    // Get the userId
    this.userId = this.authService.getDecryptedUserId();
    this.isLoggedIn = this.authService.isLoggedIn();

    this.postService.getPosts().subscribe((posts: Post[]) => {
      if (this.isLoggedIn) {
        this.posts = posts;
        // Sort the posts by ascendant
        this.posts = posts.sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return -1;
          } else if (a.createdAt < b.createdAt) {
            return 1;
          } else {
            return 0;
          }
        });
        this.postsOfUser = this.posts.filter(post => post.userId === this.userId);
        this.filteredPosts = this.posts;
        this.allPosts = [...this.posts];
      }
    })
  }
}
