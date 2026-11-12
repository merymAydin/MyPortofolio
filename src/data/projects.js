/**
 * Project index and case study facts, kept separate from the page components.
 * Information in the IstanbulKart study was checked against its public source.
 * `caseNumber` and `caseStatus` are archive catalogue labels; they do not claim
 * that an undocumented project has been fully investigated.
 */
export const projects = [
  {
    slug: 'istanbulkart',
    caseNumber: 'CASE-001',
    caseStatus: 'Documented',
    title: 'İstanbulKart Digital Hub',
    image: '/reference/ist.png',
    description: 'A web application for Istanbulkart product applications, identity review, card and wallet management, and transit activity.',
    technologies: ['React', 'TypeScript', 'Java', 'Spring Boot', 'PostgreSQL'],
    demoUrl: 'https://istanbulcard.tech/',
    githubLinks: [
      { label: 'Frontend source', url: 'https://github.com/merymAydin/istKart' },
      { label: 'Backend source', url: 'https://github.com/merymAydin/istanbul-kart-clone' },
    ],
    caseStudy: {
      displayTitle: 'The IstanbulKart Investigation',
      overview: 'The project brings Istanbulkart product applications, identity review, wallet actions, and card activity into a web experience. Its source describes a flow from account registration and KYC review to card management and transit transactions.',
      features: [
        'Account registration and sign-in with Cloudflare Turnstile verification',
        'Catalogue of Standard, Plus, Discounted, Blue, Free, and City card products',
        'Multi-step identity application with document and selfie uploads, followed by administrator review',
        'Wallet actions for card activation, balance top-up, monthly subscriptions, and transaction history',
        'Transit spending through available terminals and configurable automatic top-up',
        'In-app chatbot for card and fare questions',
      ],
      stack: {
        frontend: ['React 19', 'TypeScript', 'Vite', 'React Router', 'Axios', 'Framer Motion', 'styled-components'],
        backend: ['Java 17', 'Spring Boot 3.3', 'Spring Web', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'Bean Validation', 'JWT (JJWT)'],
        databaseDevOps: ['PostgreSQL', 'Docker', 'Nginx'],
        external: [
          { name: 'Cloudflare Turnstile', note: 'Used in account flows and verified by the backend.' },
          { name: 'Stripe', note: 'PaymentIntent integration exists; payment-result handling needs review.' },
          { name: 'Gemini', note: 'Used by the chatbot service.' },
          { name: 'Google Cloud Vision', note: 'Dependency is present, but the current verification service is a stub.' },
        ],
      },
      architecture: [
        { title: 'Frontend', detail: 'React app · pages, components, services' },
        { title: 'Backend', detail: 'Spring controllers · services · security' },
        { title: 'Persistence', detail: 'Spring Data JPA · PostgreSQL entities' },
      ],
      structure: [
        'istanbul-kart-frontend/src/{components,data,pages,services}',
        'istanbul-kart-clone/src/main/java/com/istanbulkart/clone/{controller,dto,entities,repository,security,service}',
        'istanbul-kart-clone/src/main/resources',
      ],
      tables: [
        { name: 'users', fields: 'id · username · email · password · role · is_active' },
        { name: 'cards', fields: 'id · card_number · user_id · balance · card_type · subscription · auto_top_up' },
        { name: 'transactions', fields: 'id · card_id · amount · transaction_type · transaction_date' },
        { name: 'kyc_applications', fields: 'id · user_id · card_type · identity/selfie images · status · created_at' },
        { name: 'schedules', fields: 'id · route_code · route_name · terminal_id · departure_time' },
      ],
      relationships: [
        'One user can own multiple cards.',
        'Each card belongs to one user and can have multiple transactions.',
        'A KYC application belongs to one user.',
        'schedules stores terminal_id as a scalar field; the source does not define a terminal entity relation.',
      ],
      challenges: [
        { title: 'Entity serialization cycles', detail: 'Card-to-user and transaction-to-card back references are suppressed with @JsonIgnore.' },
        { title: 'Identity verification integration', detail: 'GoogleVisionService currently returns a successful result without calling Vision; real verification remains to be implemented.' },
        { title: 'Payment result validation', detail: 'The Stripe PaymentIntent flow is present, but its success checks should be tightened before relying on it for payment confirmation.' },
      ],
      security: [
        'BCrypt password encoder and stateless JWT authentication are configured.',
        'Turnstile tokens are checked in account flows.',
        'The repository contains a hard-coded JWT signing secret and permissive CORS settings; move secrets to environment configuration and restrict allowed origins before production use.',
      ],
      status: {
        implemented: 'The source includes account flows, card and wallet features, KYC submission/review, transaction history, subscriptions, automatic top-up settings, and chatbot integration.',
        caveats: 'Google Vision identity checks are stubbed, and the Stripe result handling requires review. No separate future roadmap was supplied in the project source.',
      },
    },
  },
  {
    slug: 'project-three',
    caseNumber: 'CASE-002',
    caseStatus: 'Awaiting records',
    title: 'Twitter Clone',
    image: '/reference/x.png',
    description: null,
    technologies: ['React', 'JavaScript', 'Vite', 'Redux Toolkit', 'Spring Boot', 'PostgreSQL', 'Google Gemini', 'Stripe'],
    demoUrl: 'https://twitter.software/',
    githubLinks: [],
    caseStudy: {
      displayTitle: 'Twitter Clone',
      overview: 'A full-stack social media application inspired by Twitter (X), with reported social-network features, a Spring Boot backend, and integrations for Google Gemini and Stripe.',
      features: [
        'User authentication and JWT authorization',
        'Create, edit and delete tweets',
        'Likes, comments, retweets and quote tweets',
        'Follow and unfollow relationships',
        'Bookmarks and personalized feeds',
        'Notifications and mention detection',
        'Google Gemini tools for tweet rewriting, summarization, analysis and AI chat',
        'Stripe subscription and payment workflows',
      ],
      stack: {
        frontend: ['React', 'JavaScript', 'Vite', 'Redux Toolkit', 'React Router', 'Axios', 'Tailwind CSS'],
        backend: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'JPA / Hibernate'],
        databaseDevOps: ['PostgreSQL', 'Flyway'],
        external: [
          { name: 'Google Gemini', note: 'Reported AI integration for rewriting, summaries, analysis and chat.' },
          { name: 'Stripe', note: 'Reported subscription and payment workflows.' },
        ],
      },
      architecture: [
        { title: 'Client', detail: 'React · JavaScript · API scaffold' },
        { title: 'REST API', detail: 'Spring Boot · Spring Security · JWT' },
        { title: 'Persistence', detail: 'JPA / Hibernate · PostgreSQL · Flyway' },
      ],
      challenges: [
        { title: 'Resource ownership', detail: 'JWT authentication and authorization are reported as the boundary for protected resources.' },
        { title: 'Tweet statistics concurrency', detail: 'Pessimistic write locking is reported for tweet-statistic updates.' },
        { title: 'Stripe reliability', detail: 'Idempotency, subscription creation and webhook reliability are reported integration concerns.' },
        { title: 'Gemini abstraction', detail: 'A Gemini Gateway abstraction is reported for AI operations.' },
      ],
      status: {
        implemented: 'The project brief reports backend functionality across authentication, social interactions, AI and payments.',
        caveats: 'The frontend is currently an API integration starter/scaffold; major frontend features are not yet complete. Completion of the reported backend areas was not independently verified in this portfolio workspace.',
      },
    },
  },
  {
    slug: 'project-two',
    caseNumber: 'CASE-003',
    caseStatus: 'Documented',
    title: 'E-Commerce Platform',
    image: '/reference/ecom.png',
    description: 'A React frontend and REST API integration for product discovery, shopping carts, delivery information and order workflows.',
    technologies: ['React', 'JavaScript', 'Redux', 'React Router', 'Axios', 'React Hook Form', 'Tailwind CSS'],
    demoUrl: 'https://e-commerce-ruddy-iota-99.vercel.app/',
    githubLinks: [],
    caseStudy: {
      displayTitle: 'E-Commerce Platform',
      overview: 'A React frontend and REST API integration for product discovery, online shopping, cart management, delivery information and order workflows.',
      features: [
        'User registration and authentication',
        'Product catalogue, details, filtering, sorting and pagination',
        'Shopping cart and quantity management',
        'Address and card information management',
        'Multi-step checkout workflow',
        'Order creation and order history',
      ],
      stack: {
        frontend: ['React', 'JavaScript', 'Redux', 'React Router', 'Axios', 'React Hook Form', 'Tailwind CSS'],
        backend: ['REST API integration'],
        databaseDevOps: ['Not verified'],
        external: [
          { name: 'Token handling', note: 'Authentication tokens are handled by the frontend integration.' },
          { name: 'Protected routes', note: 'Protected frontend routes are part of the recorded architecture.' },
        ],
      },
      architecture: [
        { title: 'Pages & UI', detail: 'React pages and reusable components' },
        { title: 'State', detail: 'Redux store · auth and cart state' },
        { title: 'API', detail: 'Axios client → external REST API' },
      ],
      challenges: [
        { title: 'Centralized state', detail: 'Redux coordinates authentication, catalogue and cart state across pages.' },
        { title: 'API boundary', detail: 'Axios centralizes communication with the external REST API and token handling.' },
        { title: 'Checkout flow', detail: 'React Hook Form supports the multi-step delivery and checkout workflow.' },
      ],
      status: {
        implemented: 'Frontend features and REST API integrations are recorded as implemented in the project source.',
        caveats: 'Backend source code, database architecture, real payment gateway behavior and an admin panel were not verified.',
      },
    },
  },
]
