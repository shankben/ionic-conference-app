import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { UserOptions } from '../../interfaces/user-options';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
  styleUrls: ['./signin.scss'],
})
export class SignInPage {
  userOptions: UserOptions = {
    username: '',
    email: '',
    password: ''
  };

  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router
  ) {
    window.addEventListener('user:signin', () => {
      this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  onSignIn(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.userData.signIn(this.userOptions);
    }
  }

  onSignUp() {
    this.router.navigateByUrl('/signup');
  }
}
