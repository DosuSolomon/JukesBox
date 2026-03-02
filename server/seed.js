import 'dotenv/config';
import { sequelize } from './config/database.js';
import { Song, SongRequest, User } from './models/index.js';

// Override database credentials
process.env.POSTGRES_USER = 'postgres';
process.env.POSTGRES_PASSWORD = 'Sulaimon_d03111991';
process.env.POSTGRES_HOST = 'localhost';
process.env.POSTGRES_PORT = '5432';
process.env.POSTGRES_DB = 'jukesbox';

const seedData = async () => {
  try {
    // Sync database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Check if songs already exist
    const existingSongs = await Song.count();
    if (existingSongs > 0) {
      console.log(`Database already has ${existingSongs} songs. Skipping seed.`);
      process.exit(0);
    }

    // Create sample songs
    const songs = [
      {
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        genre: 'Rock',
        duration: 354,
        isAvailable: true,
        playCount: 0
      },
      {
        title: 'Hotel California',
        artist: 'Eagles',
        album: 'Hotel California',
        genre: 'Rock',
        duration: 391,
        isAvailable: true,
        playCount: 0
      },
      {
        title: 'Sweet Child O\' Mine',
        artist: 'Guns N\' Roses',
        album: 'Appetite for Destruction',
        genre: 'Rock',
        duration: 356,
        isAvailable: true,
        playCount: 0
      },
      {
        title: 'Billie Jean',
        artist: 'Michael Jackson',
        album: 'Thriller',
        genre: 'Pop',
        duration: 294,
        isAvailable: true,
        playCount: 0
      },
      {
        title: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        genre: 'Rock',
        duration: 187,
        isAvailable: true,
        playCount: 0
      },
      {
        title: 'Smells Like Teen Spirit',
        artist: 'Nirvana',
        album: 'Nevermind',
        genre: 'Grunge',
        duration: 301,
        isAvailable: true,
        playCount: 0
      },
      {
        title: 'Wonderwall',
        artist: 'Oasis',
        album: '(What the Story) Morning Glory?',
        genre: 'Britpop',
        duration: 258,
        isAvailable: true,
        playCount: 0
      },
      {
        title: 'Lose Yourself',
        artist: 'Eminem',
        album: '8 Mile Soundtrack',
        genre: 'Hip Hop',
        duration: 326,
        isAvailable: true,
        playCount: 0
      },
      {
        title: 'Rolling in the Deep',
        artist: 'Adele',
        album: '21',
        genre: 'Pop',
        duration: 228,
        isAvailable: true,
        playCount: 0
      },
      {
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: '÷',
        genre: 'Pop',
        duration: 234,
        isAvailable: true,
        playCount: 0
      }
    ];

    await Song.bulkCreate(songs);
    console.log(`Successfully seeded ${songs.length} songs!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
