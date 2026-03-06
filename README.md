# auction-platform
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

### <login1!> - <Role1!>
**Responsibilities:** Briefly describe this member’s main responsibilities in the project, such as planning, coordination, backend development, frontend development, testing, or deployment.

### <login2!> - <Role2!>
**Responsibilities:** Briefly describe this member’s main responsibilities in the project, such as feature development, debugging, UI integration, database work, or service implementation.

### <login3!> - <Role3!>
**Responsibilities:** Briefly describe this member’s main responsibilities in the project, such as architecture decisions, code review, API design, infrastructure setup, or documentation.

### <login4!> - <Role4!>
**Responsibilities:** Briefly describe this member’s main responsibilities in the project, such as architecture decisions, code review, API design, infrastructure setup, or documentation.

### <login5!> - <Role5!>
**Responsibilities:** Briefly describe this member’s main responsibilities in the project, such as architecture decisions, code review, API design, infrastructure setup, or documentation.

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

### Overview
Mazad uses a relational database structure centered around the main auction platform entities: users, items, bids, messages, and notifications. The data model was designed to support account management, auction creation, bidding activity, and user interaction.

### Main Tables and Relationships
- **users**
    - Stores user account and profile information
    - A user can create many auction items
    - A user can place many bids
    - A user can send and receive messages

- **items**
    - Stores auction listings created by users
    - Each item belongs to one seller
    - One item can receive many bids

- **bids**
    - Stores bid history for auction items
    - Each bid belongs to one item
    - Each bid belongs to one user

- **messages / chats**
    - Stores communication between users
    - Linked to users participating in conversations

- **notifications**
    - Stores user notifications related to auction activity and platform events
    - Each notification belongs to one user

### Typical Relationships
- One **user** → many **items**
- One **user** → many **bids**
- One **item** → many **bids**
- One **user** → many **notifications**
- Users can participate in many **messages/chats**

### Key Fields and Data Types
Examples of important fields used in the database include:
- `id` — integer / bigint / UUID
- `username` — string / varchar
- `email` — string / varchar
- `password` — string / varchar
- `title` — string / varchar
- `description` — text
- `starting_price` — decimal / numeric
- `current_bid` — decimal / numeric
- `created_at` — timestamp
- `ends_at` — timestamp
- `status` — string / enum
- `user_id` — foreign key
- `item_id` — foreign key

### Schema Notes
The database structure was chosen to keep auction-related data clear and relational. This makes it easier to manage ownership, bid history, user actions, and platform interactions in a consistent way.

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

| Module | Points | Justification | Implementation | Team Member(s)     |
|--------|--------|---------------|----------------|--------------------|
| Use a frontend framework | 1 | A frontend framework was necessary to build a responsive and maintainable user interface for browsing auctions, bidding, and managing accounts. | Implemented with **React**, **TypeScript**, and **Vite**, using reusable components and client-side routing. | `All Team Members` |
| Use a backend framework | 1 | A backend framework was needed to structure APIs, business logic, and service communication. | Implemented with **Java**, **Spring Boot**, **Spring Data JPA**, and **Spring Cloud Gateway** in a microservices architecture. | `All Team Members` |
| Implement real-time features | 2 | Real-time behavior is important in an auction platform for updates such as bidding activity, chat, and live notifications. | Implemented through real-time communication between services and live updates for user-facing features. | `nhimad, haouky`   |
| Allow users to interact with other users | 2 | User-to-user interaction makes the platform more realistic and useful, especially in an auction context. | Implemented through chat/messaging and other user interaction features inside the platform. | `ajbari, arekoune` |
| Public API | 2 | A public API makes auction data accessible in a structured way and improves the technical value of the project. | Implemented through public endpoints exposed by the backend gateway and item-related services. | `helarras`         |
| Use an ORM | 1 | An ORM simplifies database access, entity management, and query handling in backend services. | Implemented with **Spring Data JPA** to map application entities to relational database tables. | `All Team Members` |
| Notification system | 1 | Notifications improve user awareness of auction events and platform activity. | Implemented as a dedicated notification feature/service for platform updates and user events. | `haouky`           |
| File upload and management | 1 | Auctions require media support for item images and user-related content. | Implemented with upload handling and object storage for managing files and images. | `haouky`           |
| Standard user management | 2 | User management is essential for authentication, profiles, and access control. | Implemented through registration, login, protected routes, profile handling, and account-related features. | `arekoune`         |
| Advanced search functionality | 1 | Search is a key feature in an auction platform and helps users quickly find relevant listings. | Implemented with item search, filtering, and result browsing features. | `helarras`         |
| Support for additional browsers | 1 | Cross-browser support improves accessibility and usability for different users. | The frontend was developed and tested to work correctly on more than one modern browser. | `All Team Members` |

**Total Points: 15**

## Individual Contributions

### <login1>
- Worked on the planning and implementation of key parts of the project
- Contributed to feature development, debugging, and integration
- Faced challenges related to coordination and technical integration, which were solved through team discussion and iterative testing

### <login2>
- Worked on backend or frontend development depending on assigned tasks
- Contributed to core features, project structure, and implementation work
- Faced challenges related to feature complexity and resolved them through testing and refactoring

### <login3>
- Worked on development, fixes, and support tasks across the project
- Contributed to implementation, improvements, and project completion
- Faced challenges related to integration and solved them through collaboration and debugging