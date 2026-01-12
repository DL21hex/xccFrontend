import { createHandler, StartServer } from "@solidjs/start/server";
import { getRequestEvent, isServer } from "solid-js/web";
import { DEFAULT_TENANT, TENANTS } from "./config/tenants";

const getTenantStyles = (tenant: typeof DEFAULT_TENANT) => `
    :root {
        --primary-color: ${tenant.primaryColor};
        --light-color: ${tenant.lightColor};
        --logo-width: ${tenant.logoWidth};
    }
`;

export default createHandler(() => {

	const tenant = () => {
		if (isServer)
		{
			const event = getRequestEvent();
			const host = new URL(event!.request.url).hostname;
			return TENANTS[host] || DEFAULT_TENANT;
		}

		return DEFAULT_TENANT;
	}

	return (
		<StartServer
			document={({ assets, children, scripts }) => (
			<html lang="es" class="--font-inter h-full">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/favicon.png" />
					{assets}
					<style>{getTenantStyles(tenant())}</style>
				</head>
				<body class="font-sans antialiased h-full overflow-hidden">
					{children}
				{scripts}
				</body>
			</html>
			)}
		/>
	);
});