export function normalizeStatusBuffer(message: string): string {
    const errors = new Set<string>();
    let error = '';

    const lines = message.split('\n');
    for (const line of lines) {
        if (line.startsWith('Error at') || line.startsWith('Warning at')) {
            if (error) {
                errors.add(error);
            }

            error = line;
        } else {
            error += '\n' + line;
        }
    }

    errors.add(error);

    return Array.from(errors).join('\n');
}
