import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/connection';

const generateToken = (user: { id: string, email: string, role: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'supersecretjwtkey',
    { expiresIn: '24h' }
  );
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: (error as Error).message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const assignedRole = role || 'user';

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, passwordHash, assignedRole]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: (error as Error).message });
  }
};
