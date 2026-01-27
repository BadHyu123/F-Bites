
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema validate cho đăng ký
const registerSchema = z.object({
  name: z.string().min(2, "Tên quá ngắn"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  phone: z.string().optional(),
  role: z.enum(['BUYER', 'SELLER', 'ADMIN']).default('BUYER'),
  shopName: z.string().optional(),
  shopAddress: z.string().optional(),
});

// Tạo JWT chứa ID và Role
const generateToken = (id: string, role: string) => {
  return jwt.sign(
    { id, role }, 
    process.env.JWT_SECRET || 'fbites_secret_key_2025', 
    { expiresIn: '30d' }
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate dữ liệu
    const validatedData = registerSchema.parse(req.body);
    const { email, password, role } = validatedData;

    // 2. Kiểm tra email tồn tại
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email này đã được sử dụng' });
    }

    // 3. Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Tạo người dùng mới
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        // Seller đăng ký mới mặc định chưa được duyệt
        isApproved: role === 'SELLER' ? false : true,
      },
    });

    // 5. Trả về thông tin và Token
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống khi đăng ký' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Tìm user
    const user = await prisma.user.findUnique({ where: { email } });

    // 2. Kiểm tra mật khẩu
    if (user && (await bcrypt.compare(password, user.password))) {
      // 3. Trả về Token kèm theo Role
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        isApproved: user.isApproved,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi hệ thống khi đăng nhập' });
  }
};
