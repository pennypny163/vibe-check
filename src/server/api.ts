import type { Express } from 'express';
import { getPet } from '../storage/pet-store.js';
import { getRecentCommits, getCommitCount, getCommitsWithHighTestScore, getCommitsWithHighThinkScore } from '../storage/commits.js';
import { getRecentSummaries } from '../storage/aggregator.js';

export function setupAPI(app: Express): void {
  app.get('/api/pet', (_req, res) => {
    const pet = getPet();
    res.json({ pet });
  });

  app.get('/api/commits', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const commits = getRecentCommits(limit);
    res.json({ commits });
  });

  app.get('/api/stats', (_req, res) => {
    const pet = getPet();
    const totalCommits = getCommitCount();
    const summaries = getRecentSummaries(30);
    const highTest = getCommitsWithHighTestScore(80);
    const highThink = getCommitsWithHighThinkScore(80);
    res.json({ pet, totalCommits, summaries, highTest, highThink });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
}
