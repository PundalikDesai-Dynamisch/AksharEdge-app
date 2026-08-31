/**
 * The single mapping from this app's icon vocabulary to the underlying icon set (Feather).
 * Nothing else in `src/` names an icon string directly, so swapping icon sets later touches
 * only this file plus components/Icon.tsx.
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

  // AksharEdge product vocabulary — permission gates, rewards, report, and child navigation.
  check: 'check', // bare tick for the avatar picker's selection badge
  lock: 'lock', // a locked tab's non-colour cue — design.md §18
  pause: 'pause', // the game header's exit control, spec §20
  mapPin: 'map-pin',
  award: 'award',
  star: 'star',
  bookOpen: 'book-open',
  barChart: 'bar-chart-2',
  helpCircle: 'help-circle',
  arrowLeft: 'arrow-left',
} as const;

export type IconKey = keyof typeof IconName;
export type IconGlyph = (typeof IconName)[IconKey];
