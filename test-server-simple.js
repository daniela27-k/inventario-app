const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Ruta de prueba para login
app.post('/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  
  const { email, password } = req.body;
  
  // Simulación de validación básica
  if (email && password) {
    // Simular respuesta exitosa
    const mockUser = {
      id: 1,
      nombre_completo: 'Usuario de Prueba',
      email: email,
      telefono: '1234567890',
      rol_usuario: 'USUARIO',
      estado_usuario: 'ACTIVO'
    };
    
    // Simular cookie de token
    res.cookie('access_token', 'mock-jwt-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 3600000,
    });
    
    res.json({ usuario: mockUser });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

// Ruta de prueba para logout
app.post('/auth/logout', (req, res) => {
  res.clearCookie('access_token');
  res.json({ message: 'Sesión cerrada correctamente' });
});

// Ruta de prueba para profile
app.get('/auth/profile', (req, res) => {
  const mockUser = {
    id: 1,
    nombre_completo: 'Usuario de Prueba',
    email: 'test@example.com',
    telefono: '1234567890',
    rol_usuario: 'USUARIO',
    estado_usuario: 'ACTIVO'
  };
  res.json(mockUser);
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de prueba funcionando', status: 'OK' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor de prueba corriendo en http://localhost:${PORT}`);
});