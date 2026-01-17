import { getRequestEvent } from "solid-js/web";

export const getApiBaseUrl = (serverEvent?: any) => {
	if (typeof window !== "undefined")
	{
		return (window as any).APP_CONFIG?.API_BASE_URL ?? "http://localhost:8787";
	}

	const event = serverEvent || getRequestEvent();
	if (event)
	{
		if (event.locals?.apiBaseUrl)
		{
			return event.locals.apiBaseUrl;
		}

		return import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";
	}

	return "http://localhost:8787";
};

export interface TenantConfig {
	apiBaseUrl: string;
	openaiApiKey?: string;
}

export const resolveTenantConfig = async (request: Request, env: any): Promise<TenantConfig> => {
	const url = new URL(request.url);
	const hostname = url.hostname;
	const defaultApi = env.VITE_API_BASE_URL ?? "http://localhost:8787";

	if (env.TENANTS)
	{
		const rawConfig = await env.TENANTS.get(hostname);
		if (rawConfig)
		{
			try {
				const config = JSON.parse(rawConfig);
				return {
					apiBaseUrl: config.apiBaseUrl || config.api_url || defaultApi,
					openaiApiKey: config.openaiApiKey || config.openai_key,
				};
			}
			catch (e)
			{
				return {
					apiBaseUrl: rawConfig,
				};
			}
		}
	}

	return {
		apiBaseUrl: defaultApi
	};
};
