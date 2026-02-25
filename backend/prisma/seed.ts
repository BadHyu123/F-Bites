import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const buyerPassword = await bcrypt.hash('buyer123', 10);
  const sellerPassword = await bcrypt.hash('seller123', 10);
  const trialPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@fbites.com',
      password: adminPassword,
      phone: '0900000001',
      role: 'ADMIN',
      isApproved: true,
    },
  });

  const buyer = await prisma.user.create({
    data: {
      name: 'Nguyễn Văn A',
      email: 'buyer@fbites.com',
      password: buyerPassword,
      phone: '0900000002',
      role: 'BUYER',
      isApproved: true,
    },
  });

  const seller1 = await prisma.user.create({
    data: {
      name: 'Cửa hàng Bánh mì Sài Gòn',
      email: 'seller1@fbites.com',
      password: sellerPassword,
      phone: '0900000003',
      role: 'SELLER',
      shopName: 'Bánh mì Sài Gòn',
      shopAddress: '123 Nguyễn Hue, Q1, TP.HCM',
      isApproved: true,
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      name: 'Quán Cơm Chiên An Phú',
      email: 'seller2@fbites.com',
      password: sellerPassword,
      phone: '0900000004',
      role: 'SELLER',
      shopName: 'Quán Cơm Chiên An Phú',
      shopAddress: '456 Tran Hung Dao, Q1, TP.HCM',
      isApproved: true,
    },
  });

  // Trial/testing accounts (quick-login buttons removed from UI)
  const trialAdmin = await prisma.user.create({
    data: {
      name: 'Admin (trial)',
      email: 'admin@test.com',
      password: trialPassword,
      phone: '0900000011',
      role: 'ADMIN',
      isApproved: true,
    },
  });

  const trialBuyer = await prisma.user.create({
    data: {
      name: 'Buyer (trial)',
      email: 'buyer@test.com',
      password: trialPassword,
      phone: '0900000012',
      role: 'BUYER',
      isApproved: true,
    },
  });

  const trialSeller = await prisma.user.create({
    data: {
      name: 'Seller (trial)',
      email: 'seller@test.com',
      password: trialPassword,
      phone: '0900000013',
      role: 'SELLER',
      shopName: 'Seller Demo',
      shopAddress: 'Demo address',
      isApproved: true,
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      name: 'Bánh mì thịt nạc',
      description: 'Bánh mì ngon, giá rẻ, còn 10 phần',
      originalPrice: 25000,
      discountedPrice: 18000,
      quantity: 10,
      category: 'Bánh mì',
      expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      image: 'https://via.placeholder.com/200?text=Banh+Mi',
      lat: 10.7746,
      lng: 106.7010,
      address: '123 Nguyen Hue, Q1, TP.HCM',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      sellerId: seller1.id,
      name: 'Bánh mì pâté',
      description: 'Bánh mì pâté tươi',
      originalPrice: 30000,
      discountedPrice: 20000,
      quantity: 5,
      category: 'Bánh mì',
      expiryTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      image: 'https://via.placeholder.com/200?text=Banh+Mi+Pate',
      lat: 10.7746,
      lng: 106.7010,
      address: '123 Nguyen Hue, Q1, TP.HCM',
    },
  });

  const product3 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      name: 'Cơm gà xối mỡ',
      description: 'Cơm gà xối mỡ Hong Kong style',
      originalPrice: 45000,
      discountedPrice: 35000,
      quantity: 8,
      category: 'Cơm',
      expiryTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
      image: 'https://via.placeholder.com/200?text=Com+Ga',
      lat: 10.7756,
      lng: 106.6990,
      address: '456 Tran Hung Dao, Q1, TP.HCM',
    },
  });

  const product4 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      name: 'Cơm tấm sườn cốt lết',
      description: 'Cơm tấm sườn nướng cấp',
      originalPrice: 40000,
      discountedPrice: 30000,
      quantity: 12,
      category: 'Cơm',
      expiryTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
      image: 'https://via.placeholder.com/200?text=Com+Tam',
      lat: 10.7756,
      lng: 106.6990,
      address: '456 Tran Hung Dao, Q1, TP.HCM',
    },
  });

  // Create sample order
  const order = await prisma.order.create({
    data: {
      buyerId: buyer.id,
      sellerId: seller1.id,
      total: 38000,
      shippingFee: 0,
      status: 'PENDING',
      type: 'PICKUP',
      pickupCode: 'QR-12345',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 2,
            price: 18000,
          },
        ],
      },
    },
  });

  // Create sample vouchers
  const voucher1 = await prisma.voucher.create({
    data: {
      code: 'WELCOME10',
      type: 'PERCENT',
      amount: 10,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 100,
    },
  });

  const voucher2 = await prisma.voucher.create({
    data: {
      code: 'FLAT5000',
      type: 'FIXED',
      amount: 5000,
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      usageLimit: 50,
    },
  });

  console.log('✅ Seeding completed!');
  console.log(`
📊 Created:
   - Admin: admin@fbites.com / admin123
   - Buyer: buyer@fbites.com / buyer123
   - Sellers: seller1@fbites.com, seller2@fbites.com / seller123
   - Products: ${product1.name}, ${product2.name}, ${product3.name}, ${product4.name}
   - Sample Order: ${order.id}
  `);
  console.log('\n🔑 Trial accounts (for local dev):');
  console.log('   - Admin: admin@test.com / 123456');
  console.log('   - Buyer: buyer@test.com / 123456');
  console.log('   - Seller: seller@test.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
