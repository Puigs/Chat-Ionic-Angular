import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastController } from '@ionic/angular';
import { Validators , FormControl , FormArray } from '@angular/forms';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {
  message = '';
  messages = [];
  currentUser = '';
  data: FormGroup;
  check : Boolean = false;
 
  constructor(private socket: Socket, private toastCtrl: ToastController, private formBuilder: FormBuilder) { }
 
  ngOnInit() {
    this.data = new FormGroup({
      pseudo: new FormControl('', Validators.required)
    })
  }
  
  initServer() {
    this.check = true;
    this.socket.connect();
  
    let name = this.data.value.pseudo;
    this.currentUser = name;
    
    this.socket.emit('set-name', name);
  
    this.socket.fromEvent('users-changed').subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
  
    this.socket.fromEvent('message').subscribe(message => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    this.socket.emit('send-message', { text: this.message });
    this.message = '';
  }
 
  ionViewWillLeave() {
    this.socket.disconnect();
  }
 
  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}