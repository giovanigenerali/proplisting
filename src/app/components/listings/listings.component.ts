import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  listings: any;
  listingsSubscribe: any;

  constructor(
    private af: AngularFire,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.af.auth.subscribe((user) => {
      if (user) {
        this.listingsSubscribe = this.firebaseService.getListings(user.uid).subscribe(listings => {
          this.listings = listings;
        }, error => { 
          console.log(error);
        });
      } else {
        this.listingsSubscribe.unsubscribe();
      }
    });
  }

}