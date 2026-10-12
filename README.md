# SkillSync — Backend Services

**A Production-Ready, Real-Time Networking & AI Collaboration Engine for Developers.**

<p>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18.x-green.svg?style=flat-square&logo=node.js" alt="Node.js"></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-5.x-blue.svg?style=flat-square&logo=express" alt="Express"></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Atlas-success.svg?style=flat-square&logo=mongodb" alt="MongoDB"></a>
  <a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-4.x-black.svg?style=flat-square&logo=socket.io" alt="Socket.io"></a>
  <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=flat-square&logo=google" alt="Gemini AI"></a>
  <a href="https://razorpay.com/"><img src="https://img.shields.io/badge/Razorpay-Payments-02042B?style=flat-square&logo=razorpay" alt="Razorpay"></a>
  <a href="https://aws.amazon.com/ec2/"><img src="https://img.shields.io/badge/AWS-EC2_%2B_Nginx-FF9900?style=flat-square&logo=amazon-aws" alt="AWS EC2"></a>
</p>

---

## Executive Summary
**SkillSync** is the high-performance backend architecture powering a developer matchmaking and networking platform (often described as *"LinkedIn meets Tinder for Developers with an AI Copilot"*). 

It provides robust, secure RESTful APIs, real-time bidirectional communication via WebSockets, natively integrated Google Gemini AI tooling, and a Razorpay payment gateway — engineered for production and deployed on **AWS EC2** with **Nginx** and **PM2**.

* **Frontend Repository:** [https://github.com/ani1911/SkillSync-frontend](https://github.com/ani1911/SkillSync-frontend)

---

## Platform Workflow (4-Stage Collaboration Lifecycle)

To ensure high-intent networking instead of superficial connections, SkillSync implements an intentional 4-stage collaboration lifecycle:

1. **Discover:** Developers browse a dynamic feed filtered by tech stack (MongoDB `$nin` aggregation excluding self, swiped, and connected users).
2. **Mutual Match:** Swiping "like" detects bidirectional interest, elevating both users to mutual matches.
3. **Connect with Pitch Note:** Developers send formal connection requests with an optional pitch note (up to 300 characters). Includes reverse-invite auto-accept resolution.
4. **Chat & @ai Copilot:** Accepted connections unlock real-time WebSocket messaging and in-chat Google Gemini AI pair programming.

---

## System Architecture

```mermaid
graph TD
    Client[Frontend Client - React 19 SPA] <-->|REST API| Express[Express Server]
    Client <-->|WebSockets| SocketIO[Socket.io Server]
    
    Nginx[Nginx Reverse Proxy / AWS EC2] -->|HTTP / WS Upgrade| Express
    Nginx -->|WS Upgrade| SocketIO
    
    Express <--> Mongo[(MongoDB Atlas)]
    SocketIO <--> Mongo
    
    SocketIO <-->|Intercepts @ai tags| AI[Google Gemini 3.8 Flash]
    AI -->|Generates Response| SocketIO
    
    Express <-->|Order & Verify| Razorpay[Razorpay Payment Gateway]
```

---

## Core Engineering Highlights

### 1. Real-Time Socket Architecture
- **Bi-Directional Chat:** Instant message delivery using `Socket.io` with isolated private rooms generated deterministically (`[userA, userB].sort().join("_")`) to prevent duplicate threads and race conditions.
- **Stateful Connections:** Efficiently tracks online presence and manages graceful socket disconnections to prevent memory leaks.
- **Persistence-First Pattern:** Messages are saved to MongoDB before room broadcasting, guaranteeing zero message loss during momentary network latency.

### 2. Google Gemini AI Integration (`@ai`)
- **Native In-Chat Assistant:** Embedded `@google/genai` (Gemini 3.8 Flash) acts as an intelligent third participant in developer conversations.
- **Contextual Memory:** Intercepts `@ai` tags mid-stream, retrieves recent conversation turns from MongoDB as context, and returns syntax-highlighted Markdown.
- **Cost-Optimized & Gated:** Gated to accepted developer connections with strict context limits to keep latency sub-second and minimize token consumption.

### 3. Matchmaking & 4-Stage Connection Engine
- **Algorithmic Discovery:** Aggregates developer profiles with `$nin` exclusions (excluding self, already-swiped users, and existing connections).
- **Mutual Match State:** Detects bidirectional "likes" and elevates developers to the mutual Matches stage.
- **Pitch Notes & Edge Cases:** Developers send connection requests with personalized pitch notes, with auto-accept handling if a reverse request already exists.

### 4. Monetization & Razorpay Integration
- **Pro Membership Pass:** Backend handles order creation, status auditing, and user tier upgrades.
- **Cryptographic Verification:** Verifies payment authenticity via server-side HMAC-SHA256 signature checks.
- **Development Mock Support:** Built-in test fallback to ensure seamless local evaluation without requiring live payment credentials.

### 5. Security & Authentication
- **Secure Cookie JWT:** `httpOnly` and `SameSite` cookie authentication prevents XSS token extraction.
- **Data Sanitization:** Strict Mongoose schemas, password hashing with `bcrypt` (10 rounds), and field whitelisting to prevent mass assignment.
- **Protected Projections:** Public profile endpoints strictly filter out sensitive properties (`-password -emailId`).

### 6. Cloud Deployment & Production DevOps (AWS EC2)
- **AWS EC2 Ubuntu Host:** Hosted on AWS EC2 with system-level process management via **PM2**.
- **Nginx Reverse Proxy:** Manages traffic routing, SPA fallback, same-origin cookie delivery, and WebSocket protocol upgrades (`Upgrade: websocket`).
- **Zero-Downtime Daemon:** Managed via PM2 with crash auto-restart and reboot persistence.

---

## Database Design & Data Architecture (MongoDB)

```mermaid
erDiagram
    USER ||--o{ MATCH : swipes
    USER ||--o{ CONNECTION : requests
    USER ||--o{ MESSAGE : exchanges
    USER ||--o{ PAYMENT : transacts
    
    USER {
        ObjectId _id PK
        String firstName
        String lastName
        String emailId UK
        String passwordHash
        Array skills
        String experienceLevel
        String headline
        String about
        String githubUrl
        String linkedinUrl
        String portfolioUrl
        Array projects
        Boolean isPremium
    }
    
    MATCH {
        ObjectId _id PK
        ObjectId fromUserId FK
        ObjectId toUserId FK
        String status "like | dislike"
        Date createdAt
    }
    
    CONNECTION {
        ObjectId _id PK
        ObjectId fromUserId FK
        ObjectId toUserId FK
        String status "pending | accepted | rejected"
        String message "pitch note (max 300 chars)"
        Date createdAt
    }
    
    MESSAGE {
        ObjectId _id PK
        String matchId "indexed room key"
        ObjectId senderId FK
        String text
        Boolean isAi
        Date createdAt
    }
    
    PAYMENT {
        ObjectId _id PK
        ObjectId userId FK
        String orderId UK
        String paymentId
        String signature
        Number amount
        String status "created | captured"
    }
```

- **Users:** Comprehensive developer profiles with skills, experience level, portfolio, and Pro membership status.
- **Matches & Connections:** Relational states enforced with compound unique indexes (`{ fromUserId: 1, toUserId: 1 }`).
- **Messages:** Time-series chat records indexed by `matchId` with flags for Gemini AI responses.
- **Payments:** Audit trail for Razorpay transaction orders, payment IDs, and verification signatures.

---

*Built to demonstrate clean backend engineering fundamentals, real-time distributed systems, AI integration, and production AWS cloud deployment.*
