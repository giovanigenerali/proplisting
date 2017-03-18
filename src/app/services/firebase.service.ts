import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseService {
  listings: FirebaseListObservable<any[]>;
  listing: FirebaseObjectObservable<any>;
  folder: any;

  constructor(
    private af: AngularFire
  ) {
    this.folder = "listingimages";
  }

  getListings(userId) {
    this.listings = this.af.database.list('/listings/'+ userId) as FirebaseListObservable<Listing[]>
    return this.listings;
  }

  getListingDetails(userId, id) {
    this.listing = this.af.database.object('/listings/'+ userId +'/'+ id) as FirebaseObjectObservable<Listing>;
    return this.listing;
  }

  addListing(userId, listing) {
    let storageRef = firebase.storage().ref();
    let imageFile = (<HTMLInputElement>document.getElementById('image')).files[0];

    if (imageFile) {
      let rand = new Date().getTime();
      let path = `/${this.folder}/${userId}/${rand}_${imageFile.name}`;
      storageRef.child(path).put(imageFile).then((snapshot) => {
        listing.imagePath = path;
        this.getImageURL(path).then((url) => {
          listing.imageUrl = url;
          this.listings.push(listing);
        });
      });
    }

  }

  updateListing(userId, listing) {

    let storageRef = firebase.storage().ref();
    // get image file from input
    let imageFile = (<HTMLInputElement>document.getElementById('image')).files[0];    
    
    // if is a new image
    if (imageFile) {
      
      // delete existing image from firebase storage
      storageRef.child(listing.imagePath).delete();

      // add new image
      // create a rand
      let imgId = new Date().getTime();
      // define path by user to storage image
      let path = `/${this.folder}/${userId}/${imgId}_${imageFile.name}`;
      // create a reference from firebase storage
      let iRef = storageRef.child(path);
      
      // update listing with new imagePath and imageUrl
      iRef.put(imageFile).then((snapshot) => {
        // get new image url from firebase storage
        this.getImageURL(path).then((url) => {
          // define new path
          listing.imagePath = path;
          // define new url
          listing.imageUrl = url;
          // update listing
          this.listing.update(listing);
        });
      });

    } else {
      // update listing
      this.listing.update(listing);
    }
  }

  deleteListing(listing) {
    // remove image from firebase storage
    let storageRef = firebase.storage().ref();
    storageRef.child(listing.imagePath).delete();
    // remove listing from firebase database
    this.listing.remove();
  }
  
  getImageURL(path) {
    // get image url from firebase storage
    let storageRef = firebase.storage().ref();
    return storageRef.child(path).getDownloadURL();
  }

}

// listing interface
interface Listing {
  $key: string;
  title: string;
  city: string;
  owner: string;
  bedrooms: string;
  price: string;
  type: string;
  imagePath: string;
  imageUrl: string;
}