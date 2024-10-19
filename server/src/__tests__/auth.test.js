const { registerUser, loginUser, getProfile } = require('../../controllers/authController');
const UserModel = require('../../models/users');
const jwt = require('jsonwebtoken');

// Mock the hashPassword and comparePassword functions
jest.mock('../../helpers/auth', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
  comparePassword: jest.fn().mockResolvedValue(true),
}));

describe('Authentication Functions', () => {
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const req = {
        body: { username: 'newuser@example.com', password: 'password123' }
      };
      const res = {
        json: jest.fn()
      };

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'USER REGISTERED SUCCESSFULLY',
        username: 'newuser@example.com'
      }));
    });

    it('should return error for existing user', async () => {
      const existingUser = new UserModel({ username: 'existing@example.com', password: 'password123' });
      await existingUser.save();

      const req = {
        body: { username: 'burnaboy@gmail.com', password: 'burnaboy' }
      };
      const res = {
        json: jest.fn()
      };

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'USER ALREADY EXISTS'
      }));
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const user = new UserModel({ username: 'testuser@example.com', password: 'hashedPassword' });
      await user.save();

      const req = {
        body: { username: 'testuser@example.com', password: 'password123' }
      };
      const res = {
        json: jest.fn(),
        cookie: jest.fn()
      };

      process.env.JWT_SECRET = 'testsecret';

      await loginUser(req, res);

      expect(res.cookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        username: 'testuser@example.com'
      }));
    });

    it('should return error for non-existent user', async () => {
      const req = {
        body: { username: 'nonexistent@example.com', password: 'password123' }
      };
      const res = {
        json: jest.fn()
      };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'USER NOT FOUND'
      }));
    });
  });

  describe('getProfile', () => {
    it('should return user profile for valid token', async () => {
      const user = { username: 'testuser@example.com', id: '123456' };
      const token = jwt.sign(user, 'testsecret');

      const req = {
        cookies: { token }
      };
      const res = {
        json: jest.fn()
      };

      process.env.JWT_SECRET = 'testsecret';

      await getProfile(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(user));
    });

    it('should return null for invalid token', async () => {
      const req = {
        cookies: {}
      };
      const res = {
        json: jest.fn()
      };

      await getProfile(req, res);

      expect(res.json).toHaveBeenCalledWith(null);
    });
  });
});