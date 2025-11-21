# 🚀 Guía de Deploy en Render

## Pasos para desplegar el backend en Render

### 1️⃣ Crear cuenta en Render
- Ve a [render.com](https://render.com)
- Regístrate o inicia sesión con GitHub

### 2️⃣ Crear nuevo Web Service
1. Click en **"New +"** → **"Web Service"**
2. Conecta con GitHub si no lo has hecho
3. Selecciona el repositorio: **`Silicom-11/utppage_backend`**
4. Click en **"Connect"**

### 3️⃣ Configurar el servicio

**Name:** `utppage-backend` (o el que prefieras)

**Region:** Oregon (US West) - el más cercano

**Branch:** `main`

**Root Directory:** (dejar vacío)

**Runtime:** `Node`

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Instance Type:** `Free`

### 4️⃣ Variables de Entorno (IMPORTANTE ⚠️)

En la sección **"Environment Variables"**, agregar:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://marcaquinocarhuas_db_user:h8FuM3eh2tM52wsC@cluster0.41zvhi9.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | `utp_portal_secret_key_2024_super_secure_jwt_token` |
| `PORT` | `3000` |
| `FRONTEND_URL` | `http://localhost:5173` (cambiar después por URL de Vercel) |
| `NODE_ENV` | `production` |

### 5️⃣ Deploy
- Click en **"Create Web Service"**
- Espera 2-3 minutos mientras Render despliega
- Verás logs en tiempo real

### 6️⃣ Obtener URL
Una vez desplegado, Render te dará una URL como:
```
https://utppage-backend.onrender.com
```

### 7️⃣ Verificar
Abre en el navegador:
```
https://tu-url.onrender.com/
```

Deberías ver:
```json
{
  "message": "🎓 UTP Portal Backend API",
  "version": "1.0.0",
  "status": "active"
}
```

### 8️⃣ Actualizar CORS
Una vez tengas la URL de Render, agregar a las variables de entorno en Render:

`FRONTEND_URL` = URL de tu frontend en Vercel (cuando lo despliegues)

---

## 📝 Notas Importantes

- **Free tier de Render:** El servicio se "duerme" después de 15 minutos de inactividad. Primera petición puede tardar 30-50 segundos.
- **MongoDB Atlas:** Ya está configurado y funcionando ✅
- **CORS:** Está configurado para aceptar desde `localhost:5173` y la URL que pongas en `FRONTEND_URL`

## 🔧 Troubleshooting

Si hay errores de conexión a MongoDB:
1. Ve a MongoDB Atlas
2. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
3. Database Access → Verifica que el usuario `marcaquinocarhuas_db_user` tenga permisos de lectura/escritura

---

## ✅ Checklist Final

- [ ] Repositorio en GitHub subido
- [ ] Web Service creado en Render
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso (status: Live)
- [ ] URL de Render funciona
- [ ] MongoDB Atlas conectado
- [ ] Endpoint `/health` responde OK
