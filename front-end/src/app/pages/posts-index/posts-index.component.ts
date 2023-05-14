import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/Post.model';
import { PostService } from '../../service/post.service';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-posts-index',
  templateUrl: './posts-index.component.html',
  styleUrls: ['./posts-index.component.scss']
})
export class PostsIndexComponent implements OnInit {
  @Input() showContCreation: boolean = true;
  token: any;
  isLoggedIn: boolean = false;
  posts: Post[] = [];
  allPosts: Post[] = [];
  searchText: string = '';
  modalOpen = false;

  selection :any;
  selectedPlace: string = "";
  selectedDate: any;

  constructor(
    private authService: AuthService,
    private postService: PostService,
  ) {}

  ngOnInit() {
    this.token = this.authService.getAuthToken();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.getPosts();
  }

  // Get posts
  getPosts() {
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });
  }

  // Modal for non-connected or registered users
  openModal(event: Event) {
    event.preventDefault();
    console.log('open')
    this.modalOpen = true;
  }

  closeModal(event: Event) {
    event.preventDefault();
    this.modalOpen = false;
  }

  // Function for search bar
  onSearch() {

  }

  // Reset filters method
  onResetFilters() {
    this.posts = [...this.allPosts];
  }
}
