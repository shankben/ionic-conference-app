import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmSignupPage } from './confirm-signup';

const routes: Routes = [
  {
    path: '',
    component: ConfirmSignupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmSignupPageRoutingModule { }
