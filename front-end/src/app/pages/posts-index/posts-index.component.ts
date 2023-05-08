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
  isLoggedIn   : boolean = this.authService.isLoggedIn();;
  posts        : Post[] = [];
  allPosts     : Post[] = [];
  filteredPosts: Post[] = [];
  searchText   : string = '';
  modalOpen = false;

  selection :any;
  selectedPlace: string = "";
  selectedDate: any;

  constructor(
    private authService: AuthService,
    private postService: PostService,
  ) {}

  ngOnInit() {
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

  closeModal(event: Event) {
    event.preventDefault();
    this.modalOpen = false;
  }

  // Function for search bar
  onSearch() {
    if (this.selectedPlace) {
      // Convert the search string to lowercase.
      const selectedPlace = this.selectedPlace.toLowerCase();
        // Search by missingPlace
        this.filteredPosts = this.allPosts.filter((post) =>
        //Convert the string of the article object to lowercase
        post.missingPlace.toLowerCase().includes(selectedPlace)
        );
        this.posts = [...this.filteredPosts];
    } else if (this.selectedDate) {
      //  const selectedPlace = this.selectedPlace.toLowerCase();
      //  // Search by missingDate
      //  this.filteredPosts = this.allPosts.filter((post) =>
      //  //Convert the string of the article object to lowercase
      // //  post.missingDate.toLowerCase().includes(selectedPlace)
      //  );
      //  this.posts = [...this.filteredPosts];
    } else {
      this.posts = [...this.allPosts];
    }
  }

  // Reset filters method
  onResetFilters() {
    this.posts = [...this.allPosts];
  }
}
