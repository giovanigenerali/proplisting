import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { FirebaseService } from "../../services/firebase.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any;

  constructor(
    public af: AngularFire,
    public flashMessage: FlashMessagesService,
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.af.auth.subscribe((user) => {
      if (user) {
        return this.user = {
          uid: user.uid,
          name: user.auth.displayName,
          email: user.auth.email,
          photoUrl: user.auth.photoURL,
          storageFolder: 'listingimages/'+ user.uid
        }
      }
    }, (error) => {
      console.log(error);
    });
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

  logout() {
    this.af.auth.logout().then(() => {
      this.user = null;
      this.flashMessage.show('You are logged out.', { 
        cssClass: 'alert-info', 
        timeout: 3000
      });
    });
  }

}
