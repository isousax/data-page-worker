import type { Env } from "../index";
import { prefixLabels } from "../util/prefixLabels";

export async function ConsultDataForm(request: Request, env: Env): Promise<Response> {
    const jsonHeader = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    try {
        const uri = new URL(request.url);

        if (uri.searchParams.has("id")) {
            const id = uri.searchParams.get("id");

            const tableName = prefixLabels(id);
            if (!tableName) {
                return new Response(
                    JSON.stringify({ message: "ID inválido." }),
                    { status: 400, headers: jsonHeader }
                );
            }
            const sql = `
                SELECT form_data
                FROM ${tableName}
                WHERE intention_id = ?
            `;

            const dataForm = await env.DB.prepare(sql).bind(id).first();

            if (!dataForm) {
                console.info(`Dados do ${id} encontrado`);
                return new Response(
                    JSON.stringify({ message: "Dados não encontrado." }),
                    { status: 404, headers: jsonHeader }
                );
            }

            return new Response(
                JSON.stringify(dataForm),
                { status: 200, headers: jsonHeader }
            );
        }
        else {
            return new Response(
                JSON.stringify({ message: "Parâmetros da requisição malformados." }),
                { status: 400, headers: jsonHeader }
            );
        }
    }
    catch (err) {
        console.error("Erro interno:", err);
        return new Response(
            JSON.stringify({ message: "Erro inesperado no servidor." }),
            { status: 500, headers: jsonHeader }
        );
    }
}