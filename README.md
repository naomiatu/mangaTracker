
# MangaTracker: Progressive Web Application

## Overview
MangaTracker is a modern, cross-platform Progressive Web Application (PWA) built for the 2026 Front-End Web Development project. The application serves as a centralized hub for manga discovery and reading progress synchronization. It leverages high-performance web technologies to provide a native-like experience on mobile and desktop devices.

## Technical Stack
* **Framework:** Ionic 7.0+ (Standalone Architecture)
* **Logic:** Angular 18
* **State Management:** Angular Signals
* **Data Protocol:** GraphQL via AniList API
* **Persistence:** Ionic Storage (IndexedDB / LocalStorage)
* **Native Features:** Capacitor Haptics
* **Deployment:** Firebase Hosting

## Core Architectural Features

### GraphQL Integration
The application utilizes a single-endpoint GraphQL architecture. Unlike traditional REST APIs, this allows the application to request specific data schemas (titles, cover images, and scoring) in a single POST request, significantly reducing data overhead and improving load times on mobile networks.

### Reactive State with Angular Signals
A centralized ThemeService utilizes Angular Signals to manage application-wide reactivity. This ensures that UI updates—such as theme toggling—occur instantaneously across all components without the overhead of complex event emitters or manual change detection.

### Data Persistence Layer
User data is managed through an asynchronous storage service. The system prioritized IndexedDB for performance on modern browsers, falling back to LocalStorage when necessary. This layer handles the serialization of the "My Library" object, ensuring reading progress and favorites remain consistent across sessions.

### Offline Capabilities
As a PWA, the application utilizes an Angular Service Worker (NGSW). It implements a "Cache-First" strategy for static assets and a "Network-First" strategy for API metadata, allowing the core library and interface to remain functional without an active internet connection.

## Installation and Execution
1. Clone the repository.
2. Run `npm install` to retrieve dependencies.
3. Execute `ionic serve` to launch the development server.
4. Execute `npx ng build --configuration=production` to generate the production PWA build.
