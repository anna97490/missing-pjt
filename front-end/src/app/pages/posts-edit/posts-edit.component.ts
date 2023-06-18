import { Component, Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  fileName: any;
  post: any;
  message: string = '';
  isDropdownVisible: boolean = false;
  selectedStatus: string = "";
  filteredCitiesArray: string[] = [];
  selectedCity: string = "";
  selectedMissingPlace: string = "";
  filteredMissingPlacesArray: string[] = [];
  isFieldsCorrect: boolean = false;
  isFile: boolean = false;
  errorMessage: boolean = false;
  errorFile: boolean = false;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private userService: UserService,
    private route      : ActivatedRoute,
    private datePipe   : DatePipe,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    public http: HttpClient
  ) {
    this.editPostForm = this.formBuilder.group({
      firstname   : ['', [Validators.minLength(2), Validators.maxLength(70)]],
      lastname    : ['', [Validators.minLength(2), Validators.maxLength(70)]],
      birthDate   : ['', []],
      address     : ['', [Validators.minLength(2), Validators.maxLength(70)]],
      missingPlace: ['', [Validators.minLength(2), Validators.maxLength(70)]],
      missingDate : ['', []],
      description : ['', [Validators.minLength(10), Validators.maxLength(300)]],
      status      : ['', []],
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
    console.log(this.isFile)
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

  filteredCities(value: string) {
    console.log(value)
    const filterValue = value.toLowerCase();
    this.http.get<any[]>(`https://geo.api.gouv.fr/communes?nom=${filterValue}&fields=nom&format=json&geometry=centre&limit=4`)
      .subscribe((response: any) => {
        console.log(response)
        this.filteredCitiesArray = response.slice(0, 3).map((city: any) => city.nom);
        console.log(this.filteredCitiesArray)
      }, (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des villes :', error);
      });
  }

  selectCity(city: string) {
    console.log('Ville sélectionnée:', city);
    this.selectedCity = city;
    this.filteredCitiesArray = [];
  }

  filteredMissingPlaces(value: string) {
    console.log(value);
    const filterValue = value.toLowerCase();
    this.http.get<any[]>(`https://geo.api.gouv.fr/communes?nom=${filterValue}&fields=nom&format=json&geometry=centre&limit=4`)
      .subscribe((response: any) => {
        console.log(response);
        this.filteredMissingPlacesArray = response.slice(0, 3).map((place: any) => place.nom);
        console.log(this.filteredMissingPlacesArray);
      }, (error) => {
        console.error('Une erreur s\'est produite lors de la récupération des lieux de disparition:', error);
      });
  }

  selectMissingPlace(missingPlace: string) {
    console.log('Lieu de disparition sélectionné:', missingPlace);
    this.selectedMissingPlace = missingPlace;
    this.filteredMissingPlacesArray = [];
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

  checkFields() {
    this.isFieldsCorrect = this.editPostForm.valid;
  }

  areFieldsValid() {
    return this.editPostForm.valid;
  }

  // File selected method
  onFileSelected(event: Event) {
    this.image = (event.target as HTMLInputElement).files![0];
    this.fileName  = document.getElementById('file-name');

    if (this.image) {
      this.isFile = true;
      this.fileName.innerHTML = this.image.name;
      console.log(2,this.isFile)
    }
  }

  // Edit post
  editPost(event: Event, postId: string) {
    event.preventDefault();
    postId = this.postId;
    this.editPostForm.get('address').value = this.selectedCity;
    this.editPostForm.get('missingPlace').value = this.selectedMissingPlace;

    if (this.userId === this.user._id && this.isFieldsCorrect === true ||
        this.userId === this.user._id && this.selectedStatus) {
      // Get datas from post
      let oldPost = {
        firstname: this.user.firstname,
        lastname : this.user.lastname,
        birthDate: this.user.birthDate,
        address  : this.user.address,
        missingPlace: this.user.missingPlace,
        missingDate : this.user.missingDate,
        description : this.user.description
      };

      const formValues = this.editPostForm.value;
      formValues.address = this.selectedCity;
      formValues.missingPlace = this.selectedMissingPlace;
      const nonEmptyValues = Object.fromEntries(
        Object.entries(formValues).filter(([key, value]) => value !== '')
      );

      // Update the updatedUser object with new datas
      oldPost = { ...oldPost, ...nonEmptyValues };

      this.postService.editPost(postId, oldPost)
      .subscribe(
        () => {
          this.post = oldPost;
          this.getPost();
        },
        (error) => {
          this.message = 'Une erreur est survenue lors de la modification du post';
        }
      );
    } else {
      this.errorMessage = true;
    }
  }

  // Update the picture of the post
  updatePostPicture(event: Event) {
    event.preventDefault();

    console.log(this.image)
    if (!this.image) {
      return;
    }
    if (this.isFile) {
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
    } else {
      this.errorFile = true;
    }

  }
}
