# RapidDeploy 

RapidDeploy is a deployment service that makes it easy to deploy React applications on AWS ECS Docker containers. It automates the setup, build, and deployment processes, and includes log streaming. This service simplifies deploying and running React apps at scale using good system design practices.


## Features

- Automatically deploys React applications to AWS ECS Docker containers
- Clones GitHub repositories, installs dependencies, and sets up environment variables
- Builds the application and uploads it to an S3 bucket
- Serves the website from S3 to a local host URL using proper DNS and reverse proxy.


## Technologies used

| Service        | Technologies used                                  |
| -------------- | -----------------------------------------          |
| Client Website | Next.js, Socket.io, Shadcn-ui, Radix-ui            |
| Build Server   | Docker, AWS-ECS,ECR,S3 Bucket, Redis               |
| API Server     | Node.js, Express.js, Socket.io, Redis, aws-sdk     |
| Reverse Proxy  | Node.js, Express.js, http-proxy, AWS-S3 Bucket     |


## Setup

1. Clone the repository:

```bash
git clone https://github.com/Akash1000x/RapidDeploy.git
cd RapidDeploy
```

2. Go to individual services and install the dependencies by using 

```bash
npm install
```

3. For Build Server Build the docker image, and upload it to AWS-ECR(Amazon Elastic Container Registry).

4. Make cluster group at AWS-ECS service and task definations and add the necessory keys to the respective env files of api_server and proxy service.

5. Run the services.

- Run Api server :
  ` cd api-server && node index.js`

- Run Proxy service :
  ` cd s3-reverse-proxy && node index.js`

- Run frontend :
  ` cd frontend && npm run dev`

6. Go to `localhost:3000` and add a git repo url.

7. Wait for the project to be built and then click the generated url.

## Support

If you have any questions or need assistance, please contact me at https://akashkumawat.vercel.app/

## Contributing
  Feel free to contribute to the project. If you have suggestions or find any issues, please open an issue.
