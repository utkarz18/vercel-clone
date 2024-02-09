import fs from 'fs';
import path from 'path';
import { simpleGit } from 'simple-git';
import generateRandomId from './idGenerator';

const fetchGitRepo = async (repoUrl: string, rootDir: string) => {
    const buildId = generateRandomId();
    const workspaceDir = `workspace_${buildId}`
    const targetDirectory = path.join(rootDir, workspaceDir);
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }
    try {
        await simpleGit().clone(repoUrl, targetDirectory);
    } catch (err: any) {
        console.log(err.message);
        throw new Error("Invalid Git repository")
    }
    return buildId;
}

export default fetchGitRepo;