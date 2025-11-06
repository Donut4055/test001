# Feature: Friend Requests & Notifications System

## Tổng Quan (Overview)

Hệ thống kết bạn và thông báo hoàn chỉnh với các tính năng:
- ✅ Gửi lời mời kết bạn
- ✅ Chấp nhận/Từ chối lời mời
- ✅ Hủy lời mời đã gửi
- ✅ Xóa bạn bè
- ✅ Notifications với badge đếm số thông báo chưa đọc
- ✅ Quản lý trạng thái bạn bè

## Các Tính Năng Chính

### 1. **Friend Request System**

#### Gửi Lời Mời Kết Bạn
- Click icon "Add Friend" trên profile người dùng
- Icon thay đổi để hiển thị trạng thái

#### Trạng Thái Friend Request
- **Not Friends**: Icon `person-add-outline` (gray)
- **Request Sent**: Icon `person-add` (gray) - Đã gửi lời mời
- **Request Received**: Icon `checkmark-circle` (gray) - Nhận được lời mời
- **Friends**: Icon `person-remove-outline` (green background) - Đã là bạn

### 2. **Notifications Screen**

#### Hiển Thị Thông báo
- Tab "Notifications" với icon trái tim ❤️
- Badge đỏ hiển thị số thông báo chưa đọc
- Danh sách thông báo theo thời gian

#### Loại Thông Báo
- **Friend Request**: Lời mời kết bạn mới
- **Friend Accept**: Chấp nhận kết bạn
- **Like**: Ai đó like bài viết
- **Comment**: Ai đó comment
- **Follow**: Ai đó follow bạn

#### Actions trong Notifications
- **Accept**: Chấp nhận lời mời kết bạn
- **Reject**: Từ chối lời mời
- Click vào notification → Đi đến profile người dùng
- "Mark all as read" → Đánh dấu tất cả đã đọc

### 3. **Visual Indicators**

#### Notification Badge
```
❤️ (2)  ← Red badge với số lượng
```

