# Welcome to Svelte-MOBAS (MinIO, ORM (Drizzle), Better-Auth, SQL (Postgres)
**This** is a boilerplate designed **to** get you started with this stack as easily as possible by comprehensive documentation and minimal code.

## Prerequisites
For this boilerplate, you will need to install:
* [**Docker**](https://www.docker.com/get-started/) and then either [**Docker Compose**](https://docs.docker.com/compose/install/) or [**Podman Compose**](https://github.com/containers/podman-compose) to run the `docker-compose.yml` file.
* **Node.js** (which includes npm).

If you would like to know more about docker, here are some references I recommend:

[Docker in 100 Seconds](https://www.youtube.com/watch?v=Gjnup-PuquQ)<br/>
[Docker Compose Tutorial](https://www.youtube.com/watch?v=HG6yIjZapSA)<br/>
[When would you want to use docker and docker-compose on your projects?](https://www.youtube.com/watch?v=m3To85qMOuA)

# Getting Started

### Initial Setup
1.  **Clone the Repository:** Clone the repo and open it in your code editor.
2.  **Install Dependencies:** Run `npm i` to install the necessary Node.js packages for the project.
3.  **Configure Environment Variables:** A `.env.example` file is provided to show you the required environment variables. Create a new file named `.env` in the root of your project. You can copy the contents from `.env.example` and fill in your specific values. **Important:** For production or deployment, ensure you replace all example values with strong, unique keys and credentials for security.
4.  **Start Docker Services:** After configuring your `.env` file, run `docker-compose up -d` to spin up the Docker services (PostgreSQL, PgAdmin, MinIO) in the background.

### [MinIO](https://min.io/docs/minio/linux/developers/minio-drivers.html?ref=docs)
MinIO is an **open-source**, high-performance object storage server that is **API compatible with Amazon S3**. It allows you to store unstructured data like photos, videos, backups, and logs, and is often used for cloud-native applications, on-premises deployments, and local development to simulate cloud storage.

1. After you've spun up your Docker services, go to http://localhost:9001 to access the MinIO console. Log in using the username and password you set in your `.env` file.
2. Once you're in, create your bucket. You'll also save the name of this bucket in your `.env` under the **PUBLIC_BUCKET_NAME** variable.
3. Finally, navigate to the **"Access Keys"** tab and create a new set of access keys. These are the credentials your application will use to interact with your bucket. Be sure to copy both your Access Key and Secret Key immediately, as you'll need to add them to your .env file before saving.

### [PostgreSQL](https://www.postgresql.org/docs/) & [PgAdmin](https://www.pgadmin.org/docs/)
Postgres and PgAdmin should already be ready to use. This boilerplate leverages Drizzle-Kit, which includes Drizzle-Studio, a built-in database management tool. You can launch Drizzle-Studio with the command `npx drizzle-kit studio`.

PgAdmin is purely optional and can be removed from your docker-compose.yml file if you prefer not to use it. If you wish to use PgAdmin:
1. Access it by going to http://localhost:5050.
2. Log in with the credentials set in your `.env` file.
3. Once logged in, connect to your Postgres database by going to "Add Server" and entering the database access credentials from your .env file.



### [Better-Auth](https://www.better-auth.com/docs/introduction)
To set your better auth secret go to https://www.better-auth.com/docs/installation to generate a secret. Once generated copy and paste it into your `.env` file.

### [Drizzle-Kit](https://orm.drizzle.team/docs/overview)
This project utilizes Drizzle-Kit for database schema management and migrations. After making changes to your Drizzle schemas (defined in `src/lib/server/schemas/`), you will use Drizzle-Kit CLI commands to generate and apply migrations to your database.<br />

Use `npx drizzle-kit generate` to generate migrations and then `npx drizzle-kit migrate` to apply those migrations to your database. For more in depth commands consolidate the Drizzle documentation.

**Note on Example Schemas:**
The file `src/lib/server/schemas/example.ts` (along with its corresponding entries in `src/lib/server/schemas/relations.ts`) is provided as an example of how to define your database models. You can safely remove or modify this file to fit your application's specific data requirements.


# Congratulations!
**Congratulations!** You have successfully set up the Svelte-PMB boilerplate! Now you can get started with your full stack Sveltekit application.
