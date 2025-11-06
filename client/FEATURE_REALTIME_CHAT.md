# Feature: Real-time Chat với Socket.IO

## Tổng Quan (Overview)

Hệ thống chat realtime hoàn chỉnh với Socket.IO:
- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Online status
- ✅ Unread message badges
- ✅ Message history
- ✅ 1-on-1 conversations
- ✅ Socket.IO integration

## Các Tính Năng Chính

### 1. **Socket.IO Service** (`services/socket.ts`)

#### Features
- Connect/Disconnect to Socket.IO server
- Send messages in real-time
- Receive messages instantly
- Typing indicators
- Online status tracking
- Mark messages as read
- Auto-reconnection
- Event subscriptions

#### Socket Events
```typescript
// Client → Server
- 'send_message': Gửi tin nhắn
- 'typing': Gửi typing indicator
- 'mark_read': Đánh dấu đã đọc

// Server → Client
- 'message': Nhận tin nhắn mới
- 'typing': Nhận typing indicator
- 'online_status': Nhận online status
- 'connect': Kết nối thành công
- 'disconnect': Mất kết nối
- 'error': Lỗi xảy ra
```

### 2. **Chat Context** (`contexts/ChatContext.tsx`)

#### State Management
```typescript
{
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  isTyping: { [userId: string]: boolean };
  onlineUsers: { [userId: string]: boolean };
  totalUnreadCount: number;
}
```

#### Functions
- `sendMessage(receiverId, text, type)` - Gửi tin nhắn
- `markAsRead(conversationId)` - Đánh dấu đã đọc
- `getConversation(userId)` - Lấy conversation
- `setTyping(userId, isTyping)` - Set typing indicator

### 3. **Messages Screen** (`app/(tabs)/messages.tsx`)

#### Features
- Danh sách conversations
- Last message preview
- Unread count badge
- Online status indicator (green dot)
- Time ago display
- Empty state
- Navigate to chat

#### UI
```
Messages                    ✎

┌─────────────────────────┐
│ [Avatar🟢] johndoe      │
│ You: See you!      2h   │
└─────────────────────────┘

┌─────────────────────────┐
│ [Avatar] janedoe    (1) │
│ Hey! How are you?  5h   │
└─────────────────────────┘
```

### 4. **Chat Screen** (`app/chat/[userId].tsx`)

#### Features
- Real-time messaging
- Message bubbles (left/right)
- Typing indicator ("typing...")
- Online status ("Active now")
- Send text messages
- Message input với auto-expand
- Quick actions (camera, mic, image, emoji)
- Video/Voice call buttons (UI)
- Navigate to user profile

#### UI
```
← [Avatar🟢] johndoe        📹 📞
  Active now

┌─────────────────────────┐
│     Hey! How are you? ◄ │
│                         │
│ ► I'm good, thanks!     │
└─────────────────────────┘

📷 [Message...]  🎤 📷 😊
```

## Cấu Trúc Code

### 1. Types (`types/instagram.ts`)

```typescript
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'emoji';
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}
```

### 2. Socket Service

```typescript
class SocketService {
  connect(userId: string)
  disconnect()
  sendMessage(message: Message)
  sendTyping(receiverId: string, isTyping: boolean)
  markAsRead(messageId: string)
  onMessage(callback)
  onTyping(callback)
  onOnlineStatus(callback)
  isConnected(): boolean
}
```

### 3. Chat Flow

```
User types message
  ↓
handleTextChange()
  ↓
Send typing indicator
  ↓
User clicks Send
  ↓
sendMessage()
  ↓
socketService.sendMessage()
  ↓
Optimistic UI update
  ↓
Server receives message
  ↓
Server broadcasts to receiver
  ↓
Receiver's socket gets 'message' event
  ↓
handleIncomingMessage()
  ↓
Update conversations & messages
  ↓
Badge updates
  ↓
Receiver sees message
```

## Mock Data

### Initial Conversations
```typescript
[
  {
    id: 'conv1',
    participants: [currentUser, johndoe],
    lastMessage: {
      text: 'Hey! How are you?',
      timestamp: '1h ago',
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: 'conv2',
    participants: [currentUser, janedoe],
    lastMessage: {
      text: 'See you tomorrow!',
      timestamp: '2h ago',
      read: true,
    },
    unreadCount: 0,
  },
]
```

## User Flows

### Flow 1: View Messages
1. User click Messages tab
2. Thấy danh sách conversations
3. Conversation với unread có badge đỏ
4. Online users có green dot
5. Last message preview hiển thị

### Flow 2: Send Message
1. User click vào conversation
2. Chat screen mở
3. Thấy message history
4. Type message: "Hello!"
5. Other user thấy "typing..."
6. Click Send
7. Message xuất hiện ngay lập tức (optimistic)
8. Server confirms
9. Other user nhận message realtime
10. Badge tăng lên

### Flow 3: Receive Message
1. User đang ở Messages screen
2. Socket receives 'message' event
3. Conversation cập nhật
4. Last message thay đổi
5. Badge tăng lên
6. Conversation move to top
7. User click vào conversation
8. Messages marked as read
9. Badge về 0

### Flow 4: Typing Indicator
1. User A types in chat
2. Socket emits 'typing' event
3. User B sees "typing..."
4. User A stops typing (2s timeout)
5. "typing..." disappears
6. User B sees "Active now"

