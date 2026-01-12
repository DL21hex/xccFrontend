// src/server/tenant.ts
import { getRequestEvent } from "solid-js/web";
import { tenantConfig } from "~/lib/tenants";

// La directiva "use server" asegura que este código NUNCA llegue al navegador
export async function getCurrentTenantData()
{
  "use server";
  const event = getRequestEvent();

  if (!event) return tenantConfig["default"];

  const url = new URL(event.request.url);
  const domain = url.hostname;

  console.log(`[Worker] Dominio detectado: ${domain}`);
  const config = tenantConfig[domain] || tenantConfig["default"];

  return config;
}