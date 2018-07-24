import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContactsService} from './services/contacts.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ContactsService]
})
export class AppComponent implements OnDestroy, OnInit {

  public contacts: any = [];
  public dtOptions: DataTables.Settings = {};

  public dtTrigger: Subject<any> = new Subject();

  constructor(private contactService: ContactsService) {}

  ngOnInit() {
    this.contactService.getContacts().then( (resp) => {
      console.log(resp);
      this.contacts = resp.contacts;
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
