export const site = {
  name: "Santhosh V",
  role: "AI-First Full Stack Engineer",
  tagline: "Agents in prod. Backends that survive money moving. Proof below, not buzzwords.",
  location: "Chennai, India",
  email: "santhosh290605@gmail.com",
  phone: "+91 93615 28748",
  resumeHref: "/resume.pdf",
  year: 2026,
  leetcodeUrl: "https://leetcode.com/u/santhosh2210429",
  social: {
    linkedin: "https://www.linkedin.com/in/santhosh-v-286a28319",
    github: "https://github.com/santhosh290605",
  },
  intro:
    "I build full stack systems in structured finance and I design agentic workflows that actually run in production. Python, Java, APIs, queues, and LLM tooling with a human still on the merge button.",
  targeting:
    "I want AI-first product teams and backend or distributed-systems groups where agents, event-driven infra, and measurable outcomes are the job description.",
  credentials: [
    "AWS Certified AI Practitioner",
    "IEEE / SCOPUS, agentic decisioning",
  ],
} as const;

/** Evidence-backed claims (resume + shipped work) */
export const proofPoints = [
  {
    id: "langgraph",
    badge: "PROD",
    title: "Designed a LangGraph performance workflow",
    detail:
      "Replaced a manual performance-analysis script with a scheduled agentic pipeline that reads the platform, compares runs, and outputs actionable reports for the team.",
    pointer: "Career Wins → AI perf pipeline",
    openWin: "wins",
  },
  {
    id: "pr-agent",
    badge: "PROD",
    title: "Built an LLM pull-request assistant",
    detail:
      "Integrated into the PR flow to flag risky diffs and draft fixes. Nothing merges without human review. Prompting and guardrails are part of the design.",
    pointer: "AI Agents folder",
    openWin: "agents",
  },
  {
    id: "ieee",
    badge: "PUBLISHED",
    title: "Agentic credit decisioning (IEEE / SCOPUS)",
    detail:
      "Multi-agent framework with CatBoost at AUC 0.8779, SHAP explainability, and RAG for auditable outputs. Research rigor applied to how I think about prod agents.",
    pointer: "Projects → IEEE framework",
    openWin: "projects",
  },
  {
    id: "platform",
    badge: "PROD",
    title: "Distributed backend patterns at scale",
    detail:
      "Idempotent APIs, Redis cache-aside, session-ordered Azure Service Bus on Kubernetes, and observability on the paths I own. Built for settlement-style constraints.",
    pointer: "Production folder",
    openWin: "build",
  },
  {
    id: "ci",
    badge: "METRIC",
    title: "60% faster CI for the monorepo",
    detail:
      "Profiling plus esbuild migration cut build time from about five minutes to two. A number the whole team feels every push.",
    pointer: "Career Wins → CI time",
    openWin: "wins",
  },
  {
    id: "devx",
    badge: "SYSTEM",
    title: "Agentic IDE workspace (rules + skills)",
    detail:
      "Cursor rules, skills, and review gates so coding agents follow our architecture instead of inventing new patterns on every prompt.",
    pointer: "Career Wins → agent workspace",
    openWin: "wins",
  },
] as const;

export const impactLines = [
  {
    id: "ci",
    stat: "-60%",
    label: "CI time",
    line: "I cut our monorepo build from about five minutes to two by profiling bottlenecks and moving the bundle path to esbuild. The whole team feels it on every push.",
  },
  {
    id: "bus",
    stat: "AZ SB",
    label: "messaging",
    line: "I wired up Azure Service Bus with session-ordered queues and request/reply so per-entity work stays sequential and safe when we scale replicas on Kubernetes.",
  },
  {
    id: "agent",
    stat: "AI",
    label: "perf pipeline",
    line: "I replaced a manual performance script with a LangGraph agent that reads the platform the way I would. Same questions, just automated and on a schedule.",
  },
  {
    id: "devx",
    stat: "IDE",
    label: "agent workspace",
    line: "I set up a proper agentic coding workspace with Cursor rules, skills, and review gates so assistants follow our patterns instead of inventing new architecture.",
  },
] as const;

export const agentStory = {
  title: "How I use agents in real repos",
  paragraphs: [
    "I got tired of exporting logs and running one-off analysis, so I built a LangGraph pipeline that pulls the signals I actually care about, compares runs, and gives the team a story they can act on.",
    "In pull requests I run an LLM assistant that flags risky diffs and drafts fixes. I never auto-merge. A human always approves.",
    "I treat the editor as infrastructure: rules for how we structure services, skills for repetitive flows, and hard boundaries so agents stay helpful without going off-map.",
  ],
} as const;

