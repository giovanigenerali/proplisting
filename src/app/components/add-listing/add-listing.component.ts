import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseService } from '../../services/firebase.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css']
})
export class AddListingComponent implements OnInit {
  userId: any;

  title: string;
  city: string;
  owner: string;
  bedrooms: string;
  price: string;
  type: string;
  imageUrl: string;

  imgReader: string;
  validImage: boolean;
  validSubmit: boolean;

  constructor(
    private af: AngularFire,
    private firebaseServie: FirebaseService,
    private router: Router,
    public flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    this.af.auth.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      } else {
        this.userId = null;
      }
    });
    this.validImage = true;
    this.validSubmit = false;
  }

  onAddSubmit() {
    let listing = {
      title: this.title,
      city: this.city,
      owner: this.owner,
      bedrooms: this.bedrooms,
      price: this.price,
      type: this.type,
      imageUrl: this.imageUrl
    }
    this.firebaseServie.addListing(this.userId, listing);
    this.router.navigateByUrl('/listings');
  }

  verifyImg(image) {
    let img = image.files[0];
    let limitSize = 2 * 1024 * 1024;
    
    if (img) {
      if (img.size > limitSize) {
        this.validImage = false;
        this.validSubmit = false;
      } else {
        let reader = new FileReader();
        reader.onload = () => {
          this.imgReader = reader.result;
        }
        reader.readAsDataURL(img);
        this.validImage = true;
        this.validSubmit = true;
      }
    } else {
      this.imgReader = null;
      this.validImage = true;
      this.validSubmit = true;
    }
  }

}
