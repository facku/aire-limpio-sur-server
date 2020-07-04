const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  const token = req.headers.token || false;

  try {
    const validToken = jwt.verify(token, process.env.JWT_SEED);
    req.tokenData = { ...validToken };
    return next();
  } catch (error) {
    switch (error.message) {
      case 'jwt expired':
        error.message = 'Su sesión ha expirado';
        break;
      default:
        error.message = 'token invalido';
        break;
    }
    return res.status(401).json({ ok: false, error: error.message });
  }
}

function checkAdmin(req, res, next) {
  if (req.tokenData.user.role !== 'Admin') {
    return res
      .status(401)
      .json({
        ok: false,
        error: 'Ud no tiene privilegios para realizar esta acción',
      });
  }
  next();
}

module.exports = {
  checkToken,
  checkAdmin,
};
