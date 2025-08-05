import type { Env } from "../index";

export async function ListDedications(request: Request, env: Env, email: string): Promise<Response> {
    try {
        if (!isValidEmail(email)) {
            return new Response(
                JSON.stringify({ message: "Email inválido." }),
                { status: 400, headers: createJsonHeaders(false) }
            );
        }

        const sql = `
                SELECT final_url, created_at, expires_in
                FROM intentions
                WHERE email = ? AND status = 'approved'
                ORDER BY created_at DESC
            `;

        const data = await env.DB.prepare(sql).bind(email).all();

        if (data.results.length === 0) {
            console.info(`Dados usuário '${email}' não encontrado`);
            return new Response(
                JSON.stringify({ message: "Dados não encontrado." }),
                { status: 404, headers: createJsonHeaders(false) }
            );
        }
        const dedications = data.results.map(r => ({
            url: r.final_url,
            expiration: r.expires_in,
            created: r.created_at
        }));

        return new Response(
            JSON.stringify({ dedications }),
            { status: 200, headers: createJsonHeaders(true) }
        );
    }
    catch (err) {
        console.error("Erro interno:", err);
        return new Response(
            JSON.stringify({ message: "Erro inesperado no servidor." }),
            { status: 500, headers: createJsonHeaders(false) }
        );
    }

    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function createJsonHeaders(cache = false): Headers {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
        if (cache) headers.set("Cache-Control", "public, max-age=3600");
        return headers;
    }

}