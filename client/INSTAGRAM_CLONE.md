# Instagram Clone - React Native

A fully functional Instagram clone built with React Native, Expo, and TypeScript.

## Features

### 🏠 Home Feed
- Instagram-style header with logo and action icons
- Horizontal scrollable stories with gradient borders
- Infinite scrollable feed with posts
- Like, comment, share, and save functionality
- Real-time like counter updates
- Post captions and timestamps
- **Clickable avatars and usernames** - Navigate to user profiles

### 🔍 Search/Explore
- Search bar for discovering content
- Grid layout of photos (3 columns)
- Hover overlay showing like counts
- Responsive image sizing

### 🎬 Reels
- Full-screen vertical video layout
- Swipeable reels with pagination
- Right-side action buttons (like, comment, share)
- User info and follow button overlay
- Audio attribution
- View counts and engagement metrics
- **Clickable avatars and usernames** - Navigate to user profiles

### 👤 Profile
- User statistics (posts, followers, following)
- Profile picture and bio
- Edit profile and share profile buttons
- Story highlights section
- Grid/Tagged tabs
- Photo grid of user posts

### 👥 User Profiles
- View other users' profiles by clicking avatars/usernames
- Follow/Unfollow functionality
- Message button
- Back navigation to previous screen
- Dynamic user statistics
- User's photo grid

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - File-based navigation
- **Expo Linear Gradient** - Gradient effects for stories
- **@expo/vector-icons** - Icon library

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home feed
│   │   ├── explore.tsx        # Search/Explore
│   │   ├── reels.tsx          # Reels screen
│   │   ├── profile.tsx        # User profile
│   │   └── _layout.tsx        # Tab navigation
│   └── user/
│       └── [id].tsx           # Dynamic user profile page
├── components/
│   └── instagram/
│       ├── Header.tsx         # App header
│       ├── StoryItem.tsx      # Story circle component
│       └── PostItem.tsx       # Post card component
├── data/
│   └── mockData.ts            # Mock data for demo
└── types/
    └── instagram.ts           # TypeScript interfaces

```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
- **iOS**: Press `i` or scan QR code with Camera app
- **Android**: Press `a` or scan QR code with Expo Go app
- **Web**: Press `w`

## Features Implemented

### ✅ Core Features
- [x] Bottom tab navigation (Home, Search, Reels, Profile)
- [x] Stories with gradient borders
- [x] Post feed with images
- [x] Like/Unlike posts
- [x] Save/Unsave posts
- [x] Comment count display
- [x] Explore grid layout
- [x] Reels vertical scroll
- [x] User profile with stats
- [x] Profile photo grid

### 🎨 UI/UX
- [x] Instagram-style design
- [x] Smooth animations
- [x] Responsive layouts
- [x] Touch feedback
- [x] Icon states (filled/outline)

## Mock Data

The app uses mock data from `data/mockData.ts` including:
- 5 sample users
- 5 sample posts with images from Picsum
- Stories for all users
- 3 sample reels
- Current user profile data

## Customization

### Adding Real Data
Replace the mock data in `data/mockData.ts` with API calls to your backend:

```typescript
// Example: Fetch posts from API
const fetchPosts = async () => {
  const response = await fetch('YOUR_API_URL/posts');
  return response.json();
};
```

### Styling
All styles are contained within each component using StyleSheet. Modify colors, sizes, and layouts in the respective component files.

### Navigation
The tab navigation is configured in `app/(tabs)/_layout.tsx`. Add or remove tabs as needed.

## Screenshots

The app includes:
- Feed with stories and posts
- Search grid with photos
- Reels with full-screen videos
- Profile with user information

## Future Enhancements

- [ ] Add video playback for reels
- [ ] Implement comments modal
- [ ] Add direct messaging
- [ ] Create post functionality
- [ ] User authentication
- [ ] Backend integration
- [ ] Push notifications
- [ ] Story creation and viewing
- [ ] Live streaming
- [ ] Shopping features

## License

This is a demo project for educational purposes.

## Credits

- Images from [Picsum Photos](https://picsum.photos)
- Avatars from [Pravatar](https://pravatar.cc)
- Icons from [@expo/vector-icons](https://icons.expo.fyi)
