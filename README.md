# Deezerfy

Deezerfy is a Deezer clone which utilizes the free Deezer API to search for artists, albums and songs. The user can add and remove songs from a playlist which they may also rename or delete. The playlists are stored in IndexDB.

## Prerequisites

- Node 22
- Angular 21

## Setup

```bash
git clone https://github.com/Graduate-Program-26/angular-assessment-troy.git
cd angular-assessment-troy
npm install
npm start
```

Navigate to `http://localhost:4200`

## Tech stack

- Angular 21: standalone components, signals-first state, new control flow
- NgRx Signals: `signalStore` for playlist state
- spartan/ui: headless component primitives
- Tailwind CSS v4
- idb: IndexedDB wrapper for playlist storage

## Screenshots

Search Page
![](./readme_images/search.png)

Artist Search
![](./readme_images/artist_search.png)

Album Search
![](./readme_images/album_search.png)

Song Search
![](./readme_images/song_search.png)

Artist Page
![](readme_images/artist_page.png)

Album Page
![](readme_images/album_page.png)

Playlist Creator
![](readme_images/playlist_creator.png)

Playlist Details
![](readme_images/playlist_details.png)

## Known limitations

- No artist biography text

- No OAuth Login
