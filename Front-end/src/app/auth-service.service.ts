import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
 // هنا يمكنك إضافة منطق التحقق من تسجيل الدخول (مثل التحقق من توكن أو حالة الجلسة)
 isAuthenticated(): boolean {
  // استبدل هذا المنطق بما يتناسب مع كيفية التحقق من حالة تسجيل الدخول في تطبيقك
  return !!localStorage.getItem('authToken');
}
}
