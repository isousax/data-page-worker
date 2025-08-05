import type { D1Database } from "@cloudflare/workers-types";
import { ConsultDataForm } from "./endpoints/ConsultDataForm";
import { ListDedications } from "./endpoints/ListDedications";

export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const { pathname } = new URL(request.url);

		if (request.method === "GET" && pathname === "/data/consult") {
			return await ConsultDataForm(request, env);
		}

		if (request.method === "GET" && pathname.startsWith("/users/") && pathname.endsWith("/dedications")) {
			const email = decodeURIComponent(pathname.split("/")[2]);
			return await ListDedications(request, env, email);
		}

		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "POST, OPTIONS, GET",
					"Access-Control-Allow-Headers": "Content-Type"
				}
			});
		}

		return new Response(
			JSON.stringify({ status: 404, message: "Not Found." }),
			{ status: 404, headers: { "Content-Type": "application/json" } }
		);
	},
};
