import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User.model';
import { Post } from 'src/app/models/Post.model';
import { PostService } from '../../service/post.service';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-missing',
  templateUrl: './card-missing.component.html',
  styleUrls: ['./card-missing.component.scss']
})

export class CardMissingComponent implements OnInit {
  @Input() post: any;
  isLoggedIn : boolean = false;
  userId     : any;
  user       : any;
  postId     : string = '';
  posts      : Post[] = [];
  element: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userId = this.authService.getDecryptedUserId();

    if (this.isLoggedIn) {
      // Get the user
      this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
        this.user = user;
      });
    }
    // Get all posts
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.posts.forEach(post => {
        this.postId = post._id;
      })
    });

    // Birth date formated to age
    const birthDate = new Date(this.post.birthDate);
    const today = new Date();
    const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    this.post.age = age;
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
  deletePost(event: Event, postId: string) {
    event.preventDefault();

    if (this.isLoggedIn && confirm("Êtes-vous sûr de vouloir supprimer cette fiche?")) {
      this.postService.deletePost(postId).subscribe(
        response => {
        window.location.reload();
      },
      (error) => {
        console.log(error)
      })
    }
  }
}
