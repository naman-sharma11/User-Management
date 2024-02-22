import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    http: HttpClient = inject(HttpClient)
    subject = new Subject();
    editBtnSubject = new Subject();
    URL: string = 'http://127.0.0.1:8000/users/';

    getAllUsers() {
        console.log('Getting all users.');
        return this.http.get(this.URL)
    }

    deleteUsers(id: number) {
        console.log('Deleting user with id:', id);
        return this.http.delete(`${this.URL}${id}`)
    }

    createUser(values) {
        console.log('Creating User.');
        return this.http.post(this.URL, values);
    }

    updateUser(values, id) {
        console.log('Creating User.');
        return this.http.put(`${this.URL}${id}/`, values);
    }
}