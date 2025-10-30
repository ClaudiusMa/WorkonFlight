# Music Files

Upload your post-rock music files here. 

## Supported Formats
- MP3
- WAV
- OGG

## How to Use

1. Add your music files to this directory
2. Update `src/data/musicFiles.ts` with information about each track:
   - `id`: Unique identifier
   - `name`: Track name
   - `fileName`: Exact filename of the uploaded file
   - `artist`: Artist name
   - `genre`: Genre tag

## Example Entry

```typescript
{
  id: '1',
  name: 'My Track',
  fileName: 'my-track.mp3',
  artist: 'Artist Name',
  genre: 'Post-Rock'
}
```

After adding files and updating the data file, restart your dev server and the tracks will be available in the player!

