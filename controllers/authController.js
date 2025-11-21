const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 📝 Registro de nuevo estudiante
exports.register = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      email,
      password,
      codigoEstudiante,
      facultad,
      carrera,
      ciclo,
      telefono,
      fechaNacimiento
    } = req.body;

    // Validar campos requeridos
    if (!nombres || !apellidos || !email || !password || !codigoEstudiante || !facultad || !carrera) {
      return res.status(400).json({ 
        success: false,
        message: 'Todos los campos obligatorios deben ser completados' 
      });
    }

    // Validar formato de código de estudiante
    const codigoRegex = /^U\d{8}$/;
    if (!codigoRegex.test(codigoEstudiante)) {
      return res.status(400).json({ 
        success: false,
        message: 'Código de estudiante inválido. Formato: U20201234' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Email inválido' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      $or: [{ email }, { codigoEstudiante }] 
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ 
          success: false,
          message: 'El email ya está registrado' 
        });
      }
      if (existingUser.codigoEstudiante === codigoEstudiante) {
        return res.status(400).json({ 
          success: false,
          message: 'El código de estudiante ya está registrado' 
        });
      }
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      nombres,
      apellidos,
      email,
      password: hashedPassword,
      codigoEstudiante,
      facultad,
      carrera,
      ciclo: ciclo || 1,
      telefono,
      fechaNacimiento
    });

    await newUser.save();

    console.log('✅ Nuevo estudiante registrado:', codigoEstudiante);

    res.status(201).json({ 
      success: true,
      message: 'Estudiante registrado exitosamente',
      data: {
        id: newUser._id,
        nombres: newUser.nombres,
        apellidos: newUser.apellidos,
        email: newUser.email,
        codigoEstudiante: newUser.codigoEstudiante,
        facultad: newUser.facultad,
        carrera: newUser.carrera
      }
    });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor al registrar estudiante' 
    });
  }
};

// 🔐 Login de estudiante
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar si está activo
    if (!user.activo) {
      return res.status(403).json({ 
        success: false,
        message: 'Cuenta inactiva. Contacta con administración' 
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Contraseña incorrecta' 
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        codigoEstudiante: user.codigoEstudiante
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Actualizar última conexión
    user.lastLogin = new Date();
    await user.save();

    console.log('✅ Login exitoso:', user.codigoEstudiante);

    // Enviar respuesta con token
    res.status(200).json({ 
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        codigoEstudiante: user.codigoEstudiante,
        facultad: user.facultad,
        carrera: user.carrera,
        ciclo: user.ciclo
      }
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor al iniciar sesión' 
    });
  }
};

// 👤 Obtener perfil de usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    res.status(200).json({ 
      success: true,
      user 
    });
  } catch (err) {
    console.error('❌ Error al obtener perfil:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor' 
    });
  }
};

// 🔄 Verificar token
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    res.status(200).json({ 
      success: true,
      valid: true,
      user: {
        id: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        codigoEstudiante: user.codigoEstudiante,
        facultad: user.facultad,
        carrera: user.carrera,
        ciclo: user.ciclo
      }
    });
  } catch (err) {
    console.error('❌ Error al verificar token:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor' 
    });
  }
};
