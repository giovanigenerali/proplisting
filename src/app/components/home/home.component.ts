import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public af: AngularFire,
    public flashMessage: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.af.auth.login().then((user) => {
      this.flashMessage.show('You are logged in.', { 
        cssClass: 'alert-success', 
        timeout: 3000
      });
      this.router.navigateByUrl('/listings');
    });
  }

}
