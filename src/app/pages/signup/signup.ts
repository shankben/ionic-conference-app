import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Repository from '../../repository';
import { UserOptions } from '../../models';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  userOptions: UserOptions = {
    username: '',
    email: '',
    password: ''
  };

  submitted = false;

  constructor(
    public router: Router,
    public repository: Repository
  ) { }

  async onSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      try {
        await this.repository.signUp(this.userOptions);
        this.router.navigateByUrl('/confirm-signup');
      } catch (err) {
        // OK
      }
    }
  }
}
