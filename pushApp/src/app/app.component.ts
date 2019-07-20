import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private push: Push
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this._initializePushes();
    });
  }

  private _initializePushes() {
// to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }
      });

    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };
    
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('registration').subscribe((registration: any) => {
      console.log('__________Device registered: ID', registration.registrationId);
      if (registration.registrationId) {
        pushObject.unregister().then(result => {
          console.log('__________Unregistered token__________', result);
          const pushObjectNew: PushObject = this.push.init(options);
          pushObjectNew.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
          pushObjectNew.on('registration').subscribe((registrationNew: any) => {
            console.log('__________Device registered: ID', registrationNew.registrationId);
          });
          pushObjectNew.on('error').subscribe(error => console.error('Error with Push plugin', error));
        }).catch(() => {
          const pushObjectNew: PushObject = this.push.init(options);
          pushObjectNew.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
          pushObjectNew.on('registration').subscribe((registrationNew: any) => {
            console.log('__________Device registered: ID', registrationNew.registrationId);
          });
          pushObjectNew.on('error').subscribe(error => console.error('Error with Push plugin', error));
        });
      }
    });
  }
}
