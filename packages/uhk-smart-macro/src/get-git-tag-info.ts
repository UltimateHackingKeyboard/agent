import got from 'got';

const OPTIONS = {
    headers: {
        Accept: 'application/vnd.github+json'
    }
};

export interface GitRef {
    ref: string;
    node_id: string;
    url: string;
    object: {
        type: string;
        sha: string;
        url: string;
    }
}

export async function getGitTagInfo(repo, gitTag): Promise<GitRef> {
    const url = `https://api.github.com/repos/${repo}/git/refs/tags/${gitTag}`;
    const { data } = await got(url, OPTIONS)
        .json();

    return data;
}
