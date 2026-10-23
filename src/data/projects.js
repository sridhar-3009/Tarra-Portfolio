export const projects = [
  {
    id: 'huddle',
    title: 'Huddle',
    subtitle: 'Multiplayer AI Coding Agent Platform',
    description: 'A multiplayer workspace where a team watches and steers one AI coding agent live — with driver hand-off, queued suggestions, and comments.',
    longDescription: `Designed an event-sourced backend: 40+ versioned event types stored append-only in PostgreSQL, reduced into UI state and streamed over a WebSocket server written from scratch to RFC 6455.

Implemented the LLM agent loop in Python with tool calling, sandboxing each session in Docker (no network, dropped capabilities, resource limits) with human approval for risky actions. 77 automated tests, self-hosted with HTTPS and nightly backups.`,
    tech: ['TypeScript', 'Python', 'PostgreSQL', 'Docker', 'WebSockets', 'LLM Agents'],
    category: 'Backend Systems',
    gradient: 'from-zinc-900 to-black',
    accentColor: '#ffffff',
    liveUrl: null,
    githubUrl: 'https://github.com/sridhar-3009',
    featured: true,
    status: 'Completed',
    stars: 0,
    images: [],
    metrics: [
      { label: 'Event Types', value: '40+' },
      { label: 'Automated Tests', value: '77' },
    ],
  },
  {
    id: 'multilingua',
    title: 'MultiLingua',
    subtitle: 'Cross-Lingual Sentiment Analysis API',
    description: 'Fine-tuned XLM-RoBERTa for sentiment analysis across English, Hindi, and Spanish — including code-mixed text — served as a Dockerised FastAPI service.',
    longDescription: `Fine-tuned XLM-RoBERTa in PyTorch for cross-lingual sentiment analysis across English, Hindi, and Spanish, reaching 88% accuracy.

Added support for code-mixed text (e.g. Hindi–English) so a single model handles mixed-language input without per-language pipelines. Containerised the FastAPI REST service with Docker and logged predictions to MongoDB, sustaining 500+ requests/min.`,
    tech: ['PyTorch', 'XLM-RoBERTa', 'FastAPI', 'Docker', 'MongoDB'],
    category: 'Machine Learning',
    gradient: 'from-zinc-900 to-black',
    accentColor: '#ffffff',
    liveUrl: null,
    githubUrl: 'https://github.com/sridhar-3009',
    featured: true,
    status: 'Completed',
    stars: 0,
    images: [],
    metrics: [
      { label: 'Accuracy', value: '88%' },
      { label: 'Throughput', value: '500+ req/min' },
    ],
  },
  {
    id: 'demandcast',
    title: 'DemandCast',
    subtitle: 'Large-Scale Demand Forecasting System',
    description: 'End-to-end demand forecasting pipeline for predicting daily SKU-level demand across 50K+ products using deep learning and classical ML models.',
    longDescription: `Built a scalable forecasting system comparing ARIMA, Prophet, XGBoost, and LSTM models. Implemented LSTM with Temporal Attention achieving 22% lower MAPE compared to ARIMA baseline.

Designed a real-time inference API using FastAPI with Redis caching. Added model monitoring to detect data drift and trigger automated retraining when performance degrades.`,
    tech: ['Python', 'PyTorch', 'XGBoost', 'FastAPI', 'Kafka', 'Redis', 'PostgreSQL'],
    category: 'Machine Learning',
    gradient: 'from-zinc-900 to-black',
    accentColor: '#ffffff',
    liveUrl: null,
    githubUrl: 'https://github.com/sridhar-3009',
    featured: false,
    status: 'Ongoing',
    stars: 0,
    images: ['/projects/demandcast-1.png'],
    metrics: [
      { label: 'MAPE Improvement', value: '22%' },
      { label: 'Products Modeled', value: '50K+' },
    ],
  },
  {
    id: 'skillswap',
    title: 'SkillSwap',
    subtitle: 'Peer-to-Peer Microlearning Platform',
    description: 'Live microlearning platform with credit-based economy and real-time video sessions.',
    longDescription: `Built a full-stack real-time learning platform using React, Node.js, MongoDB, and PostgreSQL.

Integrated WebRTC for live video and whiteboard sessions. Designed transactional credit logic where users earn credits by teaching and spend credits while learning. Implemented booking system and reputation tracking.`,
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'WebRTC', 'Tailwind CSS'],
    category: 'Full Stack',
    gradient: 'from-zinc-900 to-black',
    accentColor: '#ffffff',
    liveUrl: null,
    githubUrl: 'https://github.com/sridhar-3009',
    featured: false,
    status: 'Completed',
    stars: 0,
    images: ['/projects/skillswap-1.png'],
    metrics: [
      { label: 'Session Type', value: 'Live P2P' },
      { label: 'Architecture', value: 'Full Stack' },
    ],
  },
  {
    id: 'stock-forecast',
    title: 'Explainable Stock Forecasting Engine',
    subtitle: 'Interpretable ML for Stock Prediction',
    description: 'Stock price forecasting engine with explainability using feature importance and model interpretation techniques.',
    longDescription: `Built a stock forecasting system using machine learning models and incorporated explainability techniques to interpret feature impact on predictions.

Focused on transparency and financial data analysis using Pandas and visualization tools.`,
    tech: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib'],
    category: 'Machine Learning',
    gradient: 'from-zinc-900 to-black',
    accentColor: '#ffffff',
    liveUrl: null,
    githubUrl: 'https://github.com/sridhar-3009/Explainable-Stock-Forecasting-Engine',
    featured: false,
    status: 'Completed',
    stars: 0,
    images: ['/projects/stock-1.png'],
    metrics: [
      { label: 'Focus', value: 'Explainability' },
    ],
  },
  {
    id: 'social-pulse',
    title: 'Real-Time Social Pulse Analyzer',
    subtitle: 'Trend & Sentiment Detection System',
    description: 'Analyzes social media trends and sentiment in real-time using NLP techniques.',
    longDescription: `Built an NLP-based system to detect trending topics and analyze sentiment from streaming social data.

Focused on real-time data processing and visualization of trend dynamics.`,
    tech: ['Python', 'NLP', 'Pandas', 'Stream Processing'],
    category: 'Data Engineering',
    gradient: 'from-zinc-900 to-black',
    accentColor: '#ffffff',
    liveUrl: null,
    githubUrl: 'https://github.com/sridhar-3009/Real-Time-Social-Pulse-Analyzer',
    featured: false,
    status: 'Completed',
    stars: 0,
    images: ['/projects/social-1.png'],
    metrics: [
      { label: 'Type', value: 'Real-time Analysis' },
    ],
  },
  {
    id: 'route-intelligence',
    title: 'Adaptive Real-Time Route Intelligence Engine',
    subtitle: 'A* and Bidirectional Dijkstra Optimization',
    description: 'High-performance pathfinding engine using A* and Bidirectional Dijkstra algorithms.',
    longDescription: `Implemented optimized shortest-path algorithms including A* and Bidirectional Dijkstra for efficient real-time route computation.

Focused on algorithmic efficiency and performance benchmarking.`,
    tech: ['C++', 'Data Structures', 'Algorithms'],
    category: 'Algorithms',
    gradient: 'from-zinc-900 to-black',
    accentColor: '#ffffff',
    liveUrl: null,
    githubUrl: 'https://github.com/sridhar-3009/Adaptive-Real-Time-Route-Intelligence-Engine-using-A-and-Bidirectional-Dijkstra',
    featured: false,
    status: 'Completed',
    stars: 0,
    images: ['/projects/route-1.png'],
    metrics: [
      { label: 'Algorithms Used', value: 'A*, Bi-Dijkstra' },
    ],
  },
  {
    id: 'genai-chatbot',
    title: 'Gen AI Chatbot',
    subtitle: 'LLM-powered Conversational Assistant',
    description: 'Conversational chatbot built using generative AI concepts and prompt engineering.',
    longDescription: `Developed a chatbot leveraging LLM fundamentals and prompt engineering techniques.

Focused on conversational flow design and practical GenAI experimentation.`,
    tech: ['Python', 'LLMs', 'Prompt Engineering'],
    category: 'AI Applications',
    gradient: 'from-zinc-900 to-black',
    accentColor: '#ffffff',
    liveUrl: null,
    githubUrl: 'https://github.com/sridhar-3009/Gen-AI-Chatbot',
    featured: false,
    status: 'Completed',
    stars: 0,
    images: ['/projects/chatbot-1.png'],
    metrics: [
      { label: 'Type', value: 'Generative AI' },
    ],
  },
]

export const categories = [
  'All',
  'Backend Systems',
  'Machine Learning',
  'Full Stack',
  'Data Engineering',
  'Algorithms',
  'AI Applications'
]