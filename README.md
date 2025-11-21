# UTP Portal Backend

Backend API para el Portal Estudiantil de la Universidad Tecnológica del Perú.

## 🚀 Tecnologías

- **Node.js** + **Express.js**
- **MongoDB Atlas** (Base de datos en la nube)
- **JWT** (Autenticación)
- **Bcrypt** (Hash de contraseñas)

## 📋 Endpoints

### Autenticación

- `POST /api/auth/register` - Registro de estudiante
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/verify` - Verificar token (Protegido)
- `GET /api/auth/profile` - Obtener perfil (Protegido)

### Salud

- `GET /` - Info de la API
- `GET /health` - Estado del servidor

## 🔧 Variables de Entorno

Configurar en Render o `.env` local:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
FRONTEND_URL=https://tu-frontend.vercel.app
NODE_ENV=production
```

## 📦 Instalación Local

```bash
npm install
npm start
```

## 🌐 Deploy en Render

1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Build Command: `npm install`
4. Start Command: `npm start`

## 📝 Modelo de Usuario

```javascript
{
  nombres: String,
  apellidos: String,
  email: String (único),
  password: String (hasheado),
  codigoEstudiante: String (U20201234),
  facultad: String,
  carrera: String,
  ciclo: Number,
  telefono: String,
  fechaNacimiento: Date
}
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT con expiración de 24h
- CORS configurado para orígenes permitidos
- Validación de datos en backend

## 👥 Autor

UTP - Universidad Tecnológica del Perú
