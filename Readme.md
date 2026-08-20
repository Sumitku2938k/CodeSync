# CodeSync

> A real-time collaborative code editor for developers to code together from anywhere.

CodeSync is a real-time collaborative coding platform that allows multiple developers to work on the same code simultaneously.

Changes made by one user are instantly synchronized with other connected users, creating a shared coding environment similar to collaborative editors.

## 🚀 Features

- 👥 Real-time collaborative code editing
- ⚡ Instant synchronization using Socket.IO
- 💻 Modern code editor interface
- 🔄 Multiple users can work on the same session
- 🌐 Real-time client-server communication
- 🐳 Dockerized application
- ☁️ AWS deployment
- 📦 Persistent project/data storage
- 🔌 REST APIs for application functionality

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- Socket.IO

### Database
- MongoDB

### DevOps & Deployment
- Docker
- AWS

## 🏗️ How It Works

CodeSync maintains a persistent connection between clients and the server using Socket.IO.

```text
    Developer A
       │
       │ Code Changes
       ▼
┌────────────────┐
│   Socket.IO    │
│     Server     │
└──────┬─────────┘
       │
       │ Real-time Events
       ▼
    Developer B
```

## 🏃‍♂️ Running Backend & Frontend on the Same Domain/Port

To serve the frontend and backend from a single domain and port, follow these steps:

1.  **Build the Frontend Application**
    -   In your `Frontend` directory, run the build command:
        ```bash
        npm run build
        ```
    -   This will create a `dist` folder containing the static HTML, CSS, and JavaScript files for your React application.

2.  **Copy Frontend Build to Backend**
    -   Copy the entire contents of the `Frontend/dist` directory.
    -   Paste these files into the `Backend/public` directory.

3.  **Serve Static Files with Express**
    -   In your backend's main server file, use the `express.static()` middleware to serve the `public` folder.
        ```javascript
        app.use(express.static('public'));
        ```

4.  **Run the Backend Server**
    -   Once the backend server is running, you can access the complete application (both frontend and backend) from the backend's URL.

## 🐳 Dockerize and Run Backend (Running Backend Server using Docker)

This section explains how to containerize and run the backend application using Docker.

### 1. Dockerfile

Here is the `Dockerfile` used to create the image for the backend server:

```dockerfile
FROM node:22-alpine

COPY ./Backend .

RUN npm install

CMD ["node", "server.js"]
```

### 2. Build the Docker Image

To build the Docker image, run the following command from the root of the project:

```bash
docker build -t backend .
```

### 3. Run the Docker Container

Once the image is built, you can run it as a container. The server inside the container runs on port `3000`. To access it from your host machine, you need to map a host port to the container's port using the `-p` flag.

For example, to map port `4000` on your host to port `3000` in the container, run:

```bash
docker run -p 4000:3000 backend
```

You will see the server running confirmation:

```
Server is running on port http://localhost:3000
```

Now, you can access the application in your browser at `http://localhost:4000`.

## 🐳 Multi-Stage Docker Build

This approach uses a single `Dockerfile` to build both the frontend and backend, resulting in a final, optimized image that serves the complete application.

### 1. Multi-Stage Dockerfile

The `Dockerfile` is split into two main stages:

1.  **`frontend-builder`**: This stage installs dependencies and builds the static frontend files.
2.  **`backend-builder`**: This stage sets up the backend server and copies the built frontend assets from the previous stage.

```dockerfile
# Stage 1: Build the frontend
FROM node:22-alpine as frontend-builder

# Copy Frontend folder content to the app folder
COPY ./Frontend /app

# Set the present working directory in the container
WORKDIR /app

# Install all the frontend dependencies
RUN npm install

# Build the dist folder
RUN npm run build

# Stage 2: Build the backend and serve the frontend
FROM node:22-alpine as backend-builder

# Copy the Backend folder content to the app folder
COPY ./Backend /app

# Set the present working directory
WORKDIR /app

# Install all the backend dependencies
RUN npm install

# Copy the dist folder from the frontend-builder stage to the backend's public folder
COPY --from=frontend-builder /app/dist ./public

# Run the server
CMD ["node", "server.js"]
```

### 2. Build the Docker Image

Build the final image using the following command. This will execute both stages and create an image named `server`.

```bash
docker build -t server .
```

### 3. Run the Docker Container

Run the container, mapping your local port `4000` to the container's port `3000`.

```bash
docker run -p 4000:3000 server
```

The server will start, and you'll see the output:

```
Server is running on port http://localhost:3000
```

You can now access the full application from your browser at **`http://localhost:4000`**.

## ☁️ Push Docker Image to Amazon ECR

This section shows how to push your Docker image to Amazon Elastic Container Registry (ECR) so it can be deployed on AWS.

### 1. Create an IAM User in AWS (if not already created)

If you do not already have an AWS user with programmatic access, create one first.

Open the AWS IAM Users page:

https://us-east-1.console.aws.amazon.com/iam/home?region=ap-south-1#/users

Then follow these steps:

1. Click `Add users`
2. Enter a username, for example: `docker-aws-user`
3. Select **AWS access type**: `Programmatic access`
4. Click **Next: Permissions**
5. Attach a policy such as:
   - `AmazonEC2ContainerRegistryFullAccess`
   - or `AdministratorAccess` for a simple setup
6. Click **Next** and then **Create user**
7. After user creation, click the username
8. Go to the **Security credentials** tab
9. Under **Access keys**, click **Create access key**
10. Download the CSV file or copy the values shown

Important values to store:
- `Access key ID`
- `Secret access key`

These are the credentials you will use with the AWS CLI.

### 2. Install AWS CLI

If AWS CLI is not installed, install it first.

Then configure it by running:

