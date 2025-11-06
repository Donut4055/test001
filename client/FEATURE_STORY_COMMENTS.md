# Feature: Stories, Comments & Bookmark Management

## Tổng Quan (Overview)

Thêm 3 tính năng mới:
- ✅ Đăng Story với hình ảnh
- ✅ Comment bài viết với real-time updates
- ✅ Xóa bookmark (unsave) bài viết

## 1. Create Story Feature

### Giao Diện
- Full-screen modal với background đen
- Image selector
- Editing tools (Text, Draw, Emoji, Music)
- Share button

### Workflow
1. Click vào "Your story" (story circle đầu tiên)
2. Create story screen mở ra
3. Click "Select Photo"
4. Random image được chọn (mock)
5. Có thể thêm text, stickers, music (UI only)
6. Click "Share to Story"
7. Success alert
8. Quay về Home screen

### UI Components

#### Story Selection
```
┌─────────────────────────┐
│                         │
│    📷 Select Photo      │
│                         │
└─────────────────────────┘
```

#### Story Preview
```
┌─────────────────────────┐
│ ✕  Create Story         │
│                         │
│   [Image Preview]       │
│                         │
│   Tools: Aa 🖌️ 😊 🎵    │
│                         │
│   [Change Photo]        │
│   [Share to Story]      │
└─────────────────────────┘
```

### Features
- Image selection (mock random)
- Full-screen preview
- Editing tools (UI only):
  - Text tool (Aa)
  - Draw tool (🖌️)
  - Emoji/Stickers (😊)
  - Music (🎵)
- Change photo
- Share to story

## 2. Comments Feature

### Giao Diện
- Full-screen comments modal
- Header với back button và share
- Comments list
- Input box ở bottom
- Keyboard-aware scrolling

### Workflow
1. Click comment icon trên post
2. Comments screen mở ra
3. Thấy existing comments
4. Nhập comment mới
5. Click "Post"
6. Comment hiển thị ngay lập tức
7. Có thể like comments
8. Có thể reply (UI only)

### UI Components

#### Comments Screen
```
← Comments                  ✉

┌─────────────────────────┐
│ [Avatar] username       │
│ Amazing photo! 😍       │
│ 2h ago  12 likes Reply  │
└─────────────────────────┘

┌─────────────────────────┐
│ [Avatar] Add comment... │
│                    Post │
└─────────────────────────┘
```

### Comment Object
```typescript
{
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}
```

### Features
- View all comments
- Add new comment
- Like/Unlike comments
- Reply button (UI only)
- Real-time updates
- Keyboard handling
- Scroll to latest comment

### Mock Comments
```typescript
[
  {
    id: '1',
    user: johndoe,
    text: 'Amazing photo! 😍',
    timestamp: '2h ago',
    likes: 12,
    isLiked: false,
  },
  {
    id: '2',
    user: janedoe,
    text: 'Love this! Where is this place?',
    timestamp: '3h ago',
    likes: 5,
    isLiked: true,
  },
]
```

## 3. Bookmark Management

### Xóa Bookmark (Unsave)
- Click bookmark icon khi đã saved
- Icon đổi từ filled → outline
- Post bị xóa khỏi saved collection

### Logic
```typescript
// Before
isSaved: true
Icon: bookmark (filled)

// After click
isSaved: false
Icon: bookmark-outline
```

### Implementation
```typescript
const handleUnsave = () => {
  setIsSaved(false);
};

<TouchableOpacity onPress={isSaved ? handleUnsave : handleSave}>
  <Ionicons
    name={isSaved ? 'bookmark' : 'bookmark-outline'}
    size={26}
    color="#000"
  />
</TouchableOpacity>
```

## Cấu Trúc Code

### 1. Create Story Screen (`app/create-story.tsx`)

#### Features
- Full-screen modal
- Image selection (mock)
- Editing tools (UI)
- Share functionality
- Success feedback

#### State
```typescript
{
  selectedImage: string | null;
}
```

### 2. Comments Screen (`app/comments/[postId].tsx`)

#### Features
- Dynamic route với postId
- Comments list
- Add comment
- Like comments
- Reply button (UI)
- Keyboard-aware

#### State
```typescript
{
  commentText: string;
  comments: Comment[];
}
```

### 3. PostItem Updates

#### New Functions
```typescript
navigateToComments() // Navigate to comments screen
handleUnsave()       // Remove bookmark
```

#### Updated Actions
- Comment icon → Navigate to comments
- Bookmark icon → Toggle save/unsave
- "View all X comments" → Navigate to comments

## User Flows

### Flow 1: Create Story
1. User ở Home screen
2. Click "Your story" circle
3. Create story screen mở (full-screen)
4. Click "Select Photo"
5. Random image xuất hiện
6. (Optional) Click editing tools
7. Click "Share to Story"
8. Alert: "Your story has been shared!"
9. Click OK
10. Quay về Home screen

### Flow 2: Add Comment
1. User thấy post trong feed
2. Click comment icon (💬)
3. Comments screen mở
4. Thấy existing comments
5. Click input box
6. Keyboard xuất hiện
7. Type: "Great photo! 📸"
8. Click "Post"
9. Comment xuất hiện đầu tiên
10. Timestamp: "Just now"

