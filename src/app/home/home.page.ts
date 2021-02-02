import {HttpClient} from '@angular/common/http';
import { Component } from '@angular/core';
import { $ } from 'protractor';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

const { Network } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  apiData : any;
  limit = 10;

  constructor(private http: HttpClient, public alertController: AlertController, private toastController: ToastController) {}

  async showOffline(message: string) {
    const toast = await this.toastController.create({
      message: message,
      // duration: 2000
      buttons: [
        {

          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]

    });
    toast.present();
  }
  doRefresh(event) {
    console.log('Begin async operation');
    this.limit += 2;
    this.getData(event);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  getData(event = undefined) {
    const URL = "https://picsum.photos/v2/list?limit=" + this.limit;
    this.http.get(URL).subscribe((data) => {
      this.apiData = data;
      this.apiData.reverse();
      if (event) event.target.complete();

      console.log('Données récupérées:', data);
    });
  }

  ionViewWillEnter() {
    this.getData();
    let handler = Network.addListener('networkStatusChange', (status) => {
      if (!status.connected) {
        // alert("Warning ! This app need network connection");
      }
      const message = !status.connected ? "Warning! You are offline" : "You are online";
      this.showOffline(message);
      console.log("Network status changed", status);
    });
  }
}