export type OperatingSystem =
  | 'windows-11'
  | 'windows-10'
  | 'windows-8.1'
  | 'windows-7'
  | 'windows-xp'
  | 'linux-mint'
  | 'kali-linux';

export type OsFamily = 'windows' | 'linux';

export interface OperatingSystemOption {
  id: OperatingSystem;
  label: string;
  family: OsFamily;
}

export const OPERATING_SYSTEMS: OperatingSystemOption[] = [
  { id: 'windows-11', label: 'Windows 11', family: 'windows' },
  { id: 'windows-10', label: 'Windows 10', family: 'windows' },
  { id: 'windows-8.1', label: 'Windows 8.1', family: 'windows' },
  { id: 'windows-7', label: 'Windows 7', family: 'windows' },
  { id: 'windows-xp', label: 'Windows XP', family: 'windows' },
  { id: 'linux-mint', label: 'Linux Mint', family: 'linux' },
  { id: 'kali-linux', label: 'Kali Linux', family: 'linux' },
];

export function getOsFamily(os: OperatingSystem | null | undefined): OsFamily | null {
  if (!os) {
    return null;
  }
  return OPERATING_SYSTEMS.find((option) => option.id === os)?.family ?? null;
}
