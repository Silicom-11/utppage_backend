const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Datos personales
  nombres: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  
  // Datos académicos
  codigoEstudiante: {
    type: String,
    required: true,
    unique: true,
    // Formato: U20201234
    match: /^U\d{8}$/
  },
  facultad: {
    type: String,
    required: true,
    enum: [
      'Facultad de Ciencias de la Salud',
      'Facultad de Ingeniería',
      'Facultad de Administración y Negocios',
      'Facultad de Derecho y Ciencias Políticas',
      'Facultad de Arquitectura y Diseño'
    ]
  },
  carrera: {
    type: String,
    required: true
  },
  ciclo: {
    type: Number,
    default: 1,
    min: 1,
    max: 12
  },
  
  // Datos adicionales
  telefono: {
    type: String,
    trim: true
  },
  fechaNacimiento: {
    type: Date
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  activo: {
    type: Boolean,
    default: true
  }
});

// Índices para búsquedas más rápidas
userSchema.index({ email: 1 });
userSchema.index({ codigoEstudiante: 1 });
userSchema.index({ facultad: 1, carrera: 1 });

module.exports = mongoose.model('User', userSchema);
