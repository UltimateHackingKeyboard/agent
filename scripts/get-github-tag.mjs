/**
 * @returns {string}
 */
export default function getGithubTag() {
    const result = /^refs\/tags\/(v\d+\.\d+\.\d+)$/.exec(process.env.GITHUB_REF);

    return result && result[1];
}
