1. First Create backend
   i. index.js

ii. connect to Mongoose Db

2. Mongoose Schema
   Instagram Clone

User
│
├── Posts
├── Followers
├── Following
├── Conversations
├── Notifications
└── Comments

Post
│
├── Images
├── Owner(User)
├── Comments
├── Likes
└── Saved(optional later)

Comment
│
├── User
├── Post
├── Parent Comment
├── Replies
└── Likes

Conversation
│
├── Participants
└── Messages

Message
│
├── Sender
├── Conversation
├── Text
├── Images
├── Voice
├── Shared Post
└── Reactions

Notification
│
├── Receiver
├── Sender
├── Related Post
├── Related Comment
└── Type

Relationship Diagram
User
│
┌───────────┼────────────┐
│ │ │
▼ ▼ ▼
Post Conversation Notification
│ │
▼ ▼
Comment Message

One User can create many Posts.
One User can write many Comments.
One User can join many Conversations.
One User can send many Messages.
One User can receive many Notifications.

# user Model

User

\_id

username

email

password

name

bio

website

profilePicture

isPrivate

followers[]

following[]

refreshToken

createdAt

updatedAt

# Relationships

User

1 -------> Many Posts

1 -------> Many Comments

1 -------> Many Messages

1 -------> Many Notifications

Many <-------> Many Followers

# Post Model

Post

\_id

owner

caption

images[]

likes[]

commentsCount

isArchived

createdAt

updatedAt

# Relationship

User

1

↓

Many

Post

# Comment Model

Comment

\_id

post

owner

text

parentComment

likes[]

createdAt

updatedAt

# Relationship

Post

1

↓

Many

Comments

# Conversation Model

Conversation

\_id

participants[]

lastMessage

isGroup

groupName

groupImage

createdAt

updatedAt

# Relationship

Users

Many

↓

Many

Conversation

# Message Model

Message

\_id

conversation

sender

text

images[]

voiceMessage

sharedPost

reactions[]

isRead

createdAt

updatedAt

# Relationship

Conversation

1

↓

Many

Messages

# Notification Model

Notification

\_id

receiver

sender

type

post

comment

message

isRead

createdAt

Type can be:
like

comment

reply

follow

follow_request

mention

message



Comment Model.
User (1)
   │
   │ writes
   ▼
Comment (Many)
   │
   │ belongs to
   ▼
Post (1)