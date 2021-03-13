import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignupComponent } from './signup/signup.component';
import { RegisterComponent } from './register/register.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CreateGarageComponent } from './create-garage/create-garage.component';
import { EditGarageComponent } from './edit-garage/edit-garage.component';
import { CreateSpaceComponent } from './create-space/create-space.component';
import { EditSpaceComponent } from './edit-space/edit-space.component';
import { BookParkingComponent } from './book-parking/book-parking.component';
import { AuthGuard } from './_helpers/auth.guard';
import { ReceiptComponent } from './receipt/receipt.component';
// import { ParkingmanagerComponent } from './parkingmanager/parkingmanager.component';

const adminModule = () =>
  import('src/app/admin/admin.module').then((x) => x.AdminModule);

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/home',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Log In'
    }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {
      title: 'Forgot Password'
    }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'Sign Up'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register'
    }
  },
  {
    path: 'edit-user',
    component: EditUserComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['Admin', 'User', 'ParkingManager', 'AllocationManager'],
      title: 'Edit User'
    }
  },
  {
    path: 'create-garage',
    canActivate: [AuthGuard],
    component: CreateGarageComponent,
    data: {
      roles: ['ParkingManager'],
      title: 'Create Garage'
    }
  },
  {
    path: 'edit-garage',
    canActivate: [AuthGuard],
    component: EditGarageComponent,
    data: {
      roles: ['ParkingManager'],
      title: 'Edit Garage'
    }
  },
  {
    path: 'create-space',
    canActivate: [AuthGuard],
    component: CreateSpaceComponent,
    data: {
      roles: ['AllocationManager'],
      title: 'Create Space'
    }
  },
  {
    path: 'edit-space/:id',
    canActivate: [AuthGuard],
    component: EditSpaceComponent,
    data: {
      roles: ['AllocationManager'],
      title: 'Edit Space'
    }
  },
  {
    path: 'book-parking',
    canActivate: [AuthGuard],
    component: BookParkingComponent,
    data: {
      roles: ['User'],
      title: 'Book Parking'
    }
  },
  {
    path: 'receipt',
    canActivate: [AuthGuard],
    component: ReceiptComponent,
    data: {
      roles: ['User'],
      title: 'Parking Receipt'
    }
  },
  // {
  //   path: 'parkingmanager',
  //   canActivate: [AuthGuard],
  //   component: ParkingmanagerComponent,
  //   data: {
  //     roles: ['ParkingManager'],
  //     title: 'Parking Manager'
  //   }
  // }Z
  { path: 'admin', loadChildren: adminModule }
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
