import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Post } from '../../models/Post.model';
import { Comment } from '../../models/Comment.model';
import { PostService } from '../../service/post.service';
import { AuthService } from '../../service/auth.service';
import { CommentService } from '../../service/comment.service';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-posts-index',
  templateUrl: './posts-index.component.html',
  styleUrls: ['./posts-index.component.scss']
})
export class PostsIndexComponent implements OnInit {
  @Input() modalOpen : boolean = false;
  isLoggedIn: boolean = true;
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
    public commentService: CommentService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.areaForm = this.formBuilder.group({
      comment: ['', []],
      commentUpdated: ['', []],
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userId = this.authService.getDecryptedUserId();
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

          this.commentService.addComment(comment).subscribe(
            response => {
              // Clear the textarea
              this.areaForm.get('comment').setValue('');
              this.getPosts();
              return this.posts;
            },
            error => {
              console.error('An error occurred while adding the comment:', error);
            }
          );
        }
      });
    } else {
      alert('Veuillez vous connecter ou vous inscrire.');
    }
  }


  /**
  * Retrieve comments from the server
  */
  getComments() {
    this.commentService.getComments().subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
      },
      (error: any) => {
        console.error('An error occurred while retrieving the comments:', error);
      }
    );
  }


  /**
  * Edit a comment
  * @param event - The click event
  * @param commentId - The ID of the comment to edit
  */
  editComment(event: Event, commentId: string) {
    event.preventDefault();
    const commentString = this.areaForm.get('commentUpdated').value;

    const index = this.comments.findIndex((comment: any) => comment._id === commentId);

    if (index !== -1 && commentString !== '') {
      let updatedComment = {
        _id: commentId,
        comment: commentString,
        userId: this.userId,
        postId: this.postId
      }

      this.commentService.editComment(updatedComment, commentId)
      .subscribe({
        next: (response: any) => {
          this.getComments();
        },
        error: (error: any) => {
          console.error('An error occurred while editing the comment:', error);
        }
      });
    }
  }


  /**
  * Delete a comment
  * @param event - The click event
  * @param commentId - The ID of the comment to delete
  */
  deleteComment(event: Event, commentId: string) {
    event.preventDefault();

    if (confirm("Souhaitez-vous supprimer votre commentaire?")) {
      this.commentService.deleteComment(commentId)
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

  /**
   * Filter comments by date
   */
  sortCommentsByDate() {
    this.posts.forEach(post => {
      post.comments.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    });
  }
}
