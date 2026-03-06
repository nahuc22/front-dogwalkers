// Cambia esta línea según donde estés
export const API_CONFIG = {
  // 🏠 En tu casa (WiFi local)
  local: 'http://192.168.100.39:3001/api',
  
  // 📱 En cualquier lugar con datos móviles o WiFi externo
  remote: 'https://e7bb003c5407.ngrok-free.app/api', // Actualiza esta URL con ngrok
  
  // 🌐 Producción (Render.com)
  production: 'https://dog-walkers-api.onrender.com/api' // Actualiza con tu URL de Render
};

// ⚠️ IMPORTANTE: Cambia a 'production' antes de generar el APK
export const API_BASE_URL = API_CONFIG.production;
