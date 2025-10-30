export interface MusicFile {
  id: string;
  name: string;
  fileName: string;
  artist: string;
  genre: string;
}

// This will be populated based on files found in /public/music/
export const musicFiles: MusicFile[] = [
  {
    id: '1',
    name: 'First Breath After Coma',
    fileName: 'Explosions in the Sky - First Breath After.m4a',
    artist: 'Explosions in the Sky',
    genre: 'Post-Rock'
  }
];

// Function to auto-discover music files
export function discoverMusicFiles(): MusicFile[] {
  // For now, return empty array
  // In production, this could fetch from an API or scan the public/music folder
  return [];
}

