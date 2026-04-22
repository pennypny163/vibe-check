import { describe, it, expect } from 'vitest';
import { classifyFile, isTemplateMessage } from '../../src/analyzer/classifier.js';

describe('classifyFile', () => {
  it('classifies .test.ts as test', () => {
    expect(classifyFile('src/utils.test.ts')).toBe('test');
  });
  it('classifies .spec.js as test', () => {
    expect(classifyFile('lib/parser.spec.js')).toBe('test');
  });
  it('classifies __tests__/ as test', () => {
    expect(classifyFile('__tests__/foo.ts')).toBe('test');
  });
  it('classifies test_*.py as test', () => {
    expect(classifyFile('test_utils.py')).toBe('test');
  });
  it('classifies docs/ as plan', () => {
    expect(classifyFile('docs/architecture.md')).toBe('plan');
  });
  it('classifies plan.md as plan', () => {
    expect(classifyFile('plan.md')).toBe('plan');
  });
  it('classifies ARCHITECTURE.md as plan', () => {
    expect(classifyFile('ARCHITECTURE.md')).toBe('plan');
  });
  it('classifies .json as config', () => {
    expect(classifyFile('tsconfig.json')).toBe('config');
  });
  it('classifies dotfiles as config', () => {
    expect(classifyFile('.eslintrc')).toBe('config');
  });
  it('classifies .md as docs', () => {
    expect(classifyFile('README.md')).toBe('docs');
  });
  it('classifies .ts as impl', () => {
    expect(classifyFile('src/server/index.ts')).toBe('impl');
  });
  it('classifies .py as impl', () => {
    expect(classifyFile('app/main.py')).toBe('impl');
  });
});

describe('isTemplateMessage', () => {
  it('detects merge branch', () => {
    expect(isTemplateMessage('Merge branch main')).toBe(true);
  });
  it('passes normal message', () => {
    expect(isTemplateMessage('feat: add auth system')).toBe(false);
  });
});
