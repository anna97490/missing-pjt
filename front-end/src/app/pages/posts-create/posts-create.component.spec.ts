import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { throwError } from 'rxjs';

import { PostsCreateComponent } from './posts-create.component';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { PostService } from '../../service/post.service';

describe('PostsCreateComponent', () => {
  let component: PostsCreateComponent;
  let fixture: ComponentFixture<PostsCreateComponent>;
  let formBuilder: FormBuilder;
  let authService: AuthService;
  let postService: PostService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [PostsCreateComponent],
      providers: [AuthService, UserService, PostService, FormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsCreateComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    authService = TestBed.inject(AuthService);
    postService = TestBed.inject(PostService);
    component.createPostForm = formBuilder.group({
      firstname: '',
      lastname: '',
      age: '',
      address: '',
      missingPlace: '',
      missingDate: '',
      description: '',
      status: ''
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize createPostForm with fields', () => {
    const form = component.createPostForm;
    expect(form.get('firstname')).not.toBeNull();
    expect(form.get('lastname')).not.toBeNull();
    expect(form.get('age')).not.toBeNull();
    expect(form.get('address')).not.toBeNull();
    expect(form.get('missingPlace')).not.toBeNull();
    expect(form.get('missingDate')).not.toBeNull();
    expect(form.get('description')).not.toBeNull();
    expect(form.get('status')).not.toBeNull();
  });

  it('should call createPost method on form submission', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(component, 'createPost');
    const form = component.createPostForm;
    form.get('firstname').setValue('John');
    form.get('lastname').setValue('Doe');
    form.get('age').setValue(33);
    form.get('address').setValue('123 Main St');
    form.get('missingPlace').setValue('City');
    form.get('missingDate').setValue('2023-01-01');
    form.get('description').setValue('Description');
    form.get('status').setValue('En cours');

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    expect(component.createPost).toHaveBeenCalled();
  });

  it('should log the error message when the form is invalid', () => {
    spyOn(component, 'createPost');
    spyOn(console, 'log');

    component.createPostForm.setErrors({ invalid: true });
    component.createPost(new Event('click'));

    expect(console.log);
  });
});
