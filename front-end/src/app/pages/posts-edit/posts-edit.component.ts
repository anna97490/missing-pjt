import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Post } from 'src/app/models/Post.model';
import { User } from 'src/app/models/User.model';
import { UserService } from '../../service/user.service';
import { PostService } from '../../service/post.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-posts-edit',
  templateUrl: './posts-edit.component.html',
  styleUrls: ['./posts-edit.component.scss']
})
export class PostsEditComponent {
  isLoggedIn  : boolean = false;
  editPostForm: any = FormGroup;
  user        : any;
  userId      : any;
  postId      : any;
  isSend      : boolean = false;
  image       : any = File;
  fileInput   : any;
  fileName    : any;
  post        : any;
  message     : string = '';

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private userService: UserService,
    private route      : ActivatedRoute,
    private datePipe   : DatePipe,
    private formBuilder: FormBuilder,
  ) {
    this.editPostForm = this.formBuilder.group({
      firstname   : ['', [Validators.minLength(2), Validators.maxLength(70)]],
      lastname    : ['', [Validators.minLength(2), Validators.maxLength(70)]],
      birthDate   : ['', []],
      address     : ['', []],
      missingPlace: ['', [Validators.minLength(2), Validators.maxLength(70)]],
      missingDate : ['', []],
      description : ['', [Validators.minLength(2), Validators.maxLength(300)]],
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userId = this.authService.getDecryptedUserId();
    this.postId = this.route.snapshot.paramMap.get('id');
    // Get post
    if (this.isLoggedIn) {
      this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
        this.user = user;
      })
      this.postService.getPostById(this.postId).subscribe((post: Post) => {
        if (post) {
          this.post = post;
          // Birth date formated to age
          const birthDate = new Date(this.post.birthDate);
          const today = new Date();
          const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          this.post.age = age;
        }
      });
    }
  }

  // Function to pick date not after today's date
  validateDate(event: any) {
    const selectedDate = new Date(event.target.value);
    const now = Date.now();
    if (selectedDate.getTime() > now) {
      event.target.value = '';
    }
  }

  // File selected method
  onFileSelected(event: Event) {
    this.image = (event.target as HTMLInputElement).files![0];
    this.fileName  = document.getElementById('file-name');

    if (this.image) {
      this.fileName.innerHTML = this.image.name;
    }
  }

  // Edit post
  editPost(event: Event, postId: string) {
    event.preventDefault();
    postId = this.postId;

    if (this.editPostForm.valid  && this.userId === this.user._id) {
      let updatedPost = {
        firstname: this.post.firstname,
        lastname : this.post.lastname,
        birthDate: this.post.birthDate,
        missingPlace: this.post.missingPlace,
        missingDate : this.post.address,
        description  : this.post.description,
      };

      const formValues = this.editPostForm.value;
      const nonEmptyValues = Object.fromEntries(
        Object.entries(formValues).filter(([key, value]) => value !== '')
      );

      // Update the new object with new datas
      updatedPost = { ...updatedPost, ...nonEmptyValues };

      this.postService.editPost(postId, updatedPost).subscribe(
        () => {
          window.location.reload();
        },
        (error) => {
          this.message = 'Une erreur est survenue lors de la modification de vos informations';
        }
      );
    }
  }
}
