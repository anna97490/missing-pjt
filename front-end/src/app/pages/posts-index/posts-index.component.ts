import { Component, OnInit, Input } from '@angular/core';
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
  token: any;
  isLoggedIn: boolean = true;
  posts: Post[] = [];
  postId: any;
  userId: any;
  allPosts: Post[] = [];
  isComment: boolean = false;
  comment: any;
  comments: any = Comment;
  commentArea: string = "";
  commentUpdated: any = '';
  searchText: string = '';
  areaForm: any;

  selection :any;
  selectedPlace: string = "";
  selectedDate: any;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService,
    private formBuilder: FormBuilder,
  ) {
    this.areaForm = this.formBuilder.group({
      comment: ['', []],
      commentUpdated: ['', []],
    });
  }

  ngOnInit() {
    this.token = this.authService.getAuthToken();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userId = this.authService.getDecryptedUserId();
    this.getPosts();
    // Get all comments
    this.commentService.getComments().subscribe((comments: Comment[]) => {
      this.comments = comments;
      comments.forEach(comment => {
        this.comment = comment;
      })
    });
  }

  // Get posts
  getPosts() {
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.posts = posts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });
  }

  // Modal for non-connected or registered users
  openModal(event: Event) {
    event.preventDefault();
    this.modalOpen = true;
  }

  addComment(event: Event, postId: string, commentArea: string) {
    event.preventDefault();
    const commentString= this.areaForm.get('comment').value;

    this.posts.forEach(post => {
      if (postId === post._id) {
        let comment = {
          comment: commentString,
          userId: this.userId,
          postId: postId
        }

        this.commentService.addComment(comment).subscribe(response => {
          console.log(response)
          window.location.reload();
        });
      }
    });
  }

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

        this.commentService.editComment(updatedComment, commentId).subscribe(response => {
          console.log(response)
          window.location.reload();
        });
      }
    })
  }

  deleteComment(event: Event, commentId: string) {
    event.preventDefault();
    console.log(commentId)

    if (confirm("Êtes-vous sûr de vouloir supprimer votre commentaire?")) {
      this.commentService.deleteComment(commentId).subscribe(response => {
        console.log(response)
        window.location.reload();
      });
    }
  }


  // Function for search bar
  onSearch() {

  }

  // Reset filters method
  onResetFilters() {
    this.posts = [...this.allPosts];
  }
}
