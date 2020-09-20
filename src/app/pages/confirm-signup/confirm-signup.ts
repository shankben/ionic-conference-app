import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Repository from '../../repository';

@Component({
  selector: 'page-signup',
  templateUrl: 'confirm-signup.html',
  styleUrls: ['./confirm-signup.scss'],
})
export class ConfirmSignupPage {
  data = {
    username: '',
    code: ''
  };

  submitted = false;

  constructor(
    public router: Router,
    public repository: Repository
  ) { }

  async onConfirmSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      try {
        await this.repository.confirmSignup(this.data.username, this.data.code);
        this.router.navigateByUrl('/app/tabs/schedule');
      } catch (err) {
        // OK
      }
    }
  }
}
