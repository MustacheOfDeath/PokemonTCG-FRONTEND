# PokéCollector – Frontend Application

[![Angular](https://img.shields.io/badge/Angular-17%2B-red?style=flat-square&logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Utility--First-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![RxJS](https://img.shields.io/badge/RxJS-Reactive-B7178C?style=flat-square&logo=reactivex)](https://rxjs.dev/)

The frontend application for **PokéCollector**, built with **Angular and TypeScript**. It provides a modern, responsive interface for Pokémon Trading Card Game enthusiasts to explore card databases, manage personal collections and wishlists, and organize cards through advanced filtering and hierarchical sorting.

---

## Tech Stack

- **Framework:** Angular 17+ with Standalone Components
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State & HTTP:** RxJS and Angular HttpClient
- **Routing:** Angular Router
- **Backend Integration:** Spring Boot REST API
- **Database:** MySQL (accessed through the backend API)

---

## Project Architecture

The application follows a component-based architecture, separating reusable UI components from services responsible for API communication, authentication, and cross-component navigation.

```text
src/
├── app/
│   ├── components/
│   │   ├── dashboard/               # Main catalog, search, filters, and pagination
│   │   ├── navbar/                  # Navigation bar and section switching
│   │   ├── pokemon-card/            # Card display and collection actions
│   │   └── pokemon-card-details/    # Detailed card inspection modal
│   ├── services/
│   │   ├── auth.service.ts          # Authentication and session management
│   │   ├── navigation.service.ts    # Cross-component navigation state
│   │   └── pokemon.service.ts       # Backend API communication
└── styles.css                       # Global styles and custom theme variables
```

---

## Key Features

- **Advanced Search & Filtering:** Dynamically filter cards by name, expansion set, illustrator, and card rarity.
- **Hierarchical Card Sorting:** Sort cards by name, release date, card number, and rarity. Rarity sorting follows a custom database-defined hierarchy, ensuring that categories such as *Pikachu Rare* and other ultra-rares are ordered correctly rather than alphabetically.
- **Collection & Wishlist Management:** Add or remove cards from personal collections and wishlists, with convenient transfers between the two.
- **Dynamic Metadata:** Retrieve available expansion sets, illustrators, and rarities from the backend to populate filter dropdowns.
- **Card Details:** Inspect individual cards through a dedicated detail modal.
- **Authentication Integration:** Communicate with the backend authentication service to support user sessions and protected features.
- **Responsive UI:** Built with Tailwind CSS, custom theme variables (`--bg-main`, `--bg-card`, etc.), smooth transitions, and a mobile-friendly layout.

---

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- **Node.js:** Version 18 or higher recommended
- **npm:** Included with Node.js
- **Angular CLI:** A version compatible with the project's Angular installation
- **Backend API:** A running instance of the PokéCollector Spring Boot backend
- **MySQL:** Configured and accessible through the backend

### 1. Clone the Repository

```bash
git clone https://github.com/MustacheOfDeath/PokemonTCG-FRONTEND.git
cd PokemonTCG-FRONTEND
```

### 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 3. Configure the API Endpoint

Ensure the Angular environment configuration points to the correct Spring Boot backend address.

For local development, the API is typically available at:

```text
http://localhost:8080/api
```

Update the appropriate environment configuration file if your backend runs on another host or port.

**Note:** If the frontend and backend run on different origins, the backend must allow the frontend origin through its CORS configuration.

### 4. Run the Development Server

Start the Angular development server:

```bash
ng serve
```

### 5. Open the Application

Navigate to:

**http://localhost:4200/**

The application should now be accessible in your browser, provided the backend is running and correctly configured.

---

## Backend Integration

PokéCollector's frontend works alongside the Spring Boot backend, which handles authentication, database operations, and business logic.

**Backend Repository:** [PokemonTCG – Backend API](https://github.com/MustacheOfDeath/PokemonTCG)

The frontend communicates with the backend through REST API endpoints for:

- User authentication and session management
- Paginated card retrieval and advanced filtering
- Expansion set, illustrator, and rarity metadata
- Personal collection management
- Wishlist management and card transfers
- User-specific features supported by the backend

The backend requires a configured MySQL database and the appropriate application environment variables. Refer to the backend repository's README for installation and configuration instructions.

---

## Related Repositories

- **Frontend:** [PokemonTCG-FRONTEND](https://github.com/MustacheOfDeath/PokemonTCG-FRONTEND)
- **Backend:** [PokemonTCG](https://github.com/MustacheOfDeath/PokemonTCG)
- **Official Pokémon TCG Dataset:** [PokemonTCG/pokemon-tcg-data](https://github.com/PokemonTCG/pokemon-tcg-data)

---

*Built for Pokémon TCG collectors who want a modern and convenient way to explore, organize, and manage their collections.*
