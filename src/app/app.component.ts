import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {ContactsService} from './services/contacts.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import {Contact} from './model/contact';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ContactsService]
})
export class AppComponent implements OnDestroy, OnInit {

  @ViewChild(DataTableDirective)
  public dtElement: DataTableDirective;
  public contacts: Contact[] = [];
  public dtOptions: DataTables.Settings = {
    stateSave: true
  };
  public contactForm: any;

  public dtTrigger: Subject<any> = new Subject();
  public isEdit = false;
  public editIndex: number;

  constructor(private contactService: ContactsService,
     private formBuilder: FormBuilder) {
      this.contactForm = this.formBuilder.group({
        'firstName': ['', Validators.required],
        'lastName': ['', Validators.required],
        'email': ['', [Validators.required]],
        'phoneNo': ['',Validators.required],
        'status': ['Active']
      });
     }

  
  ngOnInit() {
    this.contactService.getContacts().then( (resp) => {
      this.contacts = resp;
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public validatePhoneNo(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public addContact(): void {
    const contact = JSON.parse(JSON.stringify(this.contactForm.value));
    this.contacts.push(contact);
    this.clearForm();
    this.rerenderTable();
  }

  public editContact(index): void {
    this.isEdit = true;
    this.editIndex = index;
    this.contactForm.controls['firstName'].setValue(this.contacts[index].firstName);
    this.contactForm.controls['lastName'].setValue(this.contacts[index].lastName);
    this.contactForm.controls['email'].setValue(this.contacts[index].email);
    this.contactForm.controls['phoneNo'].setValue(this.contacts[index].phoneNo);
    this.contactForm.controls['status'].setValue(this.contacts[index].status);
  }

  public updateContact(): void {
    this.isEdit = false;
    const contact = JSON.parse(JSON.stringify(this.contactForm.value));
    this.contacts[this.editIndex] = contact;
    this.clearForm();
    this.rerenderTable();
  }

  public deleteContact(index): void {
    this.contacts.splice(index, 1);
    this.rerenderTable();
  }

  public rerenderTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  public clearForm(): void {
    this.isEdit = false;
    this.contactForm.controls['firstName'].setValue('');
    this.contactForm.controls['lastName'].setValue('');
    this.contactForm.controls['email'].setValue('');
    this.contactForm.controls['phoneNo'].setValue('');
    this.contactForm.controls['status'].setValue('Active');
  }

}
