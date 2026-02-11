import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CarritoItem, Producto } from '../../shared/models/models';
import { AuthService } from './auth';

@Injectable({
    providedIn: 'root',
})
export class CarritoService {
    private readonly BASE_STORAGE_KEY = 'bar-escolar-carrito';
    private cartItemsSubject = new BehaviorSubject<CarritoItem[]>([]);
    public cartItems$ = this.cartItemsSubject.asObservable();

    constructor(private authService: AuthService) {
        // Suscribirse a cambios de usuario para cargar el carrito correcto
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.cartItemsSubject.next(this.loadFromStorage(user.id.toString()));
            } else {
                this.cartItemsSubject.next([]);
            }
        });
    }

    private getStorageKey(userId: string): string {
        return `${this.BASE_STORAGE_KEY}-${userId}`;
    }

    private loadFromStorage(userId: string): CarritoItem[] {
        const stored = localStorage.getItem(this.getStorageKey(userId));
        return stored ? JSON.parse(stored) : [];
    }

    private saveToStorage(items: CarritoItem[]): void {
        const user = this.authService.getCurrentUser();
        if (user) {
            localStorage.setItem(this.getStorageKey(user.id.toString()), JSON.stringify(items));
        }
        this.cartItemsSubject.next(items);
    }

    getCartItems(): CarritoItem[] {
        return this.cartItemsSubject.value;
    }

    addToCart(producto: Producto, cantidad: number = 1): void {
        const currentItems = this.getCartItems();
        const existingItem = currentItems.find(
            (item) => item.producto.id === producto.id
        );

        if (existingItem) {
            existingItem.cantidad += cantidad;
        } else {
            currentItems.push({ producto, cantidad });
        }

        this.saveToStorage(currentItems);
    }

    updateQuantity(productoId: number, cantidad: number): void {
        const currentItems = this.getCartItems();
        const item = currentItems.find((i) => i.producto.id === productoId);

        if (item) {
            if (cantidad <= 0) {
                this.removeFromCart(productoId);
            } else {
                item.cantidad = cantidad;
                this.saveToStorage(currentItems);
            }
        }
    }

    removeFromCart(productoId: number): void {
        const currentItems = this.getCartItems().filter(
            (item) => item.producto.id !== productoId
        );
        this.saveToStorage(currentItems);
    }

    clearCart(): void {
        this.saveToStorage([]);
    }

    getTotal(): number {
        return this.getCartItems().reduce(
            (total, item) => total + item.producto.precio * item.cantidad,
            0
        );
    }

    getItemCount(): number {
        return this.getCartItems().reduce(
            (count, item) => count + item.cantidad,
            0
        );
    }
}
