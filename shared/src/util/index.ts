// Source: http://stackoverflow.com/questions/13720256/javascript-regex-camelcase-to-sentence
export function camelCaseToSentence(camelCasedText: string): string {
    return camelCasedText.replace(/^[a-z]|[A-Z]/g, function (v, i) {
        return i === 0 ? v.toUpperCase() : ' ' + v.toLowerCase();
    });
}

export function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
