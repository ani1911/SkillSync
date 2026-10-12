require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Connection = require("./models/connection");
const Match = require("./models/match");
const Message = require("./models/message");
const User = require("./models/user");

const connectDB = async () => mongoose.connect(process.env.MONGODB_URI);

const profiles = [
  {
    firstName: "Arjun",
    lastName: "Mehta",
    username: "arjunmehta",
    emailId: "arjun.mehta@seed.dev",
    age: 24,
    gender: "male",
    headline: "Full Stack Developer · Building products people love",
    about: "I'm a full-stack dev obsessed with clean code and great UX. Currently building a SaaS tool for remote teams. Always happy to pair-program and share what I know.",
    photourl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "Docker"],
    interests: ["SaaS", "Open Source", "DevTools", "Productivity"],
    experienceLevel: "intermediate",
    lookingFor: "collaborator",
    availability: "weekends",
    githubUrl: "https://github.com/arjunmehta",
    linkedinUrl: "https://linkedin.com/in/arjunmehta",
    portfolioUrl: "https://arjunmehta.dev",
    projects: [
      {
        title: "TaskFlow SaaS",
        description: "A beautiful task management tool for remote teams featuring real-time collaboration via WebSockets.",
        link: "https://github.com/arjunmehta/taskflow"
      }
    ]
  },
  {
    firstName: "Priya",
    lastName: "Sharma",
    username: "priyasharma",
    emailId: "priya.sharma@seed.dev",
    age: 22,
    gender: "female",
    headline: "AI/ML Engineer · Turning data into decisions",
    about: "Machine learning engineer with a love for NLP and computer vision. Looking for fellow builders to collaborate on meaningful AI projects. Coffee-fuelled and always curious.",
    photourl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    skills: ["Python", "TensorFlow", "PyTorch", "FastAPI", "Docker"],
    interests: ["AI", "NLP", "Computer Vision", "Research"],
    experienceLevel: "intermediate",
    lookingFor: "project",
    availability: "part-time",
    githubUrl: "https://github.com/priyasharma",
    linkedinUrl: "https://linkedin.com/in/priyasharma",
    projects: [
      {
        title: "VisionScan",
        description: "Real-time object detection model deployed via FastAPI with 95% accuracy.",
        link: "https://github.com/priyasharma/visionscan"
      }
    ]
  },
  {
    firstName: "Rohan",
    lastName: "Verma",
    username: "rohanv",
    emailId: "rohan.verma@seed.dev",
    age: 28,
    gender: "male",
    headline: "Senior Backend Engineer · System Design Geek",
    about: "7 years building scalable distributed systems. I enjoy mentoring junior devs and love talking about databases, caching strategies, and microservices architecture.",
    photourl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    skills: ["Go", "Rust", "Kafka", "Redis", "PostgreSQL", "Kubernetes"],
    interests: ["Distributed Systems", "Performance", "Cloud Architecture"],
    experienceLevel: "advanced",
    lookingFor: "mentor",
    availability: "weekends",
    githubUrl: "https://github.com/rohanv",
    linkedinUrl: "https://linkedin.com/in/rohanverma",
    portfolioUrl: "https://rohanverma.io",
    projects: [
      {
        title: "Go-Cache-Layer",
        description: "High-performance distributed caching layer written in Go. 5k+ stars on GitHub.",
        link: "https://github.com/rohanv/go-cache-layer"
      }
    ]
  },
  {
    firstName: "Meera",
    lastName: "Nair",
    username: "meeranair",
    emailId: "meera.nair@seed.dev",
    age: 23,
    gender: "female",
    headline: "Product Designer · Researcher at heart",
    about: "I design products that solve real problems for real people. Background in cognitive psychology meets UX research. Looking for collaborative engineering partners.",
    photourl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    skills: ["Figma", "Prototyping", "User Research", "Design Systems", "Framer"],
    interests: ["Product Design", "Psychology", "Accessibility", "Startups"],
    experienceLevel: "beginner",
    lookingFor: "internship",
    availability: "full-time",
    linkedinUrl: "https://linkedin.com/in/meeranair",
    portfolioUrl: "https://meeranair.co",
    projects: [
      {
        title: "Accessibility Audit Tool",
        description: "Comprehensive dashboard for auditing web accessibility based on WCAG guidelines.",
        link: "https://meeranair.co/a11y-audit"
      }
    ]
  },
  {
    firstName: "Aisha",
    lastName: "Khan",
    username: "aishakhan",
    emailId: "aisha.khan@seed.dev",
    age: 21,
    gender: "female",
    headline: "Frontend Developer · Design-obsessed builder",
    about: "I live at the intersection of design and code. I love crafting pixel-perfect UIs with smooth animations. Currently exploring Three.js and WebGL.",
    photourl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    skills: ["React", "Tailwind CSS", "Figma", "Three.js", "GSAP"],
    interests: ["Creative Web", "3D", "UI/UX", "Motion Design"],
    experienceLevel: "beginner",
    lookingFor: "collaborator",
    availability: "full-time",
    githubUrl: "https://github.com/aishakhan",
    portfolioUrl: "https://aishakhan.design",
    projects: [
      {
        title: "Webgl Portfolio",
        description: "Interactive 3D particle system built with Three.js and React Fiber.",
        link: "https://aishakhan.design"
      }
    ]
  },
  {
    firstName: "Dev",
    lastName: "Patel",
    username: "devpatel",
    emailId: "dev.patel@seed.dev",
    age: 26,
    gender: "male",
    headline: "Blockchain Developer · Web3 Native",
    about: "Building the decentralized future one smart contract at a time. Solidity developer with experience on Ethereum and Solana. Looking for ambitious DeFi projects.",
    photourl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    skills: ["Solidity", "Rust", "Hardhat", "Ethers.js", "React"],
    interests: ["Web3", "DeFi", "NFTs", "DAO Governance"],
    experienceLevel: "intermediate",
    lookingFor: "project",
    availability: "part-time",
    githubUrl: "https://github.com/devpatel",
    linkedinUrl: "https://linkedin.com/in/devpatel",
    projects: [
      {
        title: "DeFi Lending Protocol",
        description: "Decentralized lending protocol smart contract with automated liquidations.",
        link: "https://github.com/devpatel/defi-lending"
      }
    ]
  },
  {
    firstName: "Karan",
    lastName: "Singh",
    username: "karansingh",
    emailId: "karan.singh@seed.dev",
    age: 25,
    gender: "male",
    headline: "DevOps Engineer · Platform & Infrastructure",
    about: "I make deployments boring in the best way. Passionate about CI/CD pipelines, infrastructure-as-code, and developer experience. Open to collaborative side projects.",
    photourl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    skills: ["AWS", "Terraform", "Kubernetes", "GitHub Actions", "Python", "Bash"],
    interests: ["DevOps", "Platform Engineering", "Security", "Open Source"],
    experienceLevel: "advanced",
    lookingFor: "collaborator",
    availability: "weekends",
    githubUrl: "https://github.com/karansingh",
    linkedinUrl: "https://linkedin.com/in/karansingh",
    portfolioUrl: "https://karansingh.tech",
    projects: [
      {
        title: "K8s Auto-Scaler",
        description: "Custom Kubernetes controller scaling node pools based on Prometheus metrics.",
        link: "https://github.com/karansingh/k8s-scaler"
      }
    ]
  },
  {
    firstName: "Ananya",
    lastName: "Rao",
    username: "ananyarao",
    emailId: "ananya.rao@seed.dev",
    age: 23,
    gender: "female",
    headline: "Mobile Architect · Flutter & Swift Specialist",
    about: "Crafting fluid mobile experiences for iOS and Android. Passionate about clean architecture, state management with Bloc, and native animations.",
    photourl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    skills: ["Flutter", "Swift", "Dart", "Firebase", "Kotlin"],
    interests: ["Mobile Dev", "App Architecture", "Fintech", "UI Design"],
    experienceLevel: "intermediate",
    lookingFor: "collaborator",
    availability: "part-time",
    githubUrl: "https://github.com/ananyarao",
    linkedinUrl: "https://linkedin.com/in/ananyarao",
    projects: [
      {
        title: "ZenWallet App",
        description: "Cross-platform personal finance tracker with biometric authentication and offline sync.",
        link: "https://github.com/ananyarao/zenwallet"
      }
    ]
  },
  {
    firstName: "Vikram",
    lastName: "Malhotra",
    username: "vikramm",
    emailId: "vikram.m@seed.dev",
    age: 27,
    gender: "male",
    headline: "Systems Engineer · Rust & High-Throughput I/O",
    about: "Performance geek obsessed with zero-cost abstractions, memory safety without garbage collection, and kernel bypass networking.",
    photourl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    skills: ["Rust", "C++", "Tokio", "gRPC", "Linux eBPF"],
    interests: ["Systems Programming", "Compilers", "Networking", "Database Engines"],
    experienceLevel: "advanced",
    lookingFor: "mentor",
    availability: "weekends",
    githubUrl: "https://github.com/vikramm",
    linkedinUrl: "https://linkedin.com/in/vikramm",
    projects: [
      {
        title: "NanoQueue",
        description: "Ultra low-latency ring-buffer message queue written in Rust achieving 8M ops/sec.",
        link: "https://github.com/vikramm/nanoqueue"
      }
    ]
  },
  {
    firstName: "Sneha",
    lastName: "Gupta",
    username: "snehag",
    emailId: "sneha.g@seed.dev",
    age: 24,
    gender: "female",
    headline: "Security Researcher · AppSec & Cloud Security",
    about: "Breaker turned builder. I audit web applications, test smart contracts, and build automated security linters. Happy to help teams harden their infrastructure.",
    photourl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    skills: ["AppSec", "OAuth2", "Docker", "Python", "Burp Suite", "OWASP"],
    interests: ["Cybersecurity", "Zero Trust", "Cryptography", "Penetration Testing"],
    experienceLevel: "intermediate",
    lookingFor: "project",
    availability: "part-time",
    githubUrl: "https://github.com/snehag",
    linkedinUrl: "https://linkedin.com/in/snehag",
    projects: [
      {
        title: "SecScanner CI",
        description: "GitHub Action scanning pull requests for OWASP Top 10 vulnerabilities and hardcoded secrets.",
        link: "https://github.com/snehag/secscanner-ci"
      }
    ]
  }
];