### Flow 5: Online Status
1. User connects to socket
2. Server broadcasts online status
3. Other users see green dot
4. User disconnects
5. Server broadcasts offline status
6. Green dot disappears

## Socket.IO Server (Backend)

### Server Setup (Node.js)
```javascript
const io = require('socket.io')(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = new Map(); // userId → socketId

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  users.set(userId, socket.id);
  
  // Broadcast online status
  socket.broadcast.emit('online_status', {
    userId,
    isOnline: true
  });

  // Handle send message
  socket.on('send_message', (message) => {
    // Save to database
    saveMessage(message);
    
    // Send to receiver
    const receiverSocketId = users.get(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message', message);
    }
    
    // Confirm to sender
    socket.emit('message', message);
  });

  // Handle typing
  socket.on('typing', ({ receiverId, isTyping }) => {
    const receiverSocketId = users.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', {
        userId,
        isTyping
      });
    }
  });

  // Handle mark read
  socket.on('mark_read', ({ messageId }) => {
    updateMessageReadStatus(messageId);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    users.delete(userId);
    socket.broadcast.emit('online_status', {
      userId,
      isOnline: false
    });
  });
});
```

## Testing

### Test Cases

1. **Test Socket Connection**
   - Open app
   - Verify: Socket connects
   - Check console: "✅ Socket connected"

2. **Test View Conversations**
   - Go to Messages tab
   - Verify: 2 conversations visible
   - Verify: johndoe has unread badge (1)
   - Verify: Last messages displayed

3. **Test Send Message**
   - Click on conversation
   - Type: "Hello!"
   - Click Send
   - Verify: Message appears immediately
   - Verify: Message bubble on right (blue)

4. **Test Receive Message**
   - Have another device/user send message
   - Verify: Message appears instantly
   - Verify: Message bubble on left (gray)
   - Verify: Badge increases

5. **Test Typing Indicator**
   - Start typing
   - Verify: Other user sees "typing..."
   - Stop typing for 2 seconds
   - Verify: "typing..." disappears

6. **Test Online Status**
   - User online: Green dot visible
   - User offline: No green dot
   - Header shows "Active now" when online

7. **Test Mark as Read**
   - Open conversation with unread
   - Verify: Badge disappears
   - Verify: Messages marked as read

8. **Test Badge Count**
   - Messages tab shows total unread
   - Badge updates in realtime
   - Badge disappears when all read

## Configuration

### Socket URL
```typescript
// services/socket.ts
const SOCKET_URL = 'http://localhost:3000';

// For production
const SOCKET_URL = 'https://your-server.com';

// For development (local network)
const SOCKET_URL = 'http://192.168.1.100:3000';
```

### Connection Options
```typescript
{
  query: { userId },
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
}
```

## Features Implemented

### ✅ Core Features
- [x] Socket.IO integration
- [x] Real-time messaging
- [x] Typing indicators
- [x] Online status
- [x] Message history
- [x] Unread badges
- [x] Conversations list
- [x] 1-on-1 chat
- [x] Mark as read
- [x] Optimistic updates

### ✅ UI/UX
- [x] Message bubbles
- [x] Online indicators
- [x] Typing animation
- [x] Time ago display
- [x] Unread badges
- [x] Empty states
- [x] Keyboard handling
- [x] Auto-scroll to bottom

## Future Enhancements

### Messaging
- [ ] Image messages
- [ ] Voice messages
- [ ] Video messages
- [ ] Emoji reactions
- [ ] Message replies
- [ ] Message forwarding
- [ ] Delete messages
- [ ] Edit messages
- [ ] Message search
- [ ] Message encryption (E2E)

### Features
- [ ] Group chats
- [ ] Voice calls
- [ ] Video calls
- [ ] Screen sharing
- [ ] File sharing
- [ ] Location sharing
- [ ] Contact sharing
- [ ] Message scheduling
- [ ] Auto-delete messages
- [ ] Message pinning

### Notifications
- [ ] Push notifications
- [ ] Message previews
- [ ] Notification sounds
- [ ] Custom ringtones
- [ ] Do not disturb
- [ ] Mute conversations

### UI/UX
- [ ] Message status (sent, delivered, read)
- [ ] Last seen timestamp
- [ ] Message timestamps
- [ ] Swipe to reply
- [ ] Long press menu
- [ ] Message selection
- [ ] Copy/Paste
- [ ] Link previews
- [ ] GIF support
- [ ] Sticker support

## Performance

- Lazy load messages (pagination)
- Cache messages locally
- Optimize socket events
- Debounce typing indicators
- Throttle scroll events
- Virtual list for long conversations
- Image compression
- Background sync

## Security

- Message encryption
- Secure socket connection (WSS)
- Authentication tokens
- Rate limiting
- Spam detection
- Block users
- Report messages
- Content moderation

## Accessibility

- Screen reader support
- Voice control
- High contrast mode
- Font scaling
- Keyboard shortcuts
- Clear labels
- Touch targets
- Loading states

## Dependencies

```json
{
  "socket.io-client": "^4.x.x"
}
```

## Installation

```bash
npm install socket.io-client
```

## Usage

```typescript
// Connect to socket
import socketService from '@/services/socket';
socketService.connect(currentUser.id);

// Send message
socketService.sendMessage(message);

// Listen for messages
socketService.onMessage((message) => {
  console.log('New message:', message);
});

// Disconnect
socketService.disconnect();
```
