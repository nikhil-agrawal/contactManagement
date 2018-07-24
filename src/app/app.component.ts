import {Component, OnInit} from '@angular/core';
import {ContactsService} from './services/contacts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ContactsService]
})
export class AppComponent implements OnInit {

  public contacts: any = [];

  constructor(private contactService: ContactsService) {}

  ngOnInit() {
    this.contactService.getContacts().then( (resp) => {
      console.log(resp);
      this.contacts = resp.contacts;
    });
  }
}
