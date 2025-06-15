const fs = require('fs');
const path = require('path');

// Ruta al archivo que queremos corregir
const filePath = path.join(__dirname, 'src', 'lib', 'hooks', 'useAuth.ts');

// Contenido corregido
const correctedContent = `'use client';

import { useContext } from 'react';
import { AuthContext, AuthProvider, AuthContextType } from '@/components/providers/AuthProvider';

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Re-export AuthProvider and AuthContext
export { AuthProvider, AuthContext };
export type { AuthContextType };

export default useAuth;`;

// Escribir el contenido corregido al archivo
fs.writeFile(filePath, correctedContent, 'utf8', (err) => {
  if (err) {
    console.error('Error al escribir el archivo:', err);
    return;
  }
  console.log('✅ Archivo useAuth.ts corregido con éxito');
}); 