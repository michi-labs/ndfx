import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public identityDelegation:
    | {
        delegations: { [key: string]: any };
        userPublicKey: string;
      }
    | undefined;

  constructor(private alertController: AlertController) {}

  public async openBrowser() {
    const browser = window.open(
      'http://127.0.0.1:8000/?canisterId=bkyz2-fmaaa-aaaaa-qaaaq-cai',
      '__blank'
    );
    window.addEventListener('message', (event) => {
      console.log({ event });
      if (event.data?.kind === 'authorize-client-success') {
        this.identityDelegation = {
          delegations: event.data.delegations,
          userPublicKey: event.data.userPublicKey,
        };

        console.log(this.identityDelegation);

        this.presentAlert(
          'Internet Identity',
          'You have successfully logged in'
        );

        browser?.close();
        // TODO: Remove listener
      }
    });
    // await Browser.open({
    //   url: 'http://127.0.0.1:8000/?canisterId=bkyz2-fmaaa-aaaaa-qaaaq-cai',
    //   windowName: 'myWindow',
    // });
    // Browser.addListener('browserFinished', () => {
    //   console.log('browser exited');
    //   this.presentAlert();
    // });
  }

  public closeBrowser() {
    Browser.close();
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message,
    });

    await alert.present();
  }
}
