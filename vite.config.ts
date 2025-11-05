import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { graphql } from 'nitro-graphql/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    nitro(),
    graphql({
      framework: 'graphql-yoga',
      scaffold: false,
      paths: {
        serverGraphql: 'server/graphql',
        clientGraphql: 'src/graphql',
      },
    }),
    react(),
  ],
  nitro: {
    preset: process.env.NITRO_PRESET || "node-server",
    serverDir: "server"
  },
});
