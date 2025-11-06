# Hướng Dẫn Tích Hợp REST API với Java Spring Boot

## Tổng Quan

Dự án đã được chuyển đổi để sử dụng REST API từ Java Spring Boot backend thay vì mock data. Hệ thống bao gồm:

### Backend (Java Spring Boot)
- **Entities**: User, Post, Comment, Message, Conversation, FriendRequest, Notification
- **Repositories**: JPA repositories cho tất cả entities
- **DTOs**: Data Transfer Objects để truyền dữ liệu giữa client và server
- **Database**: MySQL (cấu hình trong `application.yml`)

### Frontend (React Native)
- **API Services**: Các service classes để gọi REST API
- **Authentication**: JWT token-based authentication với AsyncStorage
- **Services**: authService, postService, userService, messageService, friendRequestService, notificationService

## Cài Đặt

### 1. Backend Setup

#### Cài đặt dependencies
```bash
cd API
./gradlew build
```

#### Cấu hình database
Cập nhật file `API/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test011?createDatabaseIfNotExist=true
    username: root
    password: donut_12321
```

#### Chạy backend
```bash
./gradlew bootRun
```
Server sẽ chạy tại: `http://localhost:8080`

### 2. Frontend Setup

#### Cài đặt dependencies
```bash
cd client
npm install
```

#### Cấu hình API URL
Cập nhật file `client/services/api.ts` nếu cần thay đổi URL:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

**Lưu ý**: Khi chạy trên thiết bị thật hoặc emulator, thay `localhost` bằng IP máy tính của bạn.

#### Chạy app
```bash
npm start
```

## Cấu Trúc API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Posts
- `GET /api/posts` - Lấy danh sách posts (có phân trang)
- `GET /api/posts/{id}` - Lấy chi tiết post
- `POST /api/posts` - Tạo post mới
- `DELETE /api/posts/{id}` - Xóa post
- `POST /api/posts/{id}/like` - Like post
- `DELETE /api/posts/{id}/like` - Unlike post
- `POST /api/posts/{id}/save` - Save post
- `DELETE /api/posts/{id}/save` - Unsave post
- `GET /api/posts/saved` - Lấy danh sách saved posts

### Users
- `GET /api/users/{id}` - Lấy thông tin user
- `GET /api/users/search?keyword={keyword}` - Tìm kiếm users
- `PUT /api/users/profile` - Cập nhật profile
- `POST /api/users/{id}/follow` - Follow user
- `DELETE /api/users/{id}/follow` - Unfollow user
- `GET /api/users/{id}/followers` - Lấy danh sách followers
- `GET /api/users/{id}/following` - Lấy danh sách following

### Messages
- `GET /api/conversations` - Lấy danh sách conversations
- `GET /api/conversations/{id}` - Lấy chi tiết conversation
- `GET /api/conversations/{id}/messages` - Lấy messages trong conversation
- `POST /api/messages` - Gửi message
- `PUT /api/messages/{id}/read` - Đánh dấu đã đọc
- `GET /api/messages/unread/count` - Đếm số message chưa đọc

### Friend Requests
- `POST /api/friend-requests` - Gửi friend request
- `PUT /api/friend-requests/{id}/accept` - Chấp nhận request
- `PUT /api/friend-requests/{id}/reject` - Từ chối request
- `DELETE /api/friend-requests/{id}` - Hủy request
- `GET /api/friend-requests/pending` - Lấy pending requests
- `GET /api/friend-requests/sent` - Lấy sent requests

### Notifications
- `GET /api/notifications` - Lấy danh sách notifications
- `PUT /api/notifications/{id}/read` - Đánh dấu đã đọc
- `PUT /api/notifications/read-all` - Đánh dấu tất cả đã đọc
- `GET /api/notifications/unread/count` - Đếm số notification chưa đọc
- `DELETE /api/notifications/{id}` - Xóa notification

## Sử Dụng Services trong React Native

### Authentication Example
```typescript
import authService from '../services/authService';

// Login
const handleLogin = async () => {
  try {
    const response = await authService.login({
      username: 'myusername',
      password: 'password123'
    });
    console.log('Logged in:', response.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Post Example
```typescript
import postService from '../services/postService';

// Get posts
const loadPosts = async () => {
  try {
    const posts = await postService.getPosts(0, 20);
    setPosts(posts);
  } catch (error) {
    console.error('Failed to load posts:', error);
  }
};

// Like post
const handleLike = async (postId: string) => {
  try {
    const updatedPost = await postService.likePost(postId);
    // Update UI
  } catch (error) {
    console.error('Failed to like post:', error);
  }
};
```

### Message Example
```typescript
import messageService from '../services/messageService';

// Send message
const handleSendMessage = async (receiverId: string, text: string) => {
  try {
    const message = await messageService.sendMessage({
      receiverId,
      text,
      type: 'text'
    });
    // Update UI
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
```

## Authentication Flow

1. User đăng nhập qua `authService.login()`
2. Backend trả về JWT token và user info
3. Token được lưu vào AsyncStorage
4. Mọi request sau đó tự động thêm token vào header thông qua axios interceptor
5. Nếu token hết hạn (401), user sẽ bị logout tự động

## Các Bước Tiếp Theo

### Backend
1. **Tạo Controllers**: Implement các REST controllers cho từng entity
2. **Tạo Services**: Business logic layer
3. **Implement Authentication**: JWT authentication với Spring Security
4. **Add Validation**: Validate request data
5. **Error Handling**: Global exception handler
6. **Testing**: Unit tests và integration tests

### Frontend
1. **Update Contexts**: Thay thế mock data bằng API calls trong các Context
2. **Error Handling**: Xử lý lỗi từ API
3. **Loading States**: Thêm loading indicators
4. **Offline Support**: Cache data với AsyncStorage
5. **Real-time Updates**: Tích hợp Socket.IO với backend

## Lưu Ý Quan Trọng

1. **CORS**: Backend cần cấu hình CORS để cho phép React Native app kết nối
2. **Network Security**: Trên Android, cần cấu hình network security config để cho phép HTTP (hoặc dùng HTTPS)
3. **IP Address**: Khi test trên thiết bị thật, thay `localhost` bằng IP máy tính
4. **Token Expiry**: Implement refresh token mechanism cho production
5. **Error Messages**: Hiển thị error messages thân thiện với người dùng

## Troubleshooting

### Backend không kết nối được
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra port 8080 có bị chiếm không
- Xem logs trong console

### Frontend không gọi được API
- Kiểm tra API_BASE_URL đúng chưa
- Kiểm tra network connectivity
- Xem logs trong React Native debugger
- Kiểm tra CORS configuration

### Token issues
- Clear AsyncStorage: `AsyncStorage.clear()`
- Login lại
- Kiểm tra token expiry time

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Native Documentation](https://reactnative.dev/)
- [Axios Documentation](https://axios-http.com/)
- [JWT.io](https://jwt.io/)
