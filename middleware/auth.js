// middleware/auth.js
function authMiddleware(req, res, next) {
  const userId = req.header('x-user-id'); // frontend must send this
  if (!userId) return res.status(401).json({ msg: 'No user ID provided' });
  req.user = { id: userId };
  next();
}

module.exports = { authMiddleware };
