import { Component, OnInit, Input,  ChangeDetectorRef } from '@angular/core';
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
  private postId: any;
  posts: Post[] = [];
  allPosts: Post[] = [];
  comment: any;
  comments: any = Comment;
  commentArea: string = "";
  commentUpdated: any = '';
  areaForm: any;
  searchText: string = '';
  selection: string = '';
  selectionYear: number = 0;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService,
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

  // --------- Filter ---------
  // Filter posts by missingPlace
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

  // Filter posts by year of missingDate
  filterPostsByYear() {
    let checkbox = document.getElementById('checked-year') as HTMLInputElement;
    let postYear = 0;

    if (checkbox.checked && this.selectionYear) {
      this.allPosts = this.posts.filter(post => {
        postYear = new Date(post.missingDate).getFullYear();

        if (postYear === this.selectionYear) {
          const date = new Date(post.missingDate);
          const year = date.getFullYear().toString().substring(0, 4);
          console.log('year', year);
          return true;
        }

        return false;
      });

      this.posts = this.allPosts;
    } else {
      this.getPosts();
    }
  }

  // Filter posts by status "En cours"
  filterByEnCourStatus() {
    let checkbox = document.getElementById('checked-encours') as HTMLInputElement;

    if (checkbox.checked) {
      this.allPosts = this.posts.filter(post => post.status === 'En cours');
      this.posts = this.allPosts;
    } else {
      this.getPosts();
    }
  }

  // Filter posts by status "Retrouve"
  filterByRetrouveStatus() {
    let checkbox = document.getElementById('checked-retrouve') as HTMLInputElement;

    if (checkbox.checked) {
      this.allPosts = this.posts.filter(post => post.status === 'Retrouvé(e)');
      this.posts = this.allPosts;
    } else {
      this.getPosts();
    }
  }

  // Get posts
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

  // --------- Comments ---------
  // Add comment
  addComment(event: Event, postId: string) {
    event.preventDefault();

    if (this.isLoggedIn) {
      const commentString= this.areaForm.get('comment').value;

      this.posts.forEach(post => {
        if (postId === post._id) {
          let comment = {
            comment: commentString,
            userId: this.userId,
            postId: postId
          }

          this.commentService.addComment(comment)
          .subscribe(
            response => {
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
      confirm("Veuillez vous connecter ou vous inscrire.")
    }
  }

   // Get comments
   getComments() {
    this.commentService.getComments().subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
        comments.forEach(comment => {
          this.comment = comment;
        });
      },
      (error: any) => {
        console.error('An error occurred while retrieving the comments:', error);
      }
    );
  }

  // Edit comment
  editComment(event: Event, commentId: string) {
    event.preventDefault();
    const commentString = this.areaForm.get('commentUpdated').value;

    this.comments.forEach((comment: any) => {
      if (commentId === comment._id && commentString !== '') {
        let updatedComment = {
          _id: commentId,
          comment: commentString,
          userId: this.userId,
          postId: this.postId
        }

        this.commentService.editComment(updatedComment, commentId)
        .subscribe(
          response => {
            this.getComments();
            this.getPosts();
            this.areaForm.get('commentUpdated').setValue('');
            return this.comments;
          },
          error => {
            console.error('An error occurred while editing the comment:', error);
          }
        );
      }
    });
  }

  // Delete comment
  deleteComment(event: Event, commentId: string) {
    event.preventDefault();

    if (confirm("Souhaitez-vous supprimer votre commentaire?")) {
      this.commentService.deleteComment(commentId).subscribe(
        response => {
          this.getComments();
          this.getPosts();
          return this.comments;
        },
        error => {
          console.error('An error occurred while deleting the comment:', error);
        }
      );
    }
  }
}
