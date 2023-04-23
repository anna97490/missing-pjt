import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../service/post.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {
  @Input() showContCreation: boolean = true;
  isLoggedIn   : boolean = false;
  posts        : Post[] = [];
  allPosts     : Post[] = [];
  filteredPosts: any = [];
  searchText   : string = '';
  selectedDate : any = Date;
  id           : string = '';
  user         : any;
  modalOpen    = false;

  constructor(
    private authService: AuthService,
    private postService: PostService,
  ) {}

  ngOnInit() {
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
      this.allPosts      = [...this.posts];
    })
  }

  preventDefault(event: Event) {
    event.preventDefault();
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
      const searchTerm = this.searchText.toLowerCase(); // Convertir la chaîne de recherche en minuscules
      // Rechercher par missingPlace
      this.filteredPosts = this.allPosts.filter((post) =>
      post.missingPlace.toLowerCase().includes(searchTerm) // Convertir la chaîne de l'objet de l'article en minuscules
  );
  this.posts = [...this.filteredPosts];
  } else {
    this.posts = [...this.allPosts];
  }
}

  trialphabetique() {
    this.posts = [...this.posts.sort((a, b) => a.firstname.localeCompare(b.firstname))];
  }

  // Tri par date, les plus récentes d'abord
  tricroissant() {
    this.posts = [...this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())];
  }

  // Tri par date, les plus anciennes d'abord
  tridecroissant() {
    this.posts = [...this.posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())];
  }
}
