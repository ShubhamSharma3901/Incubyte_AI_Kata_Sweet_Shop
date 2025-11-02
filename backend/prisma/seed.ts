import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });

    // Create sample sweets
    const sweets = [
        {
            name: 'Chocolate Truffle',
            category: 'Chocolate',
            price: 2.99,
            quantity: 50,
        },
        {
            name: 'Strawberry Gummy',
            category: 'Gummy',
            price: 1.49,
            quantity: 100,
        },
        {
            name: 'Vanilla Fudge',
            category: 'Fudge',
            price: 3.99,
            quantity: 25,
        },
    ];

    for (const sweet of sweets) {
        await prisma.sweet.upsert({
            where: { name: sweet.name },
            update: {},
            create: sweet,
        });
    }

    console.log('Database seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });