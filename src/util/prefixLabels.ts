const prefixMap: Record<string, string> = {
    P: "nossa_historia"
};

export function prefixLabels(intentionId: string): string | null {
    const prefix = intentionId.replace(/-.+/, '').toUpperCase();
    return prefixMap[prefix] ?? null;
}
