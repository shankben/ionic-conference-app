import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tutorial',
    pathMatch: 'full',
  },
  {
    path: 'app',
    loadChildren: async () =>
      (await import('./pages/tabs-page/tabs-page.module'))
      .TabsModule
  },
  {
    path: 'account',
    loadChildren: async () =>
      (await import('./pages/account/account.module'))
      .AccountModule
  },
  {
    path: 'support',
    loadChildren: async () =>
      (await import('./pages/support/support.module'))
      .SupportModule
  },
  {
    path: 'signin',
    loadChildren: async () =>
      (await import('./pages/signin/signin.module'))
      .SignInModule
  },
  {
    path: 'signup',
    loadChildren: async () =>
      (await import('./pages/signup/signup.module'))
      .SignUpModule
  },
  {
    path: 'confirm-signup',
    loadChildren: async () =>
      (await import('./pages/confirm-signup/confirm-signup.module'))
      .ConfirmSignUpModule
  },
  {
    path: 'tutorial',
    loadChildren: async () =>
      (await import('./pages/tutorial/tutorial.module'))
      .TutorialModule,
    canLoad: [CheckTutorial]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
