import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,RouterLink,RouterOutlet,RouterLinkActive,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  signInForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signInUser() {
    const value = this.signInForm.value;
    signInWithEmailAndPassword(this.auth, value.email, value.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Sign-in successful:', user);
        // التنقل إلى مكون AI Chat بعد تسجيل الدخول بنجاح
        this.router.navigate(['/video']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Sign-in error [${errorCode}]: ${errorMessage}`);
        // عرض رسالة تنبيه عند حدوث خطأ في تسجيل الدخول
        alert(`Sign-in failed: ${errorMessage}`);
      });
  }
  
}