```bash
aws configure
```

When prompted, enter:
- `AWS Access Key ID`: your access key ID
- `AWS Secret Access Key`: your secret access key
- `Default region name`: `ap-south-1`
- `Default output format`: `json`

Example:

```bash
AWS Access Key ID [None]: AKIAxxxxxxxxxxxxxxxx
AWS Secret Access Key [None]: your-secret-access-key
Default region name [None]: ap-south-1
Default output format [None]: json
```

> Use `json` as the output format unless you specifically want a different format.

### 3. Create an ECR Repository

Create a repository in AWS ECR:

```bash
aws ecr create-repository --repository-name docker-aws/server --region ap-south-1
```

This will return a repository URI like:

```bash
481810542997.dkr.ecr.ap-south-1.amazonaws.com/docker-aws/server
```

### 3. Log in to ECR

Authenticate Docker with AWS ECR:

```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 481810542997.dkr.ecr.ap-south-1.amazonaws.com
```

### 4. Build the Docker Image

From the project root, build the image:

```bash
docker build -t server .
```

Or tag it with a custom name:

```bash
docker tag server:latest 481810542997.dkr.ecr.ap-south-1.amazonaws.com/docker-aws/server:latest
```

### 5. Push the Image to ECR

```bash
docker push 481810542997.dkr.ecr.ap-south-1.amazonaws.com/docker-aws/server:latest
```

### 6. Verify the Image in AWS ECR

Open the AWS Console and go to:
- Amazon ECR
- Repositories
- `docker-aws/server`

You should see the `latest` image uploaded successfully.

### 7. Pull the Image Later

To pull the same image later:

```bash
docker pull 481810542997.dkr.ecr.ap-south-1.amazonaws.com/docker-aws/server:latest
```

### Example Full Workflow

```bash
aws configure
aws ecr create-repository --repository-name docker-aws/server --region ap-south-1
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 481810542997.dkr.ecr.ap-south-1.amazonaws.com
docker build -t server .
docker tag server:latest 481810542997.dkr.ecr.ap-south-1.amazonaws.com/docker-aws/server:latest
docker push 481810542997.dkr.ecr.ap-south-1.amazonaws.com/docker-aws/server:latest
```

This is the standard process to push a Docker image to Amazon ECR and use it for deployment on AWS services like ECS, EC2, or EKS.

## 🚀 Deploying on AWS ECS (Fargate)

This guide helps you deploy your app on **AWS ECS using Fargate** in a clean, step-by-step way.

### 📌 What is a Task Definition?

A **Task Definition** is like a blueprint for your containerized app.  
It defines:

- Docker image
- CPU and memory
- Networking
- Port mappings
- IAM roles

Go to ECS in the AWS Management Console then to Task Definition.

---

### 1) Build for Correct Architecture (Important)

If you're on Windows and face OS/Architecture issues, build for Linux AMD64:

```bash
docker buildx build --platform linux/amd64 -t docker-aws/server .
```

Then tag and push to ECR:

```bash
docker tag docker-aws/server:latest <your-account-id>.dkr.ecr.<region>.amazonaws.com/<repo-name>:latest
docker push <your-account-id>.dkr.ecr.<region>.amazonaws.com/<repo-name>:latest
```

---

### 2) Create Task Definition in ECS

1. Open **AWS Console → ECS → Task Definitions**
2. Click **Create new Task Definition**
3. Select **Launch type: Fargate**
4. Set:
   - **CPU**: `1 vCPU`
   - **Memory**: `3 GB` (default)
5. In **Task Role** and **Task Execution Role**, select:
   - `ecsTaskExecutionRole`  
   > If missing, create it in IAM first.
6. In **Container image**, browse and select latest image from **ECR**
7. In **Port mappings**, set container port to:
   - `3000`

---

### 3) Create ECS Cluster

1. Go to **ECS → Clusters**
2. Click **Create cluster**
3. Choose **Networking only (AWS Fargate)**
4. After creating the cluster, go to the cluster and then to the create service. (Service is the one that runs your defined task)

---

### 4) Create VPC + Networking

1. Create a VPC using **“VPC and more”**
2. While creating ECS service, select:
   - Your new **VPC** in the networking section
   - **Public subnets** (for internet access)

---

### 5) Security Group Setup

Create a Security Group (in EC2) attached to the same VPC.

### Inbound Rules:
- `80` → Source: `0.0.0.0/0` (Anywhere IPv4)
- `3000` → Source: `0.0.0.0/0` (Anywhere IPv4)

Use this SG in ECS Service networking settings.

---

### 6) Create Application Load Balancer (ALB)

Go to **EC2 → Load Balancers → Create Load Balancer → Application Load Balancer**

Configure:

- **VPC**: same VPC as ECS
- **Availability Zones/Subnets**: select both AZs
- **Security Group**: the one you created above
- **Listener**: `HTTP`
- **Target Group Port**: `3000`
- Give clear names to ALB and Target Group

Create the ALB.

---

### 7) Create ECS Service

1. Open your ECS cluster
2. Click **Create Service**
3. Select the task definition
4. In Networking, select:
   - VPC + public subnets
   - Security Group created earlier
5. In Load Balancing:
   - Enable **Use Load Balancing**
   - Select the ALB + Target Group created above
6. Click **Next → Create Service**

---

### 8) Access Your App

Once service is running and healthy:

- Open the **ALB DNS name**  
- Your app should be live 🎉

---

### 9) Connect Domain + HTTPS (Recommended)

To make production-ready:

1. Point your custom domain to ALB (via Route 53 or your DNS provider)
2. Create SSL cert in **AWS Certificate Manager (ACM)**
3. Attach certificate to ALB listener (HTTPS :443)

---