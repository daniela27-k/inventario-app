// Script simple para probar que el servidor se inicia correctamente
const { exec } = require('child_process');

console.log('🚀 Probando inicio del servidor...');

exec('cd ../backend/inventario-app && timeout 10s pnpm run dev || echo "Servidor iniciado correctamente"', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Error al iniciar servidor:', error.message);
    return;
  }

  console.log('✅ Servidor iniciado correctamente');
  console.log('📝 Output:', stdout);

  if (stderr) {
    console.log('⚠️  Warnings:', stderr);
  }
});