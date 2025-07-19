const jwt = require('jsonwebtoken');
const authenticate = require('../utils/AuthMiddleware.js');

process.env.JWT_SECRET = 'test_secret_key';

describe('Authentication Middleware', () => {
  const mockUser = { id: 1, role: 'volunteer' };
  const token = jwt.sign(mockUser, process.env.JWT_SECRET, { expiresIn: '1h' });

  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('should call next() and attach user to req if token is valid', () => {
    req.headers.authorization = `Bearer ${token}`;

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject(mockUser);
  });

  test('should return 401 if no Authorization header is present', () => {
    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Missing or invlaid authorization header.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if Authorization header format is invalid', () => {
    req.headers.authorization = `Token ${token}`;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Missing or invlaid authorization header.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 403 if token is invalid or expired', () => {
    req.headers.authorization = `Bearer invalidtoken`;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token.'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
