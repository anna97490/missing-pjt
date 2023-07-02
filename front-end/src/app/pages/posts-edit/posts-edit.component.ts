import { Component, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    private formBuilder: FormBuilder,
    private el: ElementRef,
    public http: HttpClient
  ) {
    this.editPostForm = this.formBuilder.group({
      firstname   : ['', [Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[a-zA-Z]+$/)]],
      lastname    : ['', [Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[a-zA-Z]+$/)]],
      age         : ['', [Validators.min(1), Validators.max(105)]],
      address     : ['', [Validators.pattern(/^[a-zA-Z -]*$/)]],
      missingPlace: ['', [Validators.minLength(2), Validators.maxLength(70), Validators.pattern(/^[a-zA-Z -]*$/)]],
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
    this.getUser();
    // Get posts
    this.getPost();
  }

  /**
  Get the user by Id
  */
  getUser() {
    this.userService.getUserById(this.userId)
    .subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (error) => {
        console.error('An error occurred while getting user:', error);
      }
    });
  }

  /**
  * Get the post with the ID
  */
  getPost() {
    this.postService.getPostById(this.postId)
    .subscribe((post: Post) => {
      if (post) {
        this.post = post;
      }
      return this.post;
    });
  }


  /**
  * Fetches the cities
  * @param value - The value used to filter the cities
  */
  filteredCities(value: string) {
    const filterValue = value.toLowerCase();

    // Call the API with city value
    this.http.get<any[]>(`https://geo.api.gouv.fr/communes?nom=${filterValue}&fields=nom&format=json&geometry=centre&limit=4`)
    .subscribe({
      next: (response: any) => {
        // Limits only 4 results
        this.filteredCitiesArray = response.slice(0, 4).map((city: any) => city.nom);
      },
      error: (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des villes:', error);
      }
    });
  }


  /**
  * Selects a city from the filtered list
  * @param city - The selected city
  */
  selectCity(city: string) {
    this.selectedCity = city;
    this.filteredCitiesArray = [];
  }

  /**
  * Fetches the missing places
  * @param value - The value used to filter the missing places
  */
  filteredMissingPlaces(value: string) {
    const filterValue = value.toLowerCase();

    // Call the API with city value
    this.http.get<any[]>(`https://geo.api.gouv.fr/communes?nom=${filterValue}&fields=nom&format=json&geometry=centre&limit=4`)
    .subscribe({
      next: (response: any) => {
        // Limits only 4 results
        this.filteredMissingPlacesArray = response.slice(0, 4).map((place: any) => place.nom);
      },
      error: (error: any) => {
        console.error('Une erreur s\'est produite lors de la récupération des lieux de disparition:', error);
      }
    });
  }

  /**
  * Selects a missing place from the filtered list
  * @param missingPlace - The selected missing place
  */
  selectMissingPlace(missingPlace: string) {
    this.selectedMissingPlace = missingPlace;
    this.filteredMissingPlacesArray = [];
  }


  /**
  * Drop down the menu
  * @param event - Click event
  */
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


  /**
  * Select a status
  * @param status - Selected status
  */
  onSelectStatus(status: string): void {
    this.editPostForm.get('status').setValue(status);
    this.selectedStatus = status;
    this.isFieldsCorrect = true;
  }


  /**
  * Function to validate that the selected date is not after today's date
  * @param event - The date selection event
  */
  validateDate(event: any) {
    const selectedDate = new Date(event.target.value);
    const now = Date.now();
    if (selectedDate.getTime() > now) {
      event.target.value = '';
    }
  }


  /**
  * Check if the form fields are correct
  */
  checkFields() {
    this.isFieldsCorrect = this.editPostForm.valid;
  }


  /**
  * Method called when a file is selected
  * @param event - The file selection event
  */
  onFileSelected(event: Event) {
    this.image = (event.target as HTMLInputElement).files![0];
    this.fileName  = document.getElementById('file-name');

    if (this.image) {
      this.isFile = true;
      this.fileName.innerHTML = this.image.name;
    }
  }


  /**
  * Edit a post.
  * @param event - The click event
  * @param postId - The ID of the post to edit
  */
  editPost(event: Event, postId: string) {
    event.preventDefault();
    postId = this.postId;
    this.editPostForm.get('address').value = this.selectedCity;
    this.editPostForm.get('missingPlace').value = this.selectedMissingPlace;

    if (this.userId === this.user._id && this.isFieldsCorrect === true
      || this.user.status === 'admin' && this.isFieldsCorrect === true) {
      // Get datas from post
      let oldPost = {
        firstname: this.post.firstname,
        lastname : this.post.lastname,
        age: this.post.age,
        address  : this.post.address,
        missingPlace: this.post.missingPlace,
        missingDate : this.post.missingDate,
        description : this.post.description,
        status: this.post.status,
        userId: this.userId
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
      .subscribe({
        next: () => {
          this.post = oldPost;
          this.getPost();
        },
        error: (error) => {
          this.message = 'Une erreur est survenue lors de la modification du post';
        }
      });
    } else {
      this.errorMessage = true;
    }
  }


  /**
  * Update the picture of the post
  * @param event - The click event
  */
  updatePostPicture(event: Event) {
    event.preventDefault();

    if (!this.image) {
      return;
    }
    if (this.isFile && this.userId === this.user._id
      || this.isFile && this.user.status === 'admin') {
      const formData = new FormData();
      formData.append('image', this.image, this.image.name);
      formData.append('userId', this.user._id);

      this.postService.updatePostPicture(formData, this.post._id)
      .subscribe({
        next: (post: Post) => {
          // Update user informations with new profile picture
          this.post = post;
          this.getPost();
        },
        error: (error) => {
          this.message = 'Une erreur est survenue lors de la modification du post';
        }
      });
    } else {
      this.errorFile = true;
    }
  }
}
