package com.ra.base_spring_boot.model;

import com.ra.base_spring_boot.model.base.BaseObject;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseObject {
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String fullName;
    
    private String avatar;
    
    @Column(length = 500)
    private String bio;
    
    private Integer followers = 0;
    
    private Integer following = 0;
    
    private Integer postsCount = 0;
    
    @Column(nullable = false)
    private Boolean isPrivate = false;
    
    @Column(nullable = false)
    private Boolean isOnline = false;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Post> posts = new HashSet<>();
    
    @OneToMany(mappedBy = "fromUser", cascade = CascadeType.ALL)
    private Set<FriendRequest> sentRequests = new HashSet<>();
    
    @OneToMany(mappedBy = "toUser", cascade = CascadeType.ALL)
    private Set<FriendRequest> receivedRequests = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "user_followers",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    private Set<User> followersList = new HashSet<>();
    
    @ManyToMany(mappedBy = "followersList")
    private Set<User> followingList = new HashSet<>();
}
