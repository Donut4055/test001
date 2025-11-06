# Feature: Create Post & Follower Notifications

## Tổng Quan (Overview)

Hệ thống tạo bài viết hoàn chỉnh với tính năng thông báo tự động cho followers:
- ✅ Tạo bài viết mới với hình ảnh và caption
- ✅ Tự động gửi notification cho tất cả followers
- ✅ Post hiển thị ngay trên feed
- ✅ Badge notification tăng lên cho followers
- ✅ UI/UX giống Instagram

## Các Tính Năng Chính

### 1. **Create Post Screen**

#### Giao Diện
- Header với nút Close và Post
- User info (avatar + username)
- Image selector với preview
- Caption input (max 2200 characters)
- Additional options (Tag People, Add Location, Advanced Settings)
- Notification info banner

#### Workflow
1. Click icon "+" trên header
2. Select image (mock random image)
3. Write caption
4. Click "Post"
5. Post được tạo và hiển thị trên feed
6. Followers nhận notification

### 2. **Post Context**

#### State Management
```typescript
{
  posts: Post[];
  createPost: (image, caption, addNotification) => void;
  deletePost: (postId) => void;
  likePost: (postId) => void;
  unlikePost: (postId) => void;
  savePost: (postId) => void;
  unsavePost: (postId) => void;
}
```

#### Create Post Logic
```typescript
createPost(image, caption, addNotification) {
  // 1. Create new post
  const newPost = {
    id: unique_id,
    user: currentUser,
    image,
    caption,
    likes: 0,
    comments: 0,
    timestamp: 'Just now',
    isLiked: false,
    isSaved: false,
  };
  
  // 2. Add to feed
  setPosts([newPost, ...posts]);
  
  // 3. Notify followers
  followers.forEach(follower => {
    addNotification({
      type: 'follow',
      user: currentUser,
      message: 'posted a new photo',
      timestamp: now,
      read: false,
    });
  });
}
```

### 3. **Follower Notifications**

#### Ai Nhận Notification?
- Tất cả users có `followsYou: true`
- Trong mock data: janedoe (id=2) và foodie (id=5)

#### Notification Format
```
┌─────────────────────────────┐
│ [Avatar] myusername         │
│ posted a new photo          │
│ Just now                • │
└─────────────────────────────┘
```

