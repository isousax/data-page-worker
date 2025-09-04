const prefixMap: Record<string, string> = {
    P: "nossa_historia",
    I: "infinito_particular",
    B: "bem_vindo_ao_mundo"
};

export function prefixLabels(intentionId: string): string | null {
    const prefix = intentionId.replace(/-.+/, '').toUpperCase();
    return prefixMap[prefix] ?? null;
}
