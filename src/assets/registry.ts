import type { AvatarId } from '@/types/models';

import Ribbon from './badges/ribbon.svg';
import Star from './badges/star.svg';
import Trophy from './badges/trophy.svg';

import Avatar01 from './avatars/avatar-01.svg';
import Avatar02 from './avatars/avatar-02.svg';
import Avatar03 from './avatars/avatar-03.svg';
import Avatar04 from './avatars/avatar-04.svg';
import Avatar05 from './avatars/avatar-05.svg';
import Avatar06 from './avatars/avatar-06.svg';
import Avatar07 from './avatars/avatar-07.svg';
import Avatar08 from './avatars/avatar-08.svg';
import Avatar09 from './avatars/avatar-09.svg';
import Avatar10 from './avatars/avatar-10.svg';
import Avatar11 from './avatars/avatar-11.svg';
import Avatar12 from './avatars/avatar-12.svg';
import Camera from './mascots/camera.svg';
import Cheering from './mascots/cheering.svg';
import Encouraging from './mascots/encouraging.svg';
import MapPin from './mascots/map-pin.svg';
import Pencil from './mascots/pencil.svg';
import Thinking from './mascots/thinking.svg';
import Waving from './mascots/waving.svg';

/**
 * The seam between screens and artwork.
 *
 * Screens name a pose (`<Mascot pose="mapPin" />`) and never a file path, so replacing the
 * placeholders with the commissioned illustrations is a file drop — no screen changes, no
 * refactor. Adding a pose here is a compile error everywhere it must be handled.
 *
 * ⚠️ Every asset below is a deliberately crude placeholder. They are ugly on purpose: it should
 * be impossible to ship them by accident.
 */
export const MASCOTS = {
  waving: Waving,
  mapPin: MapPin,
  camera: Camera,
  pencil: Pencil,
  cheering: Cheering,
  encouraging: Encouraging,
  thinking: Thinking,
} as const;

export type MascotPose = keyof typeof MASCOTS;

/** Illustrated only — design.md §7 forbids photographic child imagery outright. */
export const AVATARS = {
  'avatar-01': Avatar01,
  'avatar-02': Avatar02,
  'avatar-03': Avatar03,
  'avatar-04': Avatar04,
  'avatar-05': Avatar05,
  'avatar-06': Avatar06,
  'avatar-07': Avatar07,
  'avatar-08': Avatar08,
  'avatar-09': Avatar09,
  'avatar-10': Avatar10,
  'avatar-11': Avatar11,
  'avatar-12': Avatar12,
} as const satisfies Record<AvatarId, unknown>;

/**
 * `satisfies` rather than the `keyof typeof` this used to derive: the union now lives in
 * types/models.ts so the domain and data layers can name an avatar without importing artwork.
 * This line is what keeps the two in step — adding an id to the union without adding its file
 * fails to compile here, rather than rendering a blank square at runtime.
 *
 * `AVATAR_IDS` is re-exported so screens keep importing everything avatar-shaped from one place.
 */
export { AVATAR_IDS, DEFAULT_AVATAR_ID } from '@/types/models';
export type { AvatarId } from '@/types/models';

/**
 * Reward artwork — design.md §8.8 asks for illustrated stars, trophies and ribbons rather than
 * an icon glyph, and reserves accent yellow for exactly this.
 *
 * Unlike `AvatarId`, `BadgeType` is derived here with `keyof typeof` rather than declared in
 * types/models.ts: a badge is chosen by the screen at render time and never persisted on an
 * entity, so no domain or data code needs to name one.
 */
export const BADGES = {
  star: Star,
  trophy: Trophy,
  ribbon: Ribbon,
} as const;

export type BadgeType = keyof typeof BADGES;
