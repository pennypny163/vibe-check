import { describe, it, expect } from 'vitest';
import { getGrade, xpForLevel, computeOverallScore } from '../../src/game/xp.js';

describe('xp system', () => {
  it('grades A+ for score >= 90', () => {
    const g = getGrade(95);
    expect(g.grade).toBe('A+');
    expect(g.xp).toBe(20);
    expect(g.hp).toBe(5);
  });
  it('grades A for score 80-89', () => {
    expect(getGrade(85).grade).toBe('A');
  });
  it('grades B for score 65-79', () => {
    expect(getGrade(70).grade).toBe('B');
  });
  it('grades C for score 50-64', () => {
    expect(getGrade(55).grade).toBe('C');
  });
  it('grades D for score < 50', () => {
    const g = getGrade(30);
    expect(g.grade).toBe('D');
    expect(g.hp).toBe(-15);
  });
  it('computes overall score with weights', () => {
    expect(computeOverallScore(80, 80, 80)).toBe(80);
    expect(computeOverallScore(100, 0, 0)).toBe(35);
  });
  it('escalates xp per level', () => {
    expect(xpForLevel(1)).toBe(300);
    expect(xpForLevel(2)).toBe(400);
    expect(xpForLevel(10)).toBe(1200);
  });
});
