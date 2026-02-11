import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';


export const routes: Routes = [
  // Ruta por defecto
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  // Rutas de autenticación (públicas)
  {
    path: 'login',
    loadComponent: () =>
      import('../features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../features/auth/register/register').then((m) => m.Register),
  },

  // Rutas para estudiantes (protegidas)
  {
    path: '',
    loadComponent: () =>
      import('../shared/student-layout/student-layout').then(
        (m) => m.StudentLayout
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'menu',
        loadComponent: () =>
          import('../features/estudiante/menu/menu').then((m) => m.Menu),
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('../features/estudiante/carrito/carrito').then(
            (m) => m.Carrito
          ),
      },

      {
        path: 'perfil',
        loadComponent: () =>
          import('../features/perfil/perfil').then((m) => m.PerfilComponent),
      },
    ],
  },



  // Ruta 404
  {
    path: '**',
    redirectTo: '/login',
  },
];
