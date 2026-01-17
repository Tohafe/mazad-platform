# 🚀 Project Setup & Contribution Guide

Please follow these steps to set up your environment and structure your code so we can easily link our
microservices.

### 1. Environment Variables

I have pushed a `.env.example` file to the root.

1. Copy it to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```

2. **DO NOT push the `.env` file.**
3. Fill in the specific values (ports, db names) for the service you are working on.

### 2. Folder Structure

We are using a standard structure. Please adhere to this hierarchy:

```text
/project-root
├── .env                  <-- Local secrets (ignored)
├── docker-compose.yml    <-- Root orchestration
├── init-scripts/         <-- Database initialization scripts
├── backend/              <-- All Java Microservices go here
│   ├── item-service/
│   ├── bidding-service/
│   ├── auth-service/
│   └── ...
└── frontend/             <-- React/Web project
    └── ...
```

### 3. What Goes Inside Your Service Folder?

For your specific microservice (e.g., `bidding-service`), you must include:

* **Source Code:** The full `src` folder and `pom.xml`.
* **Dockerfile:** A valid Dockerfile to build your jar and run it.
* **.gitignore:** Create a `.gitignore` inside your service folder that excludes the `/target` directory (so we don't
  push compiled binaries).

### 4. Database Scripts

If your service needs a database table created immediately upon startup:

* Export your schema as a `.sql` file.
* Place it inside the `/init-scripts` folder in the root.
* The database container will run these scripts automatically.

### 5. Git Rules

* Never push API keys or passwords.
* Always pull the latest changes before starting work.
* Keep your Dockerfile lightweight (use a multi-stage build if possible).