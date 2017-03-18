import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseService } from '../../services/firebase.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.component.html',
  styleUrls: ['./edit-listing.component.css']
})
export class EditListingComponent implements OnInit {
  userId: any;
  id: any;
  listing: any;
  listingSubscribe: any;
  
  imgReader: string;
  validImage: boolean;
  validSubmit: boolean;

  constructor(
    private af: AngularFire,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.imgReader = null;
    this.validImage = true;
    this.validSubmit = true;

    this.af.auth.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.listingSubscribe = this.firebaseService.getListingDetails(this.userId, this.id).subscribe(listing => {
          this.listing = listing;
        }, error => { 
          console.log(error);
        });
      } else {
        this.listingSubscribe.unsubscribe();
      }
    });
  }

  onEditSubmit() {
    this.firebaseService.updateListing(this.userId, this.listing);
    this.router.navigateByUrl('/listings/'+ this.id);
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

  goBack() {
    this.router.navigateByUrl('/listings/'+ this.id);
  }

}
