const fs = require('fs');
const path = require('path');

// Ruta al archivo que queremos corregir
const filePath = path.join(__dirname, 'src', 'components', 'providers', 'AuthProvider.tsx');

// Leer el contenido del archivo
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  // Buscar y corregir el problema de la llave adicional
  const correctedContent = data.replace(
    /\};(\s*)\};(\s*)export default AuthProvider;/,
    '};$1$2export default AuthProvider;'
  );

  // Escribir el contenido corregido de vuelta al archivo
  fs.writeFile(filePath, correctedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error al escribir el archivo:', err);
      return;
    }
    console.log('✅ Archivo AuthProvider.tsx corregido con éxito');
  });
}); 