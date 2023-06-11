import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PostsCreateComponent } from './posts-create.component';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { PostService } from '../../service/post.service';

describe('PostsCreateComponent', () => {
  let component: PostsCreateComponent;
  let fixture: ComponentFixture<PostsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [PostsCreateComponent],
      providers: [AuthService, UserService, PostService, FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize createPostForm with required fields', () => {
    const form = component.createPostForm;
    expect(form.get('firstname')).not.toBeNull();
    expect(form.get('lastname')).not.toBeNull();
    expect(form.get('birthDate')).not.toBeNull();
    expect(form.get('address')).not.toBeNull();
    expect(form.get('missingPlace')).not.toBeNull();
    expect(form.get('missingDate')).not.toBeNull();
    expect(form.get('description')).not.toBeNull();
    expect(form.get('status')).not.toBeNull();
  });

  it('should call createPost method on form submission', () => {
    spyOn(component, 'createPost');
    const form = component.createPostForm;
    form.get('firstname')?.setValue('John');
    form.get('lastname')?.setValue('Doe');
    form.get('birthDate')?.setValue('1990-01-01');
    form.get('address')?.setValue('123 Main St');
    form.get('missingPlace')?.setValue('City');
    form.get('missingDate')?.setValue('2023-01-01');
    form.get('description')?.setValue('Description');
    form.get('status')?.setValue('Active');

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    expect(component.createPost).toHaveBeenCalled();
  });
});
