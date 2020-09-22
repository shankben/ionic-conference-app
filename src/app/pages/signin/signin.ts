import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import Repository from '../../repository';
import { UserOptions } from '../../models';

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
    public repository: Repository,
    public router: Router
  ) {
    window.addEventListener('user:signin', () => {
      this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  onSignIn(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.repository.signIn(this.userOptions);
    }
  }

  onSignUp() {
    this.router.navigateByUrl('/signup');
  }
}
