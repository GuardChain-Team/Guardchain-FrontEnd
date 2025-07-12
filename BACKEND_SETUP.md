# GuardChain Backend Setup Instructions

## Prerequisites

1. **PostgreSQL Database**: You need a PostgreSQL database running. You can use:
   - Local PostgreSQL installation
   - Docker: `docker run --name guardchain-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=guardchain_db -p 5432:5432 -d postgres`
   - Cloud service like Supabase, Neon, or AWS RDS

## Setup Steps

### 1. Configure Environment Variables

Update your `.env.local` file with your actual database connection string:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/guardchain_db?schema=public"
```

Replace `username`, `password`, `localhost`, `5432`, and `guardchain_db` with your actual database credentials.

### 2. Initialize Database

Run these commands in order:

```bash
# Generate Prisma client
npm run db:generate

# Create and apply database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 3. Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Default Users

After seeding, you can login with these accounts:

- **Admin**: `admin@guardchain.com` / `admin123`
- **Investigator**: `investigator@guardchain.com` / `investigator123`
- **Analyst**: `analyst@guardchain.com` / `analyst123`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Transactions

- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/[id]` - Get transaction details
- `PUT /api/transactions/[id]` - Update transaction

### Fraud Detection

- `GET /api/fraud/alerts` - List alerts
- `POST /api/fraud/alerts` - Create alert
- `GET /api/fraud/alerts/[id]` - Get alert details
- `PUT /api/fraud/alerts/[id]` - Update alert
- `GET /api/fraud/investigations` - List investigations
- `POST /api/fraud/investigations` - Create investigation

### Analytics

- `GET /api/analytics` - Get analytics data

### WebSocket

- Connection: `ws://localhost:8080/ws`
- Real-time updates for alerts, transactions, and system events

## Database Management

### Useful Commands

```bash
# View database in browser
npm run db:studio

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Create new migration
npx prisma migrate dev --name your_migration_name

# Deploy migrations to production
npx prisma migrate deploy
```

## Features Implemented

✅ **Authentication System**

- JWT-based authentication
- Role-based access control (Admin, Investigator, Analyst, Viewer)
- Secure password hashing

✅ **Transaction Management**

- CRUD operations for transactions
- Risk score calculation
- Automatic fraud detection

✅ **Fraud Detection**

- Alert management system
- Investigation workflow
- Risk assessment

✅ **Analytics Dashboard**

- Transaction analytics
- Fraud statistics
- Real-time monitoring

✅ **Real-time Updates**

- WebSocket integration
- Live notifications
- Real-time data synchronization

✅ **Database Integration**

- PostgreSQL with Prisma ORM
- Comprehensive data model
- Seed data for testing

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- SQL injection protection (Prisma)
- Input validation with Zod

## Next Steps

1. Update environment variables with your actual database credentials
2. Set up PostgreSQL database
3. Run database migrations and seed
4. Test the API endpoints
5. Customize the fraud detection algorithms
6. Add email notifications
7. Implement additional security measures for production

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database credentials

### Migration Issues

```bash
# If migrations fail, try resetting
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Port Conflicts

- Next.js runs on port 3000
- WebSocket server runs on port 8080
- PostgreSQL typically runs on port 5432

Make sure these ports are available or update the configuration accordingly.
