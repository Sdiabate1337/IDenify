// app/Controllers/Http/AuthController.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'your-secret-key'; // Ideally, store this in environment variables

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password']) as RegisterRequest;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create user in the database
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return response.json(user);
    } catch (error) {
      return response.status(500).json({ error: 'User registration failed' });
    }
  }

  public async login({ request, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password']) as LoginRequest;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      // Verify user and password
      if (user && (await bcrypt.compare(password, user.password))) {
        // Generate JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return response.json({ token });
      }

      return response.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
      return response.status(500).json({ error: 'User login failed' });
    }
  }
}

export default AuthController;
