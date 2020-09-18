import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { UserOptions } from '../../interfaces/user-options';

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
    public userData: UserData
  ) { }

  async onSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      try {
        await this.userData.signUp(this.userOptions);
        this.router.navigateByUrl('/confirm-signup');
      } catch (err) {
        // OK
      }
    }
  }
}
