// utils/tenant.ts
export function isTenantFromUrl(): boolean {
    // En desarrollo (localhost o .test)
    if (process.env.NODE_ENV === 'development') {
      return window.location.hostname !== 'anahisoft.test' && 
             window.location.hostname.endsWith('.anahisoft.test');
    }
    
    // En producción (ajusta según tu dominio real)
    return window.location.hostname !== 'anahisoft.com' && 
           window.location.hostname.endsWith('.anahisoft.com');
  }