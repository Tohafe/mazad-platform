*This project has been created as part of the 42 curriculum by helarras, nhimad, haouky, arekoune, and ajbari*

# Mazad

## Description

**Mazad** is a full-stack online auction platform developed as part of the 42 curriculum.

### Key Features
- User authentication and account management
- Auction listing creation and browsing
- Bidding system for active auctions
- Search and filtering
- User messaging and notifications

Mazad was built to simulate a real auction marketplace while exploring practical full-stack development, service integration, and platform design.

## Instructions

### Prerequisites
Make sure the following tools are installed before running the project:

- **Docker** and **Docker Compose**
- **Node.js** and **npm**
- **Java 17+**
- **Git**
- **Makefile**

### Configuration
1. Clone the repository.
2. At the root of the project, create a `.env` file if it does not already exist.
3. Fill the required environment variables based on the provided `.env.example` file.

### Run the project
1. Start the backend services and infrastructure:
   ```bash
   make up
   ```

## Resources

### References
- [React Documentation](https://react.dev/reference/react)
- [TypeScript Tutorial](https://www.youtube.com/watch?v=d56mG7DezGs)
- [Spring Documentation](https://spring.io/projects)
- [Spring Tutorial](https://www.youtube.com/watch?v=4XTsAAHW_Tc)
- [Docker Tutorial](https://www.youtube.com/watch?v=3c-iBn73dDE)
### AI Usage
AI was used as a support tool during the project for:
- drafting documentation content
- improving wording and structure in the README
- generating and refining simple legal pages such as the Privacy Policy and Terms of Service
- assisting with small UI and code-related questions during development

All architecture, implementation, integration, and final technical decisions were made and reviewed by the project team.

## Team Information

### nhimad – Product Owner (PO)
Responsibilities: Defines the main idea of the product and decides what features it should have. Manages the product backlog and sets the priorities for the team. Makes sure the product meets the users’ needs.

### ajbari – Project Manager (PM)
Responsibilities: Organizes and plans the work of the team. Follows the progress of the project and makes sure tasks are finished on time. Helps the team communicate and solve problems.

### helarras – Tech Lead
Responsibilities: Makes the main technical decisions for the project. Designs the system structure, reviews the code, and helps developers when they have technical issues.

### haouky, arekoune – Developers
Responsibilities: Develops features of the application. Writes code, tests the functionality, and fixes bugs during development.

## Project Management

### Work Organization
The team organized the project by dividing the work into clear parts such as frontend, backend, infrastructure, and integration. Tasks were distributed according to each member’s role and area of responsibility. We also coordinated regularly to review progress, solve blocking issues, and adjust priorities when needed.

### Project Management Tools
The project was mainly managed using:
- **GitHub** for source control and collaboration
- **Discord Posts** for tracking tasks, bugs, and feature work
- **Git** branches and pull requests for organizing development

### Communication
The team used the following communication channels:
- **Discord** for daily communication and quick discussions
- in-person or voice meetings when needed for planning and coordination

## Technical Stack

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**

These technologies were chosen to build a fast, modern, and maintainable user interface with reusable components and strong typing.

### Backend
- **Java 17**
- **Spring Boot**
- **Spring Data JPA**
- **Spring Cloud Gateway**
- **Lombok**

These technologies were selected because they provide a strong ecosystem for building scalable backend services, API layers, and structured business logic.

### Database
- **PostgreSQL**

PostgreSQL was chosen because it is reliable, widely used, and well suited for structured relational data such as users, auctions, bids, and messages.

### Other Significant Technologies
- **Docker** and **Docker Compose** for containerization and service orchestration
- **Redis** for caching and rate-limiting support
- **Kafka** for event-driven communication between services
- **MinIO** for object storage and file handling

### Justification of Major Technical Choices
The project uses a modern full-stack architecture to simulate a real auction platform. On the frontend, React and TypeScript help create a clear and maintainable interface. On the backend, Spring-based services make it easier to separate responsibilities and organize the platform into multiple domains. PostgreSQL provides a solid relational database solution, while Docker simplifies setup and execution across environments. Redis, Kafka, and MinIO were included to support scalability, communication between services, and file storage needs.

## Database Schema

Mazad uses a **microservices database-per-service architecture**.  
Each service owns its own tables, and services communicate using shared IDs and events instead of direct cross-database foreign keys.

### Visual Representation

- **Auth Service** → `users`, `refresh_token`
- **User Service** → `user_profile`, `friendships`
- **Item Service** → `categories`, `items`, `item_images`
- **Bidding Service** → `auctions`, `bids`
- **Chat Service** → `messages`
- **Notification Service** → `notifications`

Main links between services:
- `user_id` connects auth-related data with profiles, items, messages, and notifications
- `auction_id` / `item_id` connects items with bidding

### Tables and Relationships

- **Auth Service**
  - Tables: `users`, `refresh_token`
  - Relationship: one user can have many refresh tokens

- **User Service**
  - Tables: `user_profile`, `friendships`
  - Relationship: friendships connect one user profile to another user profile

- **Item Service**
  - Tables: `categories`, `items`, `item_images`
  - Relationships:
    - one category can contain many items
    - one item can have many images
    - each item stores a `seller_id` that refers to a user

- **Bidding Service**
  - Tables: `auctions`, `bids`
  - Relationship: one auction can have many bids

- **Chat Service**
  - Table: `messages`
  - Relationship: each message has a sender and a receiver

- **Notification Service**
  - Table: `notifications`
  - Relationship: one user can have many notifications

### Key Fields and Data Types

- `id`, `user_id`, `seller_id`, `bidder_id` → `UUID`
- `auction_id`, `category_id` → `BIGINT`
- `title`, `username`, `email`, `status` → `VARCHAR`
- `description`, `content`, `message`, `shipping_info` → `TEXT`
- `starting_price`, `current_bid`, `amount` → `BIGINT`
- `created_at`, `updated_at`, `ends_at`, `timestamp` → `TIMESTAMP` / `TIMESTAMPTZ`
- `is_read`, `is_verified`, `is_complete`, `active` → `BOOLEAN`
- `specs` in `items` → `JSONB`

### Notes

Inside each service, normal SQL relationships are used.  
Between services, the platform links data using shared identifiers such as user IDs and auction/item IDs.

## Features List

### Implemented Features

#### 1. User Authentication
**Worked on by:** `arekoune`

Users can register, log in, and manage access to protected parts of the platform.

#### 2. User Profile Management
**Worked on by:** `arekoune`

Users can manage personal account information and profile-related data.

#### 3. Auction Listing Creation
**Worked on by:** `helarras, haouky`

Authenticated users can create auction listings with item information and publish them on the platform.

#### 4. Auction Browsing
**Worked on by:** `helarras`

Users can browse available auction items through the main interface.

#### 5. Search and Filtering
**Worked on by:** `helarras`

Users can search for items and refine results using available filters.

#### 6. Bidding System
**Worked on by:** `nhimad`

Users can place bids on active auctions, allowing competitive participation in item listings.

#### 7. Auction Details Page
**Worked on by:** `nhimad`

Users can open a dedicated page for each item to view detailed auction information.

#### 8. User Dashboard
**Worked on by:** `helarras`

Users can view and manage their own auction activity from a personal dashboard.

#### 9. Messaging / Chat
**Worked on by:** `ajbari`

Users can communicate through the platform to discuss auction-related matters.

#### 10. Notifications
**Worked on by:** `haouky`

Users receive notifications related to activity on the platform.

#### 11. File / Image Upload Support
**Worked on by:** `haouky`

The platform supports file or image handling for user and auction content.

#### 12. Privacy Policy and Terms of Service Pages
**Worked on by:** `helarras`

## Modules

### Selected Modules and Points

| Module                                                                                                             | Points | Justification                                                                                                                                                      | Implementation                                                                                                                                                                                                                   | Team Member(s)     |
|--------------------------------------------------------------------------------------------------------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| Major: Use a framework for both the frontend and backend                                                           | 2      | A full-stack framework-based approach was necessary to build a responsive user interface and a structured backend with clear APIs and maintainable business logic. | Implemented with **React**, **TypeScript**, and **Vite** on the frontend, and **Java**, **Spring Boot**, **Spring Data JPA**, and **Spring Cloud Gateway** on the backend.                                                       | `All Team Members` |
| Major: Backend as microservices                                                                                    | 2      | The platform required loosely-coupled services with clear responsibilities for authentication, profiles, items, bidding, chat, notifications, and uploads.         | Implemented as separate backend services (`auth-service`, `user-service`, `item-service`, `bidding-service`, `chat-service`, `notification-service`, `upload-service`) communicating through **REST APIs** and **Kafka** events. | `All Team Members` |
| Implement real-time features                                                                                       | 2      | Real-time behavior is important in an auction platform for updates such as bidding activity, chat, and live notifications.                                         | Implemented through real-time communication between services and live updates for user-facing features.                                                                                                                          | `nhimad, haouky`   |
| Allow users to interact with other users                                                                           | 2      | User-to-user interaction makes the platform more realistic and useful, especially in an auction context.                                                           | Implemented through chat/messaging and other user interaction features inside the platform.                                                                                                                                      | `ajbari, arekoune` |
| Public API                                                                                                         | 2      | A public API makes auction data accessible in a structured way and improves the technical value of the project.                                                    | Implemented through public endpoints exposed by the backend gateway and item-related services.                                                                                                                                   | `helarras`         |
| Use an ORM                                                                                                         | 1      | An ORM simplifies database access, entity management, and query handling in backend services.                                                                      | Implemented with **Spring Data JPA** to map application entities to relational database tables.                                                                                                                                  | `All Team Members` |
| Notification system                                                                                                | 1      | Notifications improve user awareness of auction events and platform activity.                                                                                      | Implemented as a dedicated notification feature/service for platform updates and user events.                                                                                                                                    | `haouky`           |
| File upload and management                                                                                         | 1      | Auctions require media support for item images and user-related content.                                                                                           | Implemented with upload handling and object storage for managing files and images.                                                                                                                                               | `haouky`           |
| Standard user management                                                                                           | 2      | User management is essential for authentication, profiles, and access control.                                                                                     | Implemented through registration, login, protected routes, profile handling, and account-related features.                                                                                                                       | `arekoune`         |
| Advanced search functionality                                                                                      | 1      | Search is a key feature in an auction platform and helps users quickly find relevant listings.                                                                     | Implemented with item search, filtering, and result browsing features.                                                                                                                                                           | `helarras`         |
| Support for additional browsers                                                                                    | 1      | Cross-browser support improves accessibility and usability for different users.                                                                                    | The frontend was developed and tested to work correctly on more than one modern browser.                                                                                                                                         | `All Team Members` |
| Minor: Custom-made design system with reusable components, including a proper color palette, typography, and icons | 1      | A consistent design system improves usability, maintainability, and visual coherence across the platform.                                                          | Implemented through a custom UI layer with reusable components such as buttons, inputs, cards, dialogs, grids, tables, pagination, dropdowns, checkboxes, icons, and layout elements used across the frontend.                   | `All Team Members` |

**Total Points: 18**

## Individual Contributions

### helarras
- Worked on auction browsing, search/filtering, dashboard, and public API related work.
- Also contributed to reusable frontend components and project structure.
- Challenge: keeping the UI consistent and connecting frontend filters with backend data.
- Solution: reused shared components and standardized API usage.

### nhimad
- Worked on the bidding system and auction details page.
- Contributed to real-time auction updates.
- Challenge: handling bid flow and auction timing correctly.
- Solution: added validation and tested different bidding scenarios.

### haouky
- Worked on notifications, file/image upload, and related integrations.
- Contributed to real-time user-facing updates.
- Challenge: making uploads and notifications work reliably with the platform.
- Solution: separated responsibilities clearly and improved integration testing.

### arekoune
- Worked on authentication, profile management, and user-related features.
- Contributed to protected routes and account handling.
- Challenge: keeping authentication and profile data consistent.
- Solution: used clear service boundaries and validation checks.

### ajbari
- Worked on messaging/chat and user interaction features.
- Contributed to conversation handling between users.
- Challenge: managing message flow and integrating chat with the platform.
- Solution: organized chat logic clearly and tested communication scenarios.
