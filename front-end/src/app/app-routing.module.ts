import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SigninComponent } from './pages/signin/signin.component';
import { UserInfosComponent } from './pages/user-infos/user-infos.component';
import { AuthGuard } from './service/auth.guard';
import { PostsIndexComponent } from './pages/posts-index/posts-index.component';
import { PostsListComponent } from './pages/posts-list/posts-list.component';
import { PostsCreateComponent } from './pages/posts-create/posts-create.component';
import { PostsEditComponent } from './pages/posts-edit/posts-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'posts-index', component: PostsIndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'edit-post/:userId/:id', component: PostsEditComponent, canActivate: [AuthGuard] },
  { path: 'user-infos/:userId', component: UserInfosComponent, canActivate: [AuthGuard] },
  { path: 'create-post/:userId', component: PostsCreateComponent, canActivate: [AuthGuard] },
  { path: 'list-posts/:userId', component: PostsListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
