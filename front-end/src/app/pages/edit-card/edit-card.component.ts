import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { PostService } from '../../service/post.service';
import { Post } from 'src/app/models/post.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector   : 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls  : ['./edit-card.component.scss']
})

export class EditCardComponent {
  isLoggedIn  : boolean = false;
  editPostForm: any = FormGroup;
  userId      : any;
  postId      : any;
  isSend      : boolean = false;
  image       : any = File;
  fileInput   : any;
  fileName    : any;
  post        : any;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private route      : ActivatedRoute,
    private router     : Router,
    private datePipe   : DatePipe,
    private formBuilder: FormBuilder,
  ) {
    this.editPostForm = this.formBuilder.group({
      firstname   : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      lastname    : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      birthDate   : ['', [Validators.required]],
      address     : ['', [Validators.required]],
      // image       : ['', [Validators.required]],
      missingPlace: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]],
      missingDate : ['', [Validators.required]],
      description : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.postId = this.route.snapshot.paramMap.get('id');
    // Get post
    if (this.isLoggedIn) {
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

  preventDefault(event: Event) {
    event.preventDefault();
  }

  validateDate(event: any) {
    const selectedDate = new Date(event.target.value);
    const now = Date.now();
    if (selectedDate.getTime() > now) {
      event.target.value = '';
    }
  }

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
    postId     = this.postId;
    const user = localStorage.getItem('userId');

    if (this.post.userId === user && postId === this.post._id) {

    }
  }
}


