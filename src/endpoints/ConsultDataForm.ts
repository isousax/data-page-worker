import type { Env } from "../index";
import { prefixLabels } from "../util/prefixLabels";

export async function ConsultDataForm(request: Request, env: Env): Promise<Response> {
    try {
        const uri = new URL(request.url);

        if (uri.searchParams.has("id")) {
            const id = uri.searchParams.get("id");

            const tableName = prefixLabels(id);
            if (!tableName) {
                return new Response(
                    JSON.stringify({ message: "ID inválido." }),
                    { status: 400, headers: createJsonHeaders(false) }
                );
            }
            const sql = `
                SELECT form_data, status
                FROM ${tableName}
                WHERE intention_id = ?
            `;

            const dataForm = await env.DB.prepare(sql).bind(id).first();

            if (!dataForm) {
                console.info(`Dados do ${id} encontrado`);
                return new Response(
                    JSON.stringify({ message: "Dados não encontrado." }),
                    { status: 404, headers: createJsonHeaders(false) }
                );
            }
            
            if (dataForm.status != "approved") {
                console.info(`Pagamento do ${id} não aprovado`);
                return new Response(
                    JSON.stringify({ message: "Pagamento não aprovado." }),
                    { status: 403, headers: createJsonHeaders(false) }
                );
            }

            const parsed = JSON.parse(dataForm.form_data as string);

            return new Response(
                JSON.stringify(parsed),
                { status: 200, headers: createJsonHeaders(true) }
            );
        }
        else {
            return new Response(
                JSON.stringify({ message: "Parâmetros da requisição malformados." }),
                { status: 400, headers: createJsonHeaders(false) }
            );
        }
    }
    catch (err) {
        console.error("Erro interno:", err);
        return new Response(
            JSON.stringify({ message: "Erro inesperado no servidor." }),
            { status: 500, headers: createJsonHeaders(false) }
        );
    }

    function createJsonHeaders(cache = false): Headers {
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
        if (cache) headers.set("Cache-Control", "public, max-age=604800");
        return headers;
    }
}