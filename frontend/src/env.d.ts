/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly STRAPI_URL: string;
}

declare namespace App {
  interface Locals {
    user: {
      id: number;
      username: string;
      email: string;
      validado_por_admin: boolean;
      rut?: string;
      razon_social?: string;
      giro?: string;
      direccion?: string;
      telefono?: string;
      tipo_persona?: 'Natural' | 'Empresa';
      estado?: 'pendiente' | 'activo' | 'rechazado';
      lista_precios?: 'estandar' | 'empresa';
      role?: {
        name: string;
        type: string;
      };
    } | null;
  }
}
