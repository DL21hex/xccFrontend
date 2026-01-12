// src/components/TenantLogo.tsx
import { createResource } from "solid-js";
import { getCurrentTenantData } from "~/server/tenant";
import { Show, Suspense } from "solid-js";

export default function TenantLogo()
{
  const [tenantData] = createResource(() => getCurrentTenantData());

  return (
    <Suspense fallback={<div class="h-12 w-12 bg-gray-200 animate-pulse rounded"></div>}>
      <Show when={tenantData()}>
        {(data) => (
           <div class="flex items-center gap-2">
             <img
               src={data().logoUrl}
               alt={`Logo de ${data().name}`}
               class="h-12 w-auto object-contain"
             />
             <span class="font-bold">{data().name}</span>
           </div>
        )}
      </Show>
    </Suspense>
  );
}