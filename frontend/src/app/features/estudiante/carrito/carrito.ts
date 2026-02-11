import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CheckCircle } from 'lucide-angular';
import { CarritoService } from '../../../core/services/carrito.service';
import { PedidoService } from '../../../core/services/pedido';
import { CarritoItem, CreatePedidoRequest } from '../../../shared/models/models';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ConfirmDialogComponent],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {
  readonly ShoppingCart = ShoppingCart;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  readonly Minus = Minus;
  readonly ArrowLeft = ArrowLeft;
  readonly CheckCircle = CheckCircle;

  cartItems: CarritoItem[] = [];
  loading: boolean = false;
  error: string = '';

  // Confirm dialog state
  showConfirmDialog = false;
  confirmDialogMessage = '';
  pendingAction: (() => void) | null = null;

  constructor(
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.carritoService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  updateQuantity(productoId: number, cantidad: number): void {
    this.carritoService.updateQuantity(productoId, cantidad);
  }

  removeItem(productoId: number): void {
    this.confirmDialogMessage = '¿Eliminar este producto del carrito?';
    this.pendingAction = () => {
      this.carritoService.removeFromCart(productoId);
      this.toastService.success('Producto eliminado del carrito');
    };
    this.showConfirmDialog = true;
  }

  getSubtotal(item: CarritoItem): number {
    return Number(item.producto.precio) * item.cantidad;
  }

  getTotal(): number {
    return this.carritoService.getTotal();
  }

  confirmarPedido(): void {
    if (this.cartItems.length === 0) {
      this.toastService.warning('El carrito está vacío');
      return;
    }

    this.confirmDialogMessage = '¿Confirmar pedido? Tu pedido será preparado una vez confirmado.';
    this.pendingAction = () => {
      this.procesarPedido();
    };
    this.showConfirmDialog = true;
  }

  procesarPedido(): void {
    this.loading = true;
    this.error = '';

    const pedidoData: CreatePedidoRequest = {
      items: this.cartItems.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
      })),
    };

    this.pedidoService.createPedido(pedidoData).subscribe({
      next: () => {
        // MENSAJE ESTRATEGICO: Pedido guardado, pero no mostramos historial
        this.toastService.success('¡Pedido enviado con éxito! (Historial no disponible en esta versión)');
        this.carritoService.clearCart();
        // Redirigimos al MENU porque "Mis Pedidos" no existe
        this.router.navigate(['/menu']);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al confirmar el pedido';
        this.toastService.error('Error al confirmar el pedido');
        console.error(err);
        this.loading = false;
      },
    });
  }

  onConfirmAction(): void {
    if (this.pendingAction) {
      this.pendingAction();
      this.pendingAction = null;
    }
    this.showConfirmDialog = false;
  }

  onCancelAction(): void {
    this.pendingAction = null;
    this.showConfirmDialog = false;
  }

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return 'https://via.placeholder.com/100x100?text=Sin+Imagen';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
  }
}
