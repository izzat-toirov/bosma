# Mockup Backend API

A comprehensive backend API for an e-commerce platform with print-on-demand functionality, built with NestJS and Prisma ORM.

## Features

- User authentication with JWT
- Product management with variants
- Shopping cart functionality
- Order management with design customization
- File upload with Sharp image processing and Supabase storage
- Admin dashboard with print file access
- Cart-to-order conversion
- Role-based access control

## Prerequisites

- Node.js 18+
- PostgreSQL
- Docker (optional, for containerized deployment)

## Installation

### Local Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd mockup
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the template below:

```env
DATABASE_URL="postgresql://mockup_user:mockup_password@localhost:5432/mockup_db"
JWT_SECRET="your_jwt_secret_key"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
ACCESS_TOKEN_KEY="your_access_token_key"
REFRESH_TOKEN_KEY="your_refresh_token_key"
SUPABASE_URL="your_supabase_url"
SUPABASE_KEY="your_supabase_service_role_key"
PORT=3000
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run start:dev
```

### Docker Setup

1. Build and start the containers:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`.

## API Documentation

Swagger documentation is available at `http://localhost:3000/api` when the server is running.

## Admin API Access

### Print Files Endpoint

- **Endpoint**: `GET /orders/:id/print-files`
- **Role Required**: ADMIN or SUPER_ADMIN
- **Description**: Returns detailed print file information for an order
- **Response Structure**:

```json
{
  "order": {
    "id": 1,
    "status": "PENDING",
    "paymentStatus": "PAID",
    "totalPrice": 99.99,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "customer": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "items": [
    {
      "id": 1,
      "variant": {
        "id": 1,
        "color": "red",
        "size": "M",
        "frontImage": "front-image-url",
        "backImage": "back-image-url"
      },
      "product": {
        "id": "1",
        "name": "T-Shirt"
      },
      "quantity": 1,
      "price": 49.99,
      "frontOriginalUrl": "original-image-url",
      "frontPreviewUrl": "preview-image-url",
      "backOriginalUrl": "back-original-url",
      "backPreviewUrl": "back-preview-url",
      "frontCoordinates": {
        "x": 100,
        "y": 200,
        "scale": 1.2,
        "rotation": 45,
        "imageUrl": "design-image-url"
      },
      "backCoordinates": {
        "x": 150,
        "y": 250,
        "scale": 1.0,
        "rotation": 0,
        "imageUrl": "back-design-image-url"
      }
    }
  ]
}
```

## Design Object Structure

When creating orders or cart items with custom designs, use the following structure:

```json
{
  "frontDesign": {
    "x": 100,
    "y": 200,
    "scale": 1.2,
    "rotation": 45,
    "imageUrl": "design-image-url"
  },
  "backDesign": {
    "x": 150,
    "y": 250,
    "scale": 1.0,
    "rotation": 0,
    "imageUrl": "back-design-image-url"
  }
}
```

## Environment Variables

| Variable           | Description                           |
| ------------------ | ------------------------------------- |
| DATABASE_URL       | PostgreSQL database connection string |
| JWT_SECRET         | Secret key for JWT access tokens      |
| JWT_REFRESH_SECRET | Secret key for JWT refresh tokens     |
| ACCESS_TOKEN_KEY   | Key for access token validation       |
| REFRESH_TOKEN_KEY  | Key for refresh token validation      |
| SUPABASE_URL       | Supabase project URL                  |
| SUPABASE_KEY       | Supabase service role key             |

## Available Scripts

- `npm run build`: Compile the application
- `npm run start`: Start production server
- `npm run start:dev`: Start development server with watch mode
- `npm run start:debug`: Start development server with debug mode
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run e2e tests
- `npm run test:cov`: Run tests with coverage

## Database Migrations

To create a new migration:

```bash
npx prisma migrate dev --name migration_name
```

To apply migrations in production:

```bash
npx prisma migrate deploy
```

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Run the production server:

```bash
npm run start:prod
```

Or use the Docker setup for containerized deployment.