#### Unread Notification
- Background màu xanh nhạt (#f7f9fc)
- Blue dot bên phải

#### Friend Request Actions
```
┌─────────────────────────────┐
│ [Avatar] username           │
│ sent you a friend request   │
│ 2h                          │
│ ┌────────┐  ┌────────┐     │
│ │ Accept │  │ Reject │     │
│ └────────┘  └────────┘     │
└─────────────────────────────┘
```

## Cấu Trúc Code

### 1. Types (`types/instagram.ts`)

```typescript
interface FriendRequest {
  id: string;
  from: User;
  to: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface Notification {
  id: string;
  type: 'friend_request' | 'friend_accept' | 'like' | 'comment' | 'follow';
  user: User;
  message: string;
  timestamp: string;
  read: boolean;
  friendRequestId?: string;
}
```

### 2. Friend Request Context (`contexts/FriendRequestContext.tsx`)

#### State Management
```typescript
{
  friendRequests: FriendRequest[];
  notifications: Notification[];
  friends: string[]; // Array of user IDs
  unreadCount: number;
}
```

#### Functions
- `sendFriendRequest(toUser: User)` - Gửi lời mời
- `acceptFriendRequest(requestId: string)` - Chấp nhận
- `rejectFriendRequest(requestId: string)` - Từ chối
- `cancelFriendRequest(requestId: string)` - Hủy lời mời đã gửi
- `removeFriend(userId: string)` - Xóa bạn
- `markNotificationAsRead(notificationId: string)` - Đánh dấu đã đọc
- `markAllNotificationsAsRead()` - Đánh dấu tất cả đã đọc
- `isFriend(userId: string)` - Kiểm tra đã là bạn
- `hasPendingRequest(userId: string)` - Có request đang chờ
- `hasSentRequest(userId: string)` - Đã gửi request

### 3. Notifications Screen (`app/(tabs)/notifications.tsx`)

#### Features
- List tất cả notifications
- Accept/Reject buttons cho friend requests
- Time ago display (2h, 3d, 1w)
- Unread indicator (blue dot)
- Empty state với icon và message
- Click notification → Navigate to user profile

### 4. Tab Navigation với Badge

```typescript
<Tabs.Screen
  name="notifications"
  options={{
    tabBarIcon: ({ color, focused }) => (
      <View>
        <Ionicons name={focused ? 'heart' : 'heart-outline'} />
        {unreadCount > 0 && (
          <Badge>{unreadCount > 9 ? '9+' : unreadCount}</Badge>
        )}
      </View>
    ),
  }}
/>
```

## Mock Data

### Initial Friend Requests
```typescript
[
  {
    id: 'req1',
    from: johndoe,
    to: currentUser,
    status: 'pending',
    createdAt: '1 hour ago'
  },
  {
    id: 'req2',
    from: traveler,
    to: currentUser,
    status: 'pending',
    createdAt: '2 hours ago'
  }
]
```

### Initial Friends
- photographer (id: '3')
- foodie (id: '5')

## User Flows

### Flow 1: Gửi Friend Request
1. User vào profile người khác
2. Click icon "Add Friend" (person-add-outline)
3. Icon đổi thành "person-add" (filled)
4. Người nhận thấy notification mới
5. Badge tăng lên

### Flow 2: Nhận và Chấp Nhận Friend Request
1. User nhận notification với badge đỏ
2. Vào Notifications tab
3. Thấy "username sent you a friend request"
4. Click "Accept"
5. Trở thành bạn bè
6. Notification mới: "You are now friends"
7. Icon trên profile đổi thành green checkmark

### Flow 3: Từ Chối Friend Request
1. User nhận notification
2. Vào Notifications tab
3. Click "Reject"
4. Request bị từ chối
5. Notification marked as read
6. Không trở thành bạn

### Flow 4: Xóa Bạn
1. User vào profile bạn bè
2. Icon hiển thị "person-remove-outline" (green)
3. Click icon
4. Không còn là bạn
5. Icon quay về "person-add-outline"

## UI States

### User Profile - Friend Button States

| State | Icon | Color | Background |
|-------|------|-------|------------|
| Not Friends | person-add-outline | Black | Gray |
| Request Sent | person-add | Black | Gray |
| Request Received | checkmark-circle | Black | Gray |
| Friends | person-remove-outline | Green | Light Green |

### Notification States

| State | Background | Indicator |
|-------|------------|-----------|
| Unread | #f7f9fc | Blue dot |
| Read | White | None |

## Testing

### Test Cases

1. **Test Send Friend Request**
   - Go to user profile (not friend)
   - Click add friend icon
   - Verify icon changes
   - Check notifications for recipient

2. **Test Accept Friend Request**
   - Go to Notifications tab
   - See pending friend request
   - Click "Accept"
   - Verify: Friends list updated
   - Verify: New notification created
   - Verify: Icon on profile changes to green

3. **Test Reject Friend Request**
   - Go to Notifications tab
   - Click "Reject" on request
   - Verify: Request marked as rejected
   - Verify: Not added to friends

4. **Test Remove Friend**
   - Go to friend's profile
   - Click remove friend icon (green)
   - Verify: Removed from friends list
   - Verify: Icon changes back

5. **Test Notification Badge**
   - Send friend request
   - Verify: Badge appears on notifications tab
   - Verify: Badge shows correct count
   - Mark as read
   - Verify: Badge updates/disappears

6. **Test Mark All as Read**
   - Have multiple unread notifications
   - Click "Mark all as read"
   - Verify: All notifications marked as read
   - Verify: Badge disappears

## Integration với Backend (Future)

### API Endpoints

```typescript
// Send friend request
POST /api/friend-requests
Body: { toUserId: string }
Response: { requestId: string, status: 'pending' }

// Accept friend request
POST /api/friend-requests/:id/accept
Response: { status: 'accepted' }

// Reject friend request
POST /api/friend-requests/:id/reject
Response: { status: 'rejected' }

// Cancel friend request
DELETE /api/friend-requests/:id

// Remove friend
DELETE /api/friends/:userId

// Get friend requests
GET /api/friend-requests
Response: { requests: FriendRequest[] }

// Get notifications
GET /api/notifications
Response: { notifications: Notification[], unreadCount: number }

// Mark notification as read
PUT /api/notifications/:id/read

// Mark all as read
PUT /api/notifications/read-all
```

### WebSocket Events (Real-time)

```typescript
// Receive friend request
socket.on('friend_request', (data) => {
  // Add to notifications
  // Update badge count
});

// Friend request accepted
socket.on('friend_request_accepted', (data) => {
  // Add to friends list
  // Show notification
});

// New notification
socket.on('notification', (data) => {
  // Add to notifications
  // Update badge
});
```

## Performance Considerations

- Notifications cached in context
- Lazy loading for old notifications
- Optimistic UI updates
- Badge count calculated efficiently
- Real-time updates via WebSocket (future)

## Accessibility

- All buttons have proper touch targets (min 44x44)
- Clear visual feedback for all actions
- Descriptive text for screen readers
- Color is not the only indicator (icons + text)

## Future Enhancements

- [ ] Push notifications
- [ ] Friend suggestions
- [ ] Mutual friends display
- [ ] Friend lists/groups
- [ ] Block user
- [ ] Report user
- [ ] Notification preferences
- [ ] Notification sounds
- [ ] In-app notification popup
- [ ] Friend request expiration
- [ ] Bulk actions (accept all, reject all)
