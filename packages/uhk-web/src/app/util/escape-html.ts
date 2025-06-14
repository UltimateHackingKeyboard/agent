const matchHtmlRegExp = /["'&<>]/

export function escapeHtml(value) {
    if (!value) {
        return value;
    }

    const match = matchHtmlRegExp.exec(value)

    if (!match) {
        return value;
    }

    let escape
    let html = ''
    let index = 0
    let lastIndex = 0

    for (index = match.index; index < value.length; index++) {
        switch (value.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;'
                break
            case 38: // &
                escape = '&amp;'
                break
            case 39: // '
                escape = '&#39;'
                break
            case 60: // <
                escape = '&lt;'
                break
            case 62: // >
                escape = '&gt;'
                break
            default:
                continue
        }

        if (lastIndex !== index) {
            html += value.substring(lastIndex, index)
        }

        lastIndex = index + 1
        html += escape
    }

    return lastIndex !== index
        ? html + value.substring(lastIndex, index)
        : html
}
