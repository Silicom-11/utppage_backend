const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'utp_portal_db',
})
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión:', err));

// Schema del usuario
const userSchema = new mongoose.Schema({
  nombres: { type: String, required: true, trim: true },
  apellidos: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  codigoEstudiante: { type: String, required: true, unique: true, match: /^U\d{8}$/ },
  facultad: { type: String, required: true },
  carrera: { type: String, required: true },
  ciclo: { type: Number, default: 1, min: 1, max: 12 },
  telefono: { type: String, trim: true },
  fechaNacimiento: { type: Date },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  activo: { type: Boolean, default: true }
});

userSchema.index({ facultad: 1, carrera: 1 });

const User = mongoose.model('User', userSchema);

// Nombres y apellidos peruanos comunes
const nombres = [
  'Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Juan', 'Rosa', 'Pedro', 'Isabel',
  'Jorge', 'Patricia', 'Miguel', 'Laura', 'Roberto', 'Sofia', 'Ricardo', 'Gabriela', 'Fernando', 'Daniela',
  'Diego', 'Valentina', 'Andrés', 'Camila', 'Manuel', 'Paula', 'Alberto', 'Andrea', 'Eduardo', 'Lucía',
  'Rafael', 'Natalia', 'Javier', 'Marina', 'Oscar', 'Elena', 'Raúl', 'Victoria', 'Sergio', 'Adriana',
  'Arturo', 'Alejandra', 'Héctor', 'Beatriz', 'Pablo', 'Cecilia', 'Marcos', 'Claudia', 'Rubén', 'Diana',
  'Antonio', 'Fernanda', 'Gustavo', 'Mónica', 'Daniel', 'Paola', 'Enrique', 'Silvia', 'Francisco', 'Verónica',
  'Cristian', 'Mariana', 'Martín', 'Carla', 'Alejandro', 'Julia', 'Felipe', 'Sandra', 'Leonardo', 'Rocío',
  'Sebastián', 'Melissa', 'Nicolás', 'Roxana', 'Rodrigo', 'Lorena', 'Álvaro', 'Karina', 'Iván', 'Vanessa',
  'Hugo', 'Gisela', 'César', 'Norma', 'Gonzalo', 'Yolanda', 'Emilio', 'Teresa', 'Óscar', 'Miriam',
  'Vicente', 'Pilar', 'Alfredo', 'Guadalupe', 'Ramiro', 'Elvira', 'Tomás', 'Angélica', 'Bruno', 'Marta'
];

const apellidos = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Ramírez', 'Torres',
  'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Chávez',
  'Ruiz', 'Hernández', 'Castillo', 'Vásquez', 'Mendoza', 'Romero', 'Alvarez', 'Castro', 'Ramos', 'Vargas',
  'Rojas', 'Medina', 'Salazar', 'Campos', 'Quispe', 'Mamani', 'Huamán', 'Ccama', 'Condori', 'Yupanqui',
  'Silva', 'Paredes', 'Aguilar', 'Navarro', 'Moreno', 'Cabrera', 'Jiménez', 'Velásquez', 'Mejía', 'Herrera',
  'Carrillo', 'Delgado', 'Guzmán', 'Ponce', 'Vega', 'León', 'Espinoza', 'Ríos', 'Guerrero', 'Cortés',
  'Benítez', 'Ayala', 'Valdez', 'Miranda', 'Bustamante', 'Zavala', 'Ochoa', 'Villanueva', 'Bravo', 'Cárdenas',
  'Domínguez', 'Peña', 'Sandoval', 'Maldonado', 'Córdova', 'Ibarra', 'Pacheco', 'Vera', 'Figueroa', 'Montes',
  'Benavides', 'Palacios', 'Valencia', 'Gallegos', 'Segura', 'Contreras', 'Luna', 'Acosta', 'Trujillo', 'Lara'
];

// 12 carreras de Ciencias de la Salud
const carreras = [
  'Medicina Humana',
  'Enfermería',
  'Obstetricia',
  'Nutrición y Dietética',
  'Psicología',
  'Fisioterapia y Rehabilitación',
  'Farmacia y Bioquímica',
  'Odontología',
  'Terapia Ocupacional',
  'Tecnología Médica',
  'Medicina Veterinaria y Zootecnia',
  'Optometría'
];

// Función para generar fecha de nacimiento aleatoria (18-25 años)
const generarFechaNacimiento = () => {
  const year = 2000 + Math.floor(Math.random() * 7); // 2000-2006
  const month = Math.floor(Math.random() * 12); // 0-11
  const day = Math.floor(Math.random() * 28) + 1; // 1-28
  return new Date(year, month, day);
};

// Función para generar teléfono peruano
const generarTelefono = () => {
  return '9' + Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Función para generar código de estudiante único
const generarCodigoEstudiante = (index) => {
  const year = 2020 + Math.floor(index / 1000); // Distribuir entre años
  const numero = (index % 10000).toString().padStart(4, '0');
  return `U${year}${numero}`;
};

// Función principal para crear usuarios
const crearEstudiantes = async () => {
  try {
    console.log('🚀 Iniciando creación de 600 estudiantes...\n');

    const usuarios = [];
    let index = 20000; // Empezar desde U20200000

    for (const carrera of carreras) {
      console.log(`📚 Creando 50 estudiantes de ${carrera}...`);

      for (let i = 0; i < 50; i++) {
        const nombreCompleto = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)];
        const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)];
        const apellidoCompleto = `${apellido1} ${apellido2}`;
        
        const codigoEstudiante = generarCodigoEstudiante(index);
        const email = `${codigoEstudiante.toLowerCase()}@utp.edu.pe`;
        const password = email; // Contraseña = email
        const hashedPassword = await bcrypt.hash(password, 10);

        const ciclo = Math.floor(Math.random() * 10) + 1; // Ciclos 1-10
        const telefono = generarTelefono();
        const fechaNacimiento = generarFechaNacimiento();

        usuarios.push({
          nombres: nombreCompleto,
          apellidos: apellidoCompleto,
          email: email,
          password: hashedPassword,
          codigoEstudiante: codigoEstudiante,
          facultad: 'Facultad de Ciencias de la Salud',
          carrera: carrera,
          ciclo: ciclo,
          telefono: telefono,
          fechaNacimiento: fechaNacimiento,
          activo: true,
          createdAt: new Date()
        });

        index++;
      }
    }

    console.log(`\n💾 Insertando ${usuarios.length} usuarios en MongoDB Atlas...`);
    await User.insertMany(usuarios);

    console.log('\n✅ ¡COMPLETADO! 600 estudiantes creados exitosamente\n');
    console.log('📊 Resumen por carrera:');
    for (const carrera of carreras) {
      const count = await User.countDocuments({ carrera: carrera });
      console.log(`   ${carrera}: ${count} estudiantes`);
    }

    console.log('\n🔐 CREDENCIALES DE ACCESO:');
    console.log('   Email: [codigo]@utp.edu.pe (ejemplo: u20200001@utp.edu.pe)');
    console.log('   Password: [mismo que el email]');
    console.log('\n📝 Ejemplos:');
    const ejemplos = usuarios.slice(0, 5);
    ejemplos.forEach(user => {
      console.log(`   📧 ${user.email} | 🔑 ${user.email} | 👤 ${user.nombres} ${user.apellidos}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear estudiantes:', error);
    process.exit(1);
  }
};

// Ejecutar
crearEstudiantes();