### Flow 3: Like Comment
1. User ở comments screen
2. Thấy comment: "Amazing photo! 😍"
3. Click heart icon bên phải
4. Heart đổi màu đỏ
5. Likes tăng: 12 → 13

### Flow 4: Unsave Post
1. User thấy post đã saved (bookmark filled)
2. Click bookmark icon
3. Icon đổi thành outline
4. Post không còn trong saved collection

## Testing

### Test Cases

1. **Test Create Story**
   - Click "Your story"
   - Verify: Create story screen opens
   - Click "Select Photo"
   - Verify: Image appears
   - Click "Share to Story"
   - Verify: Success alert
   - Verify: Back to home

2. **Test Story Tools**
   - In create story screen
   - Click text tool
   - Click draw tool
   - Click emoji tool
   - Click music tool
   - Verify: All buttons responsive

3. **Test Add Comment**
   - Click comment icon on post
   - Verify: Comments screen opens
   - Type comment
   - Click "Post"
   - Verify: Comment appears at top
   - Verify: Timestamp "Just now"

4. **Test Like Comment**
   - In comments screen
   - Click heart on comment
   - Verify: Heart turns red
   - Verify: Likes count increases
   - Click again
   - Verify: Heart outline
   - Verify: Likes count decreases

5. **Test Comment Navigation**
   - Click "View all X comments"
   - Verify: Navigate to comments
   - Click back
   - Verify: Return to feed

6. **Test Unsave Post**
   - Find saved post (bookmark filled)
   - Click bookmark
   - Verify: Icon changes to outline
   - Verify: isSaved = false

7. **Test Keyboard Handling**
   - In comments screen
   - Click input
   - Verify: Keyboard appears
   - Verify: Input moves up
   - Type long text
   - Verify: Input expands (max 80px)

## Routes

### New Routes
```typescript
// Create story
/create-story
- Presentation: fullScreenModal
- HeaderShown: false

// Comments
/comments/[postId]
- Dynamic route
- HeaderShown: false
```

## Integration với Backend (Future)

### Story API
```typescript
// Upload story
POST /api/stories
Body: {
  image: string,
  duration: number, // 24 hours
}
Response: {
  story: Story,
  expiresAt: string
}

// Get stories
GET /api/stories
Response: {
  stories: Story[]
}

// View story
POST /api/stories/:id/view
Response: { viewCount: number }
```

### Comments API
```typescript
// Get comments
GET /api/posts/:postId/comments
Query: { page, limit }
Response: {
  comments: Comment[],
  hasMore: boolean
}

// Add comment
POST /api/posts/:postId/comments
Body: { text: string }
Response: { comment: Comment }

// Like comment
POST /api/comments/:id/like
Response: { likes: number }

// Reply to comment
POST /api/comments/:id/reply
Body: { text: string }
Response: { reply: Comment }
```

### Bookmark API
```typescript
// Save post
POST /api/posts/:id/save
Response: { saved: true }

// Unsave post
DELETE /api/posts/:id/save
Response: { saved: false }

// Get saved posts
GET /api/saved
Response: { posts: Post[] }
```

## Features Implemented

### ✅ Story Features
- [x] Create story screen
- [x] Image selection (mock)
- [x] Full-screen preview
- [x] Editing tools UI
- [x] Share functionality
- [x] Success feedback
- [x] Navigation integration

### ✅ Comments Features
- [x] Comments screen
- [x] View comments
- [x] Add comment
- [x] Like/Unlike comments
- [x] Reply button (UI)
- [x] Keyboard handling
- [x] Real-time updates
- [x] Navigation from post

### ✅ Bookmark Features
- [x] Unsave functionality
- [x] Toggle save/unsave
- [x] Visual feedback
- [x] State management

## Future Enhancements

### Stories
- [ ] Story viewer (swipe through stories)
- [ ] Story reactions
- [ ] Story replies (DM)
- [ ] Story highlights
- [ ] Story analytics (views, replies)
- [ ] Story privacy settings
- [ ] Close friends stories
- [ ] Story archive
- [ ] Boomerang/Layout modes
- [ ] Story polls/questions

### Comments
- [ ] Nested replies
- [ ] Comment notifications
- [ ] Mention users (@username)
- [ ] Comment moderation
- [ ] Pin comments
- [ ] Delete comments
- [ ] Edit comments
- [ ] Report comments
- [ ] Comment filters
- [ ] Load more comments (pagination)

### Bookmarks
- [ ] Saved collections
- [ ] Organize saved posts
- [ ] Share saved collection
- [ ] Export saved posts
- [ ] Saved posts screen
- [ ] Search saved posts

## Performance

- Lazy load comments
- Pagination for comments
- Optimistic UI updates
- Cache comments locally
- Debounce comment input
- Image compression for stories
- Story expiration (24h)
- Clean up expired stories

## Accessibility

- Screen reader support
- Keyboard navigation
- High contrast mode
- Font scaling
- Alt text for images
- Clear labels
- Touch targets (min 44x44)
- Loading states
- Error messages

## Security

- Content moderation
- Spam detection
- Rate limiting
- Profanity filter
- Report functionality
- Block users
- Hide comments
- Disable comments option
