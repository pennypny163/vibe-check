import simpleGit from 'simple-git';
import { execSync } from 'child_process';
import type { CommitData, CommitFileInfo } from '../types.js';

export async function getLatestCommitData(repoPath: string): Promise<CommitData> {
  const git = simpleGit(repoPath);

  const log = await git.log({ maxCount: 1 });
  const latest = log.latest;
  if (!latest) throw new Error('No commits found');

  let files: CommitFileInfo[] = [];
  try {
    const diffSummary = await git.diffSummary(['HEAD~1', 'HEAD']);
    files = diffSummary.files.map(f => ({
      path: f.file,
      added: (f as any).insertions || 0,
      deleted: (f as any).deletions || 0,
    }));
  } catch {
    // Initial commit — no parent to diff against
    const raw = await git.raw(['diff-tree', '--no-commit-id', '-r', '--numstat', 'HEAD']);
    for (const line of raw.trim().split('\n').filter(Boolean)) {
      const [added, deleted, file] = line.split('\t');
      files.push({ path: file, added: parseInt(added) || 0, deleted: parseInt(deleted) || 0 });
    }
  }

  const linesAdded = files.reduce((s, f) => s + f.added, 0);
  const linesDeleted = files.reduce((s, f) => s + f.deleted, 0);

  return {
    hash: latest.hash,
    timestamp: Math.floor(new Date(latest.date).getTime() / 1000),
    message: latest.message,
    files,
    lines_added: linesAdded,
    lines_deleted: linesDeleted,
    ai_detected: detectAIProcess(),
    repoCIEnabled: await checkCIConfig(repoPath),
  };
}

export async function getRecentCommitHistory(repoPath: string, count: number): Promise<CommitData[]> {
  const git = simpleGit(repoPath);
  const log = await git.log({ maxCount: count });
  const commits: CommitData[] = [];

  for (const entry of log.all) {
    let files: CommitFileInfo[] = [];
    try {
      const diffSummary = await git.diffSummary([`${entry.hash}~1`, entry.hash]);
      files = diffSummary.files.map(f => ({
        path: f.file,
        added: (f as any).insertions || 0,
        deleted: (f as any).deletions || 0,
      }));
    } catch {
      // Skip commits that can't be diffed
    }
    commits.push({
      hash: entry.hash,
      timestamp: Math.floor(new Date(entry.date).getTime() / 1000),
      message: entry.message,
      files,
      lines_added: files.reduce((s, f) => s + f.added, 0),
      lines_deleted: files.reduce((s, f) => s + f.deleted, 0),
      ai_detected: false,
      repoCIEnabled: false,
    });
  }
  return commits;
}

function detectAIProcess(): boolean {
  try {
    const ps = execSync('ps aux 2>/dev/null || tasklist 2>/dev/null', { encoding: 'utf-8', timeout: 3000 });
    return /cursor|copilot|claude|windsurf|codebuddy|aider/i.test(ps);
  } catch {
    return false;
  }
}

async function checkCIConfig(repoPath: string): Promise<boolean> {
  const git = simpleGit(repoPath);
  try {
    const files = await git.raw(['ls-files']);
    return /\.github\/workflows|\.gitlab-ci|Jenkinsfile|\.circleci|bitbucket-pipelines/i.test(files);
  } catch {
    return false;
  }
}
