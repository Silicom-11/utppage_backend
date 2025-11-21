const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    // Buscar token en cookie primero
    let token = null;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Si no está en cookie, buscar en header Authorization
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No autorizado - Token no proporcionado' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error.message);
    return res.status(401).json({ 
      success: false,
      message: 'Token inválido o expirado' 
    });
  }
};
