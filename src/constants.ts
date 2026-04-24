/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export const SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'Cyber Runner',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon-drift/400/400',
  },
  {
    id: '2',
    title: 'Midnight Pulse',
    artist: 'Synth Wave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/midnight-pulse/400/400',
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Techno Ghost',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/digital-horizon/400/400',
  },
];