const seed = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB Atlas");

    // Clean previous seed test data
    await Message.deleteMany({});
    await Connection.deleteMany({});
    await Match.deleteMany({});
    await User.deleteMany({ emailId: { $regex: '@(seed\\.dev|skillsync\\.dev)$' } });
    console.log("🧹 Cleared old messages, connections, matches, and seed users.");

    const createdUsers = [];

    for (const profile of profiles) {
      // Use "demo123" as the universal password for all seed accounts
      const passwordHash = await bcrypt.hash("demo123", 10);
      const user = await User.create({ ...profile, password: passwordHash });
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.firstName} ${user.lastName} (${user.emailId})`);
    }

    const [arjun, priya, rohan, meera, aisha] = createdUsers;

    // 1. Pre-seed Accepted Connections for Demo User (Arjun)
    await Connection.create({
      fromUserId: arjun._id,
      toUserId: priya._id,
      status: "accepted",
      message: "Hey Priya, excited to connect!"
    });

    await Connection.create({
      fromUserId: rohan._id,
      toUserId: arjun._id,
      status: "accepted",
      message: "Hey Arjun, great work on TaskFlow SaaS."
    });
    console.log("🤝 Created 2 accepted connections (Priya Sharma, Rohan Verma).");

    // 2. Pre-seed a Pending Request from Meera Nair for Demo User
    await Connection.create({
      fromUserId: meera._id,
      toUserId: arjun._id,
      status: "pending",
      message: "Hey Arjun! Loved your TaskFlow SaaS project. Would love to collaborate on UI/UX & design systems!"
    });
    console.log("📩 Created 1 pending request from Meera Nair.");

    // 3. Pre-seed a Mutual Match with Aisha Khan (Appears in Matches tab)
    await Match.create({ fromUserId: arjun._id, toUserId: aisha._id, status: "like" });
    await Match.create({ fromUserId: aisha._id, toUserId: arjun._id, status: "like" });
    console.log("🔥 Created 1 mutual match with Aisha Khan in Matches tab.");

    // 4. Pre-seed Chat History with Priya Sharma (Showcases both Dev Chat and Gemini AI)
    const matchId = [arjun._id.toString(), priya._id.toString()].sort().join("_");

    await Message.create({
      senderId: arjun._id,
      matchId,
      text: "Hey Priya! Saw your VisionScan object detection project on FastAPI. Really impressive model accuracy.",
      isAi: false,
    });

    await Message.create({
      senderId: priya._id,
      matchId,
      text: "Thanks Arjun! Loved your TaskFlow SaaS too. We should definitely pair program and integrate an AI workflow into it.",
      isAi: false,
    });

    await Message.create({
      senderId: arjun._id,
      matchId,
      text: "@ai What are the best architecture patterns to stream Gemini responses into a React frontend?",
      isAi: false,
    });

    await Message.create({
      senderId: priya._id, // Rendered as AI response
      matchId,
      text: "Here are 3 standard patterns for streaming LLM responses in React:\n1. Server-Sent Events (SSE) with EventSource\n2. WebSockets via Socket.io (optimal when you already have bidirectional chat)\n3. Fetch API with ReadableStream default reader.\n\nFor SkillSync, utilizing your existing Socket.io connection provides seamless low-latency token streaming!",
      isAi: true,
    });
    console.log("💬 Pre-seeded chat messages including @ai interaction with Priya Sharma.");

    console.log(`\n🎉 SEED SUCCESSFUL!`);
    console.log(`👉 Demo Login Email: ${arjun.emailId}`);
    console.log(`👉 Demo Login Password: demo123`);
    console.log(`👉 All other seed accounts use password: demo123`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
