import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/Post.model';
import { User } from '../../models/User.model';
import { Comment } from '../../models/Comment.model';
import { PostService } from '../../service/post.service';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { CommentService } from '../../service/comment.service';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-posts-index',
  templateUrl: './posts-index.component.html',
  styleUrls: ['./posts-index.component.scss']
})
export class PostsIndexComponent implements OnInit {
  @Input() modalOpen : boolean = false;
  isLoggedIn: boolean = true;
  user: any = User;
  userId: any;
  postId: any;
  posts: Post[] = [];
  allPosts: Post[] = [];
  comment: any;
  comments: Comment[] = [];
  commentArea: string = "";
  commentUpdated: any = '';
  areaForm: any;
  searchText: string = '';
  selection: string = '';
  selectionYear: number = 0;

  constructor(
    private authService: AuthService,
    public postService: PostService,
    public userService: UserService,
    public commentService: CommentService,
    private formBuilder: FormBuilder,
  ) {
    this.areaForm = this.formBuilder.group({
      comment: ['', []],
      commentUpdated: ['', []],
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userId = this.authService.getDecryptedUserId();
      // Get the user
      this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
        this.user = user;
      })
    }
    this.getPosts();
    this.getComments();
  }


  // Modal for non-connected or registered users
  openModal(event: Event) {
    event.preventDefault();
    this.modalOpen = true;
  }

  // -------------------------------------- Filters --------------------------------------------
  /**
  * Filter posts by missingPlace
  */
  filterPostsByMissingPlace() {
    const checkbox = document.getElementById('checked-missingPlace') as HTMLInputElement;

    if (checkbox.checked) {
      if (this.selection && this.selection !== '') {
        this.allPosts = this.posts.filter(post =>
          post.missingPlace.toLowerCase().includes(this.selection.toLowerCase())
        );
        this.posts = this.allPosts;
      }
    } else {
      this.getPosts();
    }
  }


  /**
  * Filter posts by year of missingDate
  */
  filterPostsByYear() {
    let checkbox = document.getElementById('checked-year') as HTMLInputElement;
    let postYear = 0;

    if (checkbox.checked && this.selectionYear) {
      this.allPosts = this.posts.filter(post => {
        postYear = new Date(post.missingDate).getFullYear();

        if (postYear === this.selectionYear) {
          const date = new Date(post.missingDate);
          const year = date.getFullYear().toString().substring(0, 4);
          return true;
        }

        return false;
      });

      this.posts = this.allPosts;
    } else {
      this.getPosts();
    }
  }


  /**
  * Filter posts by status "En cours"
  */
  filterByEnCourStatus() {
    let checkbox = document.getElementById('checked-encours') as HTMLInputElement;

    if (checkbox.checked) {
      this.allPosts = this.posts.filter(post => post.status === 'En cours');
      this.posts = this.allPosts;
    } else {
      this.getPosts();
    }
  }


  /**
  * Filter posts by status "Retrouve"
  */
  filterByRetrouveStatus() {
    let checkbox = document.getElementById('checked-retrouve') as HTMLInputElement;

    if (checkbox.checked) {
      this.allPosts = this.posts.filter(post => post.status === 'Retrouvé(e)');
      this.posts = this.allPosts;
    } else {
      this.getPosts();
    }
  }

  /**
  * Get the posts
  */
  getPosts() {
    this.postService.getPosts().subscribe(
      (posts: Post[]) => {
        this.posts = posts;
        this.posts = posts.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      },
      (error: any) => {
        console.error('An error occurred while retrieving the posts:', error);
      }
    );
  }


  // -------------------------------------- Comments --------------------------------------------
  /**
  * Add a comment to a post
  * @param event - The click event
  * @param postId - The ID of the post to add the comment to
  */
  addComment(event: Event, postId: string) {
    event.preventDefault();

    if (this.isLoggedIn) {
      const commentString = this.areaForm.get('comment').value;

      if (commentString.trim() === '') {
        alert('Veuillez saisir un commentaire.');
        return;
      }

      this.posts.forEach(post => {
        if (postId === post._id) {
          let comment = {
            comment: commentString,
            userId: this.userId,
            postId: postId
          };

          this.commentService.addComment(comment)
          .subscribe({
            next: (response: Comment) => {
              // Clear the textarea
              this.areaForm.get('comment').setValue('');
              this.getPosts();
              return this.posts;
            },
            error: (error: any) => {
              console.error('An error occurred while adding the comment:', error);
            }
          });
        }
      });
    } else {
      alert('Veuillez vous connecter ou vous inscrire.');
    }
  }


  /**
  * Get the comments
  */
  getComments() {
    this.commentService.getComments()
    .subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
      },
      error: (error: any) => {
        console.error('An error occurred while retrieving the comments:', error);
      }
    });
  }


  /**
  * Delete a comment
  * @param event - The click event
  * @param commentId - The ID of the comment to delete
  */
  deleteComment(event: Event, commentId: string) {
    event.preventDefault();

    if (confirm("Souhaitez-vous supprimer votre commentaire?")) { // add function getCommentById to check the userId
      this.commentService.deleteComment(this.userId, commentId)
      .subscribe({
        next: (response: any) => {
          this.getComments();
          this.getPosts();
          return this.comments;
        },
        error: (error: any) => {
          console.error('An error occurred while deleting the comment:', error);
        }
      });
    }
  }
}
