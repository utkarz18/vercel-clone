import fs from 'fs';
import path from 'path';
import { simpleGit } from 'simple-git';
import generateRandomId from './idGenerator';

const fetchGitRepo = async (repoUrl: string, rootDir: string) => {
    const buildId = generateRandomId();
    const workspaceDir = `workspace/${buildId}`
    const targetDirectory = path.join(rootDir, workspaceDir);
    try {
        await simpleGit().clone(repoUrl, targetDirectory);
    } catch (err: any) {
        console.log(err.message);
        throw new Error("Invalid Git repository")
    }
    return {buildId, targetDirectory};
}

export default fetchGitRepo;