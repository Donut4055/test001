# Feature: Private Profiles & Follow System

## Tổng Quan (Overview)

Đã thêm hệ thống private profile và follow request giống Instagram, cho phép người dùng:
- Đặt tài khoản ở chế độ riêng tư (private)
- Gửi yêu cầu follow cho tài khoản private
- Chấp nhận/từ chối follow request
- Chỉ người follow mới xem được nội dung của tài khoản private

## Các Tính Năng Chính

### 1. **Private Account**
- Tài khoản private có icon khóa 🔒 bên cạnh username
- Người dùng không follow không thể xem posts
- Hiển thị thông báo "This Account is Private"
- Vẫn hiển thị thông tin cơ bản: avatar, bio, số lượng posts/followers/following

### 2. **Follow System**
- **Public Account**: Click "Follow" → Ngay lập tức following
- **Private Account**: Click "Follow" → Gửi follow request (nút đổi thành "Requested")
- Click "Following" → Unfollow
- Click "Requested" → Hủy follow request

### 3. **Follow States**
- `isFollowing`: Đang follow người dùng
- `followRequestPending`: Đã gửi follow request, chờ chấp nhận
- `followsYou`: Người dùng này đang follow bạn (hiển thị badge "Follows you")

## Cấu Trúc Code

### 1. Types (`types/instagram.ts`)
```typescript
interface User {
  id: string;
  username: string;
  avatar: string;
  fullName: string;
  bio?: string;
  followers?: number;
  following?: number;
  posts?: number;
  isPrivate?: boolean;           // Tài khoản private
  isFollowing?: boolean;          // Đang follow
  followRequestPending?: boolean; // Follow request đang chờ
  followsYou?: boolean;          // Người này follow bạn
}
```

### 2. Follow Context (`contexts/FollowContext.tsx`)
Quản lý trạng thái follow toàn cục:

**Functions:**
- `followUser(userId, isPrivate)` - Follow hoặc gửi request
- `unfollowUser(userId)` - Unfollow
- `acceptFollowRequest(userId)` - Chấp nhận request (chủ tài khoản)
- `cancelFollowRequest(userId)` - Hủy request đã gửi

**State:**
```typescript
{
  [userId]: {
    isFollowing: boolean;
    followRequestPending: boolean;
  }
}
```

### 3. User Profile Screen (`app/user/[id].tsx`)

**Logic chính:**
```typescript
// Kiểm tra có thể xem posts không
const canViewPosts = !user?.isPrivate || userFollowState.isFollowing;

// Nếu không thể xem → hiển thị private message
if (!canViewPosts) {
  return <PrivateMessage />;
}
```

**Button States:**
- `Follow` (blue) - Chưa follow
- `Requested` (gray) - Đã gửi request
- `Following` (gray) - Đang follow

## Mock Data

### Users với các trạng thái khác nhau:

1. **johndoe** (id: '1')
   - Public account
   - Chưa follow

2. **janedoe** (id: '2')
   - **Private account** ✅
   - Follows you
   - Chưa follow lại

3. **photographer** (id: '3')
   - Public account
   - Đang following

4. **traveler** (id: '4')
   - **Private account** ✅
   - Chưa follow

5. **foodie** (id: '5')
   - Public account
   - Đang following
   - Follows you (mutual)

## UI Components

### Private Profile Message
```
┌─────────────────────────┐
│    🔒 (Lock Icon)       │
│                         │
│ This Account is Private │
│                         │
│ Follow this account to  │
│ see their photos and    │
│ videos.                 │
└─────────────────────────┘
```

### Header với Lock Icon
```
← username 🔒 ⋮
```

### Follow States Visual
```
[  Follow  ]  → Blue button (public)
[ Requested ] → Gray button (pending)
[ Following ] → Gray button (following)
```

### Follows You Badge
```
┌──────────────┐
│ Follows you  │ (Gray badge)
└──────────────┘
```

## User Flow

### Scenario 1: Follow Public Account
1. User click "Follow" button
2. Button chuyển thành "Following" (gray)
3. Có thể xem tất cả posts ngay lập tức

### Scenario 2: Follow Private Account
1. User click "Follow" button
2. Button chuyển thành "Requested" (gray)
3. Hiển thị private message
4. Chờ chủ tài khoản chấp nhận
5. Sau khi được chấp nhận → "Following" → Xem được posts

### Scenario 3: Cancel Follow Request
1. User đã gửi request (button = "Requested")
2. Click "Requested" button
3. Button chuyển về "Follow"
4. Request bị hủy

### Scenario 4: Unfollow
1. User đang following (button = "Following")
2. Click "Following" button
3. Button chuyển về "Follow"
4. Nếu là private account → Không xem được posts nữa

## Testing

### Test Cases:

1. **Test Private Account Display**
   - Navigate to user id='2' (janedoe) hoặc id='4' (traveler)
   - Verify: Lock icon hiển thị bên cạnh username
   - Verify: Private message hiển thị thay vì posts

2. **Test Follow Request**
   - Click "Follow" trên private account
   - Verify: Button đổi thành "Requested"
   - Verify: Vẫn không xem được posts

3. **Test Cancel Request**
   - Click "Requested" button
   - Verify: Button đổi về "Follow"

4. **Test Follow Public Account**
   - Navigate to user id='1' (johndoe)
   - Click "Follow"
   - Verify: Button đổi thành "Following"
   - Verify: Có thể xem posts

5. **Test Unfollow**
   - Navigate to user id='3' (photographer) - đang following
   - Click "Following"
   - Verify: Button đổi về "Follow"

6. **Test "Follows You" Badge**
   - Navigate to user id='2' (janedoe) hoặc id='5' (foodie)
   - Verify: Badge "Follows you" hiển thị

## Future Enhancements

- [ ] Notifications cho follow requests
- [ ] Follow request management screen
- [ ] Accept/Reject follow requests
- [ ] Follower/Following lists
- [ ] Block user functionality
- [ ] Close friends feature
- [ ] Restrict accounts
- [ ] Remove follower
- [ ] Mute/Hide stories from specific users

## Technical Notes

### State Management
- Sử dụng React Context API cho global follow state
- State persist trong session (reset khi reload app)
- Có thể tích hợp với AsyncStorage để persist data
- Có thể tích hợp với backend API

### Performance
- Follow state được cache trong context
- Không cần re-fetch user data khi toggle follow
- Optimistic UI updates

### Accessibility
- Tất cả buttons có proper touch targets
- Clear visual feedback cho mọi action
- Descriptive text cho screen readers

## API Integration (Future)

Khi tích hợp với backend:

```typescript
// Follow user
POST /api/users/:id/follow
Body: { isPrivate: boolean }
Response: { status: 'following' | 'requested' }

// Unfollow user
DELETE /api/users/:id/follow

// Get follow requests
GET /api/follow-requests

// Accept follow request
POST /api/follow-requests/:id/accept

// Reject follow request
POST /api/follow-requests/:id/reject
```