export const systemsStory = {
  title: "What I build in production",
  subtitle: "Structured-finance marketplace, capital-markets and settlement flows",
  paragraphs: [
    "I design and integrate REST APIs and data pipelines where duplicate requests cannot double-spend. Idempotency keys, replay-safe responses, and durable job state are non-negotiable when money moves.",
    "I use Redis cache-aside for hot balance and read paths, with invalidation tied to writes so we do not serve stale truth under load.",
    "I work across MongoDB, PostgreSQL, and Redis depending on the shape of the data: documents, relational ledger rows, and fast lookups. I wire asynchronous processing when sync HTTP is not enough.",
    "I add metrics on the paths I touch so when production misbehaves, I can narrow root cause without guesswork.",
  ],
  capabilities: [
    "Idempotency and replay-safe APIs",
    "Redis cache-aside",
    "Mongo, Postgres, Redis",
    "Session-ordered messaging",
    "Event-driven consumers",
    "Optimistic concurrency",
    "JWT-secured services",
    "Observability and metrics",
  ],
} as const;

export type Project = {
  id: string;
  name: string;
  kind: string;
  story: string;
  highlights: string[];
  parts?: string[];
  tags: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    id: "fleet",
    name: "Fleet Time Machine",
    kind: "Full product, fleet monitoring",
    story:
      "I helped build a comprehensive fleet monitoring platform that ties live operations, maps, and ML together. It is not one repo. It is a system of frontends, APIs, and intelligence modules that answer whether vehicles are safe, routed well, and maintained on time.",
    parts: [
      "Live ops dashboard (maps and routing)",
      "ML and AI modules",
      "API and data services",
      "AR / exploration prototypes",
    ],
    highlights: [
      "Monitoring and optimization for maintenance, routing, safety, and ride assignment.",
      "Leaflet-based tracking and route visualization tied to backend services.",
      "Dedicated ML stack for predictions and recommendations on fleet behavior.",
    ],
    tags: ["React", "Leaflet", "ML", "Full stack", "IoT-ready"],
  },
  {
    id: "sdp",
    name: "Event Management System",
    kind: "Full product, SDP 2026",
    story:
      "I worked on an end-to-end event platform: public discovery and booking, admin control, auth, APIs, and even ML-assisted pricing and a chatbot layer. Each piece is its own app, but they behave like one product.",
    parts: [
      "Entry and booking experience",
      "Admin console",
      "Login and roles",
      "Event API (Express and MongoDB)",
      "Chatbot",
      "Dynamic pricing models",
    ],
    highlights: [
      "Multi-frontend setup with a shared backend for events, users, and bookings.",
      "Analytics and demand-aware pricing with trained models on the server.",
      "Assistant-style chatbot for attendee questions and flows.",
    ],
    tags: ["React", "Express", "MongoDB", "ML pricing", "Chatbot"],
  },
  {
    id: "paylite",
    name: "PayLite",
    kind: "Personal, full stack",
    story:
      "I built a wallet and ledger API the way I would want to see it in an interview: boring in the right ways, strict about money.",
    highlights: [
      "Double-entry ledger with a hash-chained audit trail and a verify endpoint.",
      "Idempotent transfers with Idempotency-Key replay of the full HTTP response.",
      "Redis cache-aside for balances, JWT auth, Spring Boot and PostgreSQL.",
    ],
    tags: ["Java", "Spring Boot", "Redis", "PostgreSQL", "React"],
    href: "https://github.com/santhosh290605",
  },
  {
    id: "ieee",
    name: "Multi-Agent Financial Decision Framework",
    kind: "IEEE / SCOPUS research",
    story:
      "I co-authored published work on agentic credit decisioning where every output had to be explainable, not just accurate.",
    highlights: [
      "CatBoost model at AUC 0.8779 with SHAP for transparency.",
      "RAG for grounded, auditable agent outputs in a multi-agent setup.",
    ],
    tags: ["Python", "CatBoost", "SHAP", "RAG", "Agents"],
  },
  {
    id: "oss-agent",
    name: "AI Open Source Contributor Agent",
    kind: "Automation project",
    story:
      "I wanted to see if an agent could do the tedious part of open source: triage an issue, sketch a fix, open a PR.",
    highlights: [
      "n8n workflow plus GitHub API and LLM integration.",
      "Human still reviews before anything merges.",
    ],
    tags: ["n8n", "LLM", "GitHub API"],
  },
];

export const researchBlurb = {
  title: "Research I stand behind",
  text: "The IEEE / SCOPUS paper on multi-agent credit decisioning is the same bar I use in prod: explainable, gated, measurable. CatBoost at AUC 0.8779 with SHAP and RAG is not a flex for a slide. It is how I think about trust.",
} as const;

export const leetcodeFallback = {
  total: 982,
  easy: 292,
  medium: 592,
  hard: 98,
  ranking: 37126,
  topTags: [
    { name: "Array", count: 562 },
    { name: "Hash Table", count: 178 },
    { name: "Dynamic Programming", count: 173 },
    { name: "Greedy", count: 130 },
    { name: "Depth-First Search", count: 122 },
  ],
} as const;

export type LeetCodeStats = {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
  topTags: { name: string; count: number }[];
};
