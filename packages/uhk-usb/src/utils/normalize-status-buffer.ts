export function normalizeStatusBuffer(message: string): string {
    const errors = new Set<string>();
    let error = '';

    function addToSet(error:string) {
        const trimmed = error.trim();
        if (trimmed) {
            errors.add(trimmed);
        }
    }

    const lines = message.split('\n');
    for (const line of lines) {
        if (line.startsWith('Error at') || line.startsWith('Warning at')) {
            addToSet(error);

            error = line;
        } else {
            error += '\n' + line;
        }
    }

    addToSet(error);

    return Array.from(errors).join('\n');
}
