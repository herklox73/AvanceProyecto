// Usuario
export interface User {
  id: number;
  email: string;
  nombre: string;
  cedula?: string;
  imagenUrl?: string;
  role: 'ESTUDIANTE' | 'ADMIN_BAR';
  createdAt?: string;
}

// Login/Register
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  cedula: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Producto
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
  disponible: boolean;
  categoria: string;
  createdAt?: string;
  updatedAt?: string;
}

// Pedido
export interface Pedido {
  id: number;
  userId: number;
  fechaPedido: string;
  estado: EstadoPedido;
  total: number;
  observaciones?: string;
  user?: {
    nombre: string;
    email: string;
  };
  items: PedidoItem[];
}

export interface PedidoItem {
  id: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto: Producto;
}

export type EstadoPedido =
  | 'PENDIENTE'
  | 'EN_PREPARACION'
  | 'LISTO'
  | 'ENTREGADO'
  | 'CANCELADO';

// Crear Pedido
export interface CreatePedidoRequest {
  items: {
    productoId: number;
    cantidad: number;
  }[];
  observaciones?: string;
}

// Carrito (local)
export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}
