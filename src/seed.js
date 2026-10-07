require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Connection = require("./models/connection");
const Match = require("./models/match");
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
    about: "Machine learning engineer with a love for NLP and computer vision. I'm looking for fellow builders to collaborate on meaningful AI projects. Coffee-fuelled and always curious.",
    photourl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "FastAPI"],
    interests: ["AI", "NLP", "Computer Vision", "Research"],
    experienceLevel: "intermediate",
    lookingFor: "project",
    availability: "part-time",
    githubUrl: "https://github.com/priyasharma",
    linkedinUrl: "https://linkedin.com/in/priyasharma",
    projects: [
      {
        title: "VisionScan",
        description: "Real-time object detection model deployed via FastAPI. Can identify 50+ household objects with 95% accuracy.",
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
    about: "7 years building scalable distributed systems. I enjoy mentoring junior devs and love talking about databases, caching strategies, and microservices architecture. Ask me anything!",
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
        description: "An open-source high-performance distributed caching layer written in Go. 5k+ stars on GitHub.",
        link: "https://github.com/rohanv/go-cache-layer"
      },
      {
        title: "Distributed Order System",
        description: "Event-driven microservices architecture using Apache Kafka and PostgreSQL.",
        link: "https://github.com/rohanv/distributed-orders"
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
    about: "I live at the intersection of design and code. I love crafting pixel-perfect UIs with smooth animations. Currently learning Three.js and WebGL to push the creative web further.",
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
        description: "My personal portfolio featuring an interactive 3D particle system built with Three.js and React Fiber.",
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
    headline: "Blockchain Developer · Web3 native",
    about: "Building the decentralised future one smart contract at a time. Solidity developer with experience on Ethereum and Solana. Looking for ambitious projects to contribute to.",
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
        description: "A decentralized lending protocol smart contract with automated liquidations.",
        link: "https://github.com/devpatel/defi-lending"
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
    about: "I design products that solve real problems for real people. Background in cognitive psychology meets UX research. Currently looking for internship opportunities at product companies.",
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
        description: "Designed a comprehensive dashboard for auditing web accessibility based on WCAG guidelines.",
        link: "https://meeranair.co/a11y-audit"
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
    about: "I make deployments boring (in the best way). Passionate about CI/CD pipelines, infrastructure-as-code, and developer experience. Open to mentoring and collaborative side projects.",
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
        description: "A custom Kubernetes controller that scales node pools based on custom Prometheus metrics.",
        link: "https://github.com/karansingh/k8s-scaler"
      }
    ]
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Get all seed users before deleting to delete their matches
    const seedUsers = await User.find({ emailId: { $regex: '@seed\\.dev$' } });
    const seedUserIds = seedUsers.map(u => u._id);

    // Clear previous matches and connections involving seed users
    if (seedUserIds.length > 0) {
      await Match.deleteMany({ $or: [{ fromUserId: { $in: seedUserIds } }, { toUserId: { $in: seedUserIds } }] });
      await Connection.deleteMany({ $or: [{ fromUserId: { $in: seedUserIds } }, { toUserId: { $in: seedUserIds } }] });
      console.log(`🧹 Cleared matches and connections for old seed users.`);
    }

    // Clear previous seeded data
    const result = await User.deleteMany({ emailId: { $regex: '@seed\\.dev$' } });
    console.log(`🧹 Cleared ${result.deletedCount} previous seed profiles.`);

    let created = 0;

    for (const profile of profiles) {
      // Set password to the email address
      const passwordHash = await bcrypt.hash(profile.emailId, 10);
      await User.create({ ...profile, password: passwordHash });
      console.log(`✅ Created: ${profile.firstName} ${profile.lastName} (${profile.emailId})`);
      created++;
    }

    console.log(`\n🎉 Done! Created ${created} profiles.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