#### Badge Update
- Badge trên Notifications tab tăng lên
- Hiển thị số lượng unread notifications
- Badge màu đỏ (#ed4956)

## UI Components

### Create Post Screen

#### Header
```
✕ New Post                Post
```

#### Image Selection
```
┌─────────────────────────┐
│                         │
│    📷 Select Image      │
│                         │
└─────────────────────────┘
```

#### Selected Image
```
┌─────────────────────────┐
│    [Image Preview]      │
│                         │
│   [Change Image]        │
└─────────────────────────┘
```

#### Caption Input
```
┌─────────────────────────┐
│ Write a caption...      │
│                         │
│                         │
│              0/2200     │
└─────────────────────────┘
```

#### Notification Banner
```
┌─────────────────────────┐
│ 🔔 Your followers will  │
│    be notified about    │
│    this post            │
└─────────────────────────┘
```

### Home Feed Header

#### Updated Header
```
Instagram        + ♥ ✉
```
- Icon "+" để tạo post mới
- Click → Navigate to create-post screen

## Cấu Trúc Code

### 1. Create Post Screen (`app/create-post.tsx`)

#### Features
- Image selection (mock với random images)
- Caption input với character counter
- Post button (disabled nếu chưa có image)
- Success alert khi post
- Auto navigate back sau khi post

### 2. Post Context (`contexts/PostContext.tsx`)

#### Responsibilities
- Manage posts state
- Create new posts
- Handle like/unlike
- Handle save/unsave
- Delete posts
- Notify followers khi có post mới

### 3. Integration

#### Provider Hierarchy
```
FriendRequestProvider
  └─ PostProvider
      └─ FollowProvider
          └─ App
```

#### Data Flow
```
User clicks Post
  ↓
createPost(image, caption, addNotification)
  ↓
Create new post object
  ↓
Add to posts array
  ↓
For each follower:
  ↓
Create notification
  ↓
addNotification(notification)
  ↓
Badge updates
  ↓
Follower sees notification
```

## Mock Data

### Current User Followers
Trong mock data, những user này follow currentUser (followsYou: true):
- **janedoe** (id: '2')
- **foodie** (id: '5')

Khi tạo post mới, 2 users này sẽ nhận notification.

### Sample Post
```typescript
{
  id: 'post1234567890',
  user: currentUser,
  image: 'https://picsum.photos/400/500?random=100',
  likes: 0,
  caption: 'Beautiful day! ☀️ #photography',
  comments: 0,
  timestamp: 'Just now',
  isLiked: false,
  isSaved: false,
}
```

### Sample Notification
```typescript
{
  id: 'notif1234567890_2',
  type: 'follow',
  user: currentUser,
  message: 'posted a new photo',
  timestamp: '2024-11-06T20:45:00.000Z',
  read: false,
}
```

## User Flows

### Flow 1: Create Post
1. User ở Home screen
2. Click icon "+" trên header
3. Modal create-post mở ra
4. Click "Select Image"
5. Random image được chọn (mock)
6. Nhập caption: "Beautiful sunset 🌅"
7. Click "Post"
8. Alert: "Success! Followers will be notified"
9. Click OK
10. Quay về Home screen
11. Post mới hiển thị đầu tiên trong feed

### Flow 2: Follower Receives Notification
1. User A (janedoe) đang follow currentUser
2. currentUser tạo post mới
3. Notification được tạo cho janedoe
4. Badge trên Notifications tab tăng lên
5. janedoe click vào Notifications tab
6. Thấy: "myusername posted a new photo"
7. Click notification → Navigate to currentUser's profile

### Flow 3: View New Post in Feed
1. Post mới xuất hiện đầu tiên trong feed
2. Timestamp: "Just now"
3. Likes: 0
4. Comments: 0
5. User có thể like, comment, save như bình thường

## Testing

### Test Cases

1. **Test Create Post Button**
   - Go to Home screen
   - Verify: "+" icon visible in header
   - Click "+" icon
   - Verify: Create post screen opens

2. **Test Image Selection**
   - In create post screen
   - Click "Select Image"
   - Verify: Random image appears
   - Click "Change Image"
   - Verify: Different image appears

3. **Test Caption Input**
   - Type caption
   - Verify: Character counter updates
   - Type 2200+ characters
   - Verify: Input stops at 2200

4. **Test Post Button State**
   - Without image: Button disabled (gray)
   - With image: Button enabled (blue)

5. **Test Create Post**
   - Select image
   - Enter caption
   - Click "Post"
   - Verify: Success alert appears
   - Click OK
   - Verify: Back to home screen
   - Verify: New post at top of feed

6. **Test Follower Notification**
   - Create post
   - Check Notifications tab
   - Verify: Badge count increased
   - Verify: New notification appears
   - Verify: Message: "posted a new photo"
   - Verify: Timestamp: "Just now"

7. **Test Notification Badge**
   - Before post: Badge shows current count
   - After post: Badge increases by number of followers
   - In mock: Should increase by 2 (janedoe + foodie)

## Integration với Backend (Future)

### API Endpoints

```typescript
// Upload image
POST /api/upload
Body: FormData with image file
Response: { imageUrl: string }

// Create post
POST /api/posts
Body: {
  image: string,
  caption: string,
}
Response: {
  post: Post,
  notifiedFollowers: number
}

// Get posts
GET /api/posts
Query: { page, limit }
Response: {
  posts: Post[],
  hasMore: boolean
}

// Delete post
DELETE /api/posts/:id
Response: { success: boolean }
```

### Push Notifications

```typescript
// Send push notification to followers
POST /api/notifications/push
Body: {
  userIds: string[],
  title: string,
  body: string,
  data: {
    type: 'new_post',
    postId: string,
    userId: string
  }
}
```

### Real-time Updates

```typescript
// WebSocket event for new post
socket.on('new_post', (data) => {
  // Add post to feed
  // Show notification
  // Update badge
});

// WebSocket event for follower notification
socket.on('follower_notification', (data) => {
  // Add to notifications
  // Update badge
  // Show push notification
});
```

## Features Implemented

### ✅ Core Features
- [x] Create post screen
- [x] Image selection (mock)
- [x] Caption input with counter
- [x] Post button with validation
- [x] Add post to feed
- [x] Notify followers
- [x] Update notification badge
- [x] Success feedback
- [x] Navigation integration

### ✅ UI/UX
- [x] Instagram-style design
- [x] Modal presentation
- [x] Disabled state for post button
- [x] Character counter
- [x] Notification info banner
- [x] Success alert
- [x] Smooth navigation

### ✅ State Management
- [x] PostContext for posts
- [x] Integration with FriendRequestContext
- [x] Real-time badge updates
- [x] Optimistic UI updates

## Future Enhancements

- [ ] Real image picker (expo-image-picker)
- [ ] Image editing (crop, filter, adjust)
- [ ] Multiple image upload
- [ ] Video upload
- [ ] Tag people in photos
- [ ] Add location
- [ ] Advanced settings (comments off, hide like count)
- [ ] Draft posts
- [ ] Schedule posts
- [ ] Post analytics
- [ ] Share to stories
- [ ] Cross-post to other platforms
- [ ] Hashtag suggestions
- [ ] Mention suggestions
- [ ] Image compression
- [ ] Upload progress indicator
- [ ] Retry failed uploads

## Performance Considerations

- Image optimization before upload
- Lazy loading for feed
- Infinite scroll pagination
- Cache posts locally
- Optimistic UI updates
- Background upload
- Retry logic for failed uploads
- Network status detection

## Accessibility

- Alt text for images
- Screen reader support
- Keyboard navigation
- High contrast mode
- Font scaling support
- Touch target sizes (min 44x44)
- Clear error messages
- Loading states

## Security

- Image validation (type, size)
- Content moderation
- Rate limiting (max posts per day)
- Spam detection
- Inappropriate content filtering
- User blocking
- Report post functionality
