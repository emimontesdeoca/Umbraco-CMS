import { rest } from 'msw';

import { umbracoPath } from '@umbraco-cms/utils';
import type { StatusResponse, VersionResponse } from '@umbraco-cms/models';

export const serverRunningHandler = rest.get(umbracoPath('/server/status'), (_req, res, ctx) => {
	return res(
		// Respond with a 200 status code
		ctx.status(200),
		ctx.json<StatusResponse>({
			serverStatus: 'running',
		})
	);
});

export const serverMustInstallHandler = rest.get(umbracoPath('/server/status'), (_req, res, ctx) => {
	return res(
		// Respond with a 200 status code
		ctx.status(200),
		ctx.json<StatusResponse>({
			serverStatus: 'must-install',
		})
	);
});

export const serverMustUpgradeHandler = rest.get(umbracoPath('/server/status'), (_req, res, ctx) => {
	return res(
		// Respond with a 200 status code
		ctx.status(200),
		ctx.json<StatusResponse>({
			serverStatus: 'must-upgrade',
		})
	);
});

export const serverVersionHandler = rest.get(umbracoPath('/server/version'), (_req, res, ctx) => {
	return res(
		// Respond with a 200 status code
		ctx.status(200),
		ctx.json<VersionResponse>({
			version: '13.0.0',
		})
	);
});
