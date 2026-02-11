import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  console.log('🔑 Interceptor ejecutado');
  console.log('Token:', token);
  console.log('URL:', req.url);

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    console.log('✅ Token agregado a headers');
    return next(cloned);
  }

  console.log('❌ No hay token');
  return next(req);
};
