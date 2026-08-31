import type { Assessment } from '@/domain/entities/Assessment';
import type { Child } from '@/domain/entities/Child';
import type { GameResult } from '@/domain/entities/GameResult';
import type { Parent } from '@/domain/entities/Parent';
import type { Report } from '@/domain/entities/Report';
import type { WritingSample } from '@/domain/entities/WritingSample';

import { DEFAULT_AVATAR_ID, isAvatarId } from '@/types/models';

import { nowIso, toIso, toIsoOrNull } from './timestamps';

/**
 * Firestore documents are untyped at runtime, so every mapper reads defensively and supplies a
 * defined fallback. A missing field yields a usable entity rather than an `undefined` that
 * surfaces as a crash three layers up.
 */
type Doc = Record<string, unknown>;

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const num = (v: unknown, fallback = 0): number => (typeof v === 'number' ? v : fallback);
const bool = (v: unknown, fallback = false): boolean =>
  typeof v === 'boolean' ? v : fallback;
const strArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

export function toParent(id: string, d: Doc): Parent {
  const created = toIso(d.createdAt, nowIso());
  return {
    parentId: id,
    fullName: str(d.fullName),
    email: str(d.email),
    phone: typeof d.phone === 'string' ? d.phone : null,
    contactMethod: d.contactMethod === 'phone' ? 'phone' : 'email',
    location: (d.location as Parent['location']) ?? null,
    authProvider: d.authProvider === 'google' ? 'google' : 'password',
    childCount: num(d.childCount),
    createdAt: created,
    updatedAt: toIso(d.updatedAt, created),
  };
}

export function toChild(id: string, d: Doc): Child {
  const created = toIso(d.createdAt, nowIso());
  const schooling = d.schooling;
  const status = d.status;
  return {
    childId: id,
    parentId: str(d.parentId),
    name: str(d.name),
    // The one place an untrusted avatar value enters the app. Anything not in the illustrated
    // set — including a photo URL, which design.md §7 forbids — collapses to the default here,
    // so nothing downstream has to defend against it again.
    avatarId: isAvatarId(d.avatarId) ? d.avatarId : DEFAULT_AVATAR_ID,
    ageYears: num(d.ageYears),
    schooling:
      schooling === 'preK' || schooling === 'primary' || schooling === 'middle'
        ? schooling
        : 'primary',
    gender: (d.gender as Child['gender']) ?? 'unspecified',
    location: (d.location as Child['location']) ?? null,
    status:
      status === 'in_progress' || status === 'report_ready' ? status : 'not_started',
    latestAssessmentId: typeof d.latestAssessmentId === 'string' ? d.latestAssessmentId : null,
    isDeleted: bool(d.isDeleted),
    createdAt: created,
    updatedAt: toIso(d.updatedAt, created),
  };
}

export function toAssessment(id: string, d: Doc): Assessment {
  const status = d.status;
  const writing = d.writingStatus;
  return {
    assessmentId: id,
    childId: str(d.childId),
    parentId: str(d.parentId),
    ageBand: (d.ageBand as Assessment['ageBand']) ?? 'middle',
    missionPlan: Array.isArray(d.missionPlan)
      ? (d.missionPlan as Assessment['missionPlan'])
      : [],
    status:
      status === 'submitted' || status === 'scored' || status === 'failed'
        ? status
        : 'in_progress',
    completedGameIds: strArray(d.completedGameIds),
    writingStatus: writing === 'uploaded' || writing === 'failed' ? writing : 'pending',
    startedAt: toIso(d.startedAt, nowIso()),
    submittedAt: toIsoOrNull(d.submittedAt),
    appVersion: str(d.appVersion),
    unityBuildId: typeof d.unityBuildId === 'string' ? d.unityBuildId : null,
  };
}

export function toGameResult(id: string, d: Doc): GameResult {
  const started = toIso(d.startedAt, nowIso());
  return {
    gameId: id,
    sessionId: str(d.sessionId),
    assessmentId: str(d.assessmentId),
    attempt: num(d.attempt, 1),
    startedAt: started,
    endedAt: toIso(d.endedAt, started),
    durationMs: num(d.durationMs),
    schemaVersion: num(d.schemaVersion, 1),
    completed: bool(d.completed),
    metrics: Array.isArray(d.metrics) ? (d.metrics as GameResult['metrics']) : [],
    raw: (d.raw as GameResult['raw']) ?? {},
    source: 'unity',
  };
}

export function toWritingSample(id: string, d: Doc): WritingSample {
  const writing = d.status;
  return {
    sampleId: id,
    assessmentId: str(d.assessmentId),
    storagePath: str(d.storagePath),
    downloadUrl: typeof d.downloadUrl === 'string' ? d.downloadUrl : null,
    promptText: str(d.promptText),
    capturedAt: toIso(d.capturedAt, nowIso()),
    mimeType: str(d.mimeType, 'image/jpeg'),
    sizeBytes: num(d.sizeBytes),
    retakeCount: num(d.retakeCount),
    status: writing === 'uploaded' || writing === 'failed' ? writing : 'pending',
  };
}

export function toReport(id: string, d: Doc): Report {
  return {
    reportId: id,
    assessmentId: str(d.assessmentId, id),
    childId: str(d.childId),
    parentId: str(d.parentId),
    generatedAt: toIso(d.generatedAt, nowIso()),
    schemaVersion: num(d.schemaVersion, 1),
    summary: (d.summary as Report['summary']) ?? {
      status: 'monitor',
      headline: '',
      body: '',
    },
    sections: Array.isArray(d.sections) ? (d.sections as Report['sections']) : [],
    writing: (d.writing as Report['writing']) ?? {
      status: 'pending',
      note: '',
      thumbnailUrl: null,
    },
    nextSteps: Array.isArray(d.nextSteps) ? (d.nextSteps as Report['nextSteps']) : [],
  };
}
