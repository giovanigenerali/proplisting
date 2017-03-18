import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseService } from '../../services/firebase.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  id: any;
  listing: any;
  listingSubscribe: any;

  constructor(
    private af: AngularFire,
    private firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.af.auth.subscribe((user) => { 
      if (user) {
        this.listingSubscribe = this.firebaseService.getListingDetails(user.uid, this.id).subscribe(listing => {
          this.listing = listing;
        }, error => { 
          console.log(error);
        });
      } else {
        this.listingSubscribe.unsubscribe();
      }
    });
  }

  deleteListing() {
    this.firebaseService.deleteListing(this.listing);
    this.router.navigateByUrl('/listings');
  }

}
