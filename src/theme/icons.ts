/**
 * The single mapping from this app's icon vocabulary to the underlying icon set (Feather).
 * Nothing else in `src/` names an icon string directly, so swapping icon sets later touches
 * only this file plus components/Icon.tsx (doc 18 §7).
 */
export const IconName = {
  clock: 'clock',
  checkCircle: 'check-circle',
  alertCircle: 'alert-circle',
  wifiOff: 'wifi-off',
  uploadCloud: 'upload-cloud',
  camera: 'camera',
  image: 'image',
  file: 'file-text',
  trash: 'trash-2',
  edit: 'edit-2',
  search: 'search',
  settings: 'settings',
  chevronRight: 'chevron-right',

  // Beyond doc 18 §7's starter list, needed by the shared components in doc 18 §3.
  x: 'x',
  eye: 'eye',
  eyeOff: 'eye-off',
  plus: 'plus',
  users: 'users',
  home: 'home',
  refresh: 'refresh-cw',
  user: 'user',
  info: 'info',
  inbox: 'inbox',
  gamepad: 'play-circle',
} as const;

export type IconKey = keyof typeof IconName;
export type IconGlyph = (typeof IconName)[IconKey];
