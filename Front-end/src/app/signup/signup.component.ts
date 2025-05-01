/*
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Database, set, ref } from '@angular/fire/database';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,RouterOutlet, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, public auth: Auth, public database: Database) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  registerUser() {
    if (this.signUpForm.valid) {
      const { email, password } = this.signUpForm.value;
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          set(ref(this.database, 'users/' + user.uid), {
            email: email,

          });
          alert('User created');
        })
        .catch((error) => {
          alert('Error: ' + error.message);
        });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}

*/
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Database, set, ref } from '@angular/fire/database';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterOutlet, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, public auth: Auth, public database: Database) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]], // Validates a phone number with 10-15 digits
      address: ['', Validators.required], // Address field as required
    });
  }

  registerUser() {
    if (this.signUpForm.valid) {
      const { email, password, phoneNumber, address } = this.signUpForm.value;
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          set(ref(this.database, 'users/' + user.uid), {
            email: email,
            phoneNumber: phoneNumber,
            address: address,
          });
          alert('User created');
        })
        .catch((error) => {
          alert('Error: ' + error.message);
        });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}



