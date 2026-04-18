// Cambia esta línea según donde estés
export const API_CONFIG = {
  // 🏠 En tu casa (WiFi local) - Dispositivo físico
  local: 'http://192.168.100.39:3001/api',
  
  // 💻 Emulador Android (usa 10.0.2.2 en lugar de localhost)
  emulator: 'http://10.0.2.2:3001/api',
  
  // 📱 En cualquier lugar con datos móviles o WiFi externo
  remote: 'https://e7bb003c5407.ngrok-free.app/api', // Actualiza esta URL con ngrok
  
  // 🌐 Producción (Render.com + Aiven)
  production: 'https://dog-walkers-api-XXXX.onrender.com/api' // ⬅️ ACTUALIZAR con tu URL real
};

// ⚠️ IMPORTANTE: Cambia a 'production' para usar el backend desplegado
// Para desarrollo local, usa 'local'
export const API_BASE_URL = API_CONFIG.local; // ⬅️ Usando local mientras se despliega
