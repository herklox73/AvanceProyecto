import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding...');

    const products = [
        {
            nombre: 'Hamburguesa Completa',
            descripcion: 'Deliciosa hamburguesa con carne, huevo, queso, lechuga y tomate.',
            precio: 3.50,
            categoria: 'Comida',
            imagenUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww',
            disponible: true
        },
        {
            nombre: 'Hot Dog Especial',
            descripcion: 'Salchicha importada, tocino, queso cheddar y papas hilo.',
            precio: 2.50,
            categoria: 'Comida',
            imagenUrl: 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90JTIwZG9nfGVufDB8fDB8fHww',
            disponible: true
        },
        {
            nombre: 'Papas Fritas',
            descripcion: 'Porción de papas fritas crujientes con salsa de la casa.',
            precio: 1.50,
            categoria: 'Snack',
            imagenUrl: 'https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlbmNoJTIwZnJpZXN8ZW58MHx8MHx8fDA%3D',
            disponible: true
        },
        {
            nombre: 'Coca Cola 500ml',
            descripcion: 'Refrescante Coca Cola bien helada.',
            precio: 1.00,
            categoria: 'Bebida',
            imagenUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29jYSUyMGNvbGF8ZW58MHx8MHx8fDA%3D',
            disponible: true
        },
        {
            nombre: 'Jugo Natural',
            descripcion: 'Jugo de naranja natural recién exprimido.',
            precio: 1.25,
            categoria: 'Bebida',
            imagenUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b3JhbmdlJTIwanVpY2V8ZW58MHx8MHx8fDA%3D',
            disponible: true
        },
        {
            nombre: 'Sandwich de Pollo',
            descripcion: 'Sandwich con pechuga de pollo a la plancha.',
            precio: 2.75,
            categoria: 'Comida',
            imagenUrl: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMHNhbmR3aWNofGVufDB8fDB8fHww',
            disponible: true
        }
    ];

    for (const p of products) {
        const existing = await prisma.producto.findFirst({
            where: { nombre: p.nombre }
        });

        if (!existing) {
            await prisma.producto.create({
                data: p
            });
            console.log(`Created product: ${p.nombre}`);
        } else {
            console.log(`Product already exists: ${p.nombre}`);
        }
    }

    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
