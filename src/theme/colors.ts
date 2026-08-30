export const colors = {
  primary: '#2F6F4E', // deep green — brand, primary actions
  primaryMuted: '#E7F2EC',
  secondary: '#B5651D', // warm accent — used sparingly (e.g. failed-state icon)
  background: '#FAFAF8',
  surface: '#FFFFFF',
  border: '#E3E1DC',
  text: '#1E1E1C',
  textMuted: '#6B6B66',
  textInverse: '#FFFFFF',

  success: '#2E7D32',
  successMuted: '#E8F5E9',
  warning: '#B7791F',
  warningMuted: '#FEF3E2',
  danger: '#B3261E',
  dangerMuted: '#FBEAE9',
  info: '#1565C0',
  infoMuted: '#E8F1FB',

  overlay: 'rgba(0,0,0,0.45)',
} as const;

export type ColorToken = keyof typeof colors;
