import { Component, Renderer2, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Post } from 'src/app/models/Post.model';
import { User } from 'src/app/models/User.model';
import { UserService } from '../../service/user.service';
import { PostService } from '../../service/post.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-posts-edit',
  templateUrl: './posts-edit.component.html',
  styleUrls: ['./posts-edit.component.scss']
})
export class PostsEditComponent {
  isLoggedIn: boolean = false;
  user: any = User;
  userId: any;
  postId: any;
  editPostForm: any = FormGroup;
  image: any = File;
  fileInput: any;
  fileName: any;
  post: any;
  message: string = '';
  isDropdownVisible: boolean = false;
  selectedStatus: string = "";

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private userService: UserService,
    private route      : ActivatedRoute,
    private datePipe   : DatePipe,
    private formBuilder: FormBuilder,
    private el: ElementRef
  ) {
    this.editPostForm = this.formBuilder.group({
      firstname   : ['', [Validators.minLength(2), Validators.maxLength(70)]],
      lastname    : ['', [Validators.minLength(2), Validators.maxLength(70)]],
      birthDate   : ['', []],
      address     : ['', []],
      missingPlace: ['', [Validators.minLength(2), Validators.maxLength(70)]],
      missingDate : ['', []],
      description : ['', [Validators.minLength(2), Validators.maxLength(300)]],
      status      : ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.userId = this.authService.getDecryptedUserId();
    this.postId = this.route.snapshot.paramMap.get('id');
    // Check if user is logged
    this.isLoggedIn = this.authService.isLoggedIn();
    // Get user
    this.user = this.userService.getUserById(this.userId).subscribe((user: User) => {
      this.user = user;
    });
    // Get post
    this.getPost();
  }

  getPost() {
    this.postService.getPostById(this.postId).subscribe((post: Post) => {
      if (post) {
        this.post = post;
        // Birth date formated to age
        const birthDate = new Date(this.post.birthDate);
        const today = new Date();
        const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        this.post.age = age;
      }
      return this.post;
    });
  }

  toggleDropdownMenu(event: Event): void {
    event.preventDefault();

    const dropdownMenu = this.el.nativeElement.querySelector('[dropdownMenu]');
    if (!this.isDropdownVisible) {
      dropdownMenu.classList.add('show');
    } else {
      dropdownMenu.classList.remove('show');
    }
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  onSelectStatus(status: string): void {
    this.editPostForm.get('status').setValue(status);
    this.selectedStatus = status;
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

    if (this.userId === this.user._id) {
      // Get datas from post
      let updatedPost = {
        firstname: this.user.firstname,
        lastname : this.user.lastname,
        birthDate: this.user.birthDate,
        address  : this.user.address,
        missingPlace: this.user.missingPlace,
        missingDate : this.user.missingDate,
        description : this.user.description
      };

      const formValues = this.editPostForm.value;
      const nonEmptyValues = Object.fromEntries(
        Object.entries(formValues).filter(([key, value]) => value !== '')
      );

      // Update the updatedUser object with new datas
      updatedPost = { ...updatedPost, ...nonEmptyValues };

      this.postService.editPost(postId, updatedPost)
      .subscribe(
        () => {
          this.post = updatedPost;
          this.getPost(); //----------------------------------------
          // window.location.reload();
        },
        (error) => {
          this.message = 'Une erreur est survenue lors de la modification du post';
        }
      );
    }
  }

  // Update the picture of the post
  updatePostPicture(event: Event) {
    event.preventDefault();

    if (!this.image) {
      return;
    }

    const formData = new FormData();
    formData.append('image', this.image, this.image.name);

    this.postService.updatePostPicture(formData, this.post._id)
    .subscribe(
      (post: Post) => {
        // Update user information with new profile picture
        this.post = post;
        this.getPost();
      },
      (error) => {
        this.message = 'Une erreur est survenue lors de la modification du post';
      }
    );
  }
}
