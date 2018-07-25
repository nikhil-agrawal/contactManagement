import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Contact} from '../model/contact';

@Injectable()
export class ContactsService {

  constructor(private http: HttpClient) { }

  public getContacts(): Promise<Contact[]> {
    return this.http.get('./assets/mockData/contacts.json')
      .toPromise()
      .then((response: any) => response.contacts as Contact[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
