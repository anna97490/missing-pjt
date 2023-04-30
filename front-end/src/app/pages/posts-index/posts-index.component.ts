import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/Post.model';
import { User } from '../../models/User.model';
import { PostService } from '../../service/post.service';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-posts-index',
  templateUrl: './posts-index.component.html',
  styleUrls: ['./posts-index.component.scss']
})
export class PostsIndexComponent {
  @Input() showContCreation: boolean = true;
  isLoggedIn   : boolean = false;
  posts        : Post[] = [];
  allPosts     : Post[] = [];
  filteredPosts: Post[] = [];
  searchText   : string = '';
  selectedDate : any = Date;
  id           : string = '';
  user         : any = User;
  modalOpen    = false;
  token: any;

  constructor(
    private authService: AuthService,
    private postService: PostService,
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('token')
    this.isLoggedIn = this.authService.isLoggedIn();
    // Get posts
    this.postService.getPosts().subscribe((posts: Post[]) => {
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
      // Filtered posts for search bar
      this.filteredPosts = this.posts;
      this.allPosts = [...this.posts];
    })
  }

  // Modal for non-connected or registered users
  openModal(event: Event) {
    event.preventDefault();
    console.log('open')
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  // Function for search bar
  onSearch() {
    if (this.searchText) {
      // Convert the search string to lowercase.
      const searchTerm = this.searchText.toLowerCase();
      // Search by missingPlace
      this.filteredPosts = this.allPosts.filter((post) =>
        //Convert the string of the article object to lowercase
        post.missingPlace.toLowerCase().includes(searchTerm)
      );
    this.posts = [...this.filteredPosts];
    } else {
      this.posts = [...this.allPosts];
    }
  }
}
