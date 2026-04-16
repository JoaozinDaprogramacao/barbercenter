// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nome do seu SaaS',
    short_name: 'SaaS App',
    description: 'Plataforma de Agendamentos',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#ea580c',
    icons: [
      {
        src: '/imgs/icons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/imgs/icons/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
  }
}