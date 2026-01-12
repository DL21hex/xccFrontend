// src/lib/tenants.ts

export const tenantConfig: Record<string, { logoUrl: string; name: string }> = {
  "localhost": {
    logoUrl: "/images/crearcolombia_small.png",
    name: "Crear Colombia (DevOps)",
  },
  "agrovid-xccui.crearcolombia.com": {
    logoUrl: "/images/agrovid_small.png",
    name: "Agrovid",
  },
  "default": {
    logoUrl: "/images/crearcolombia_small.png",
    name: "Crear Colombia",
  }
};