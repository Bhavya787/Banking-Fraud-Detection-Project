# Modern Banking System

Full‑stack banking application built with **Spring Boot**, **React (Vite)**, **Tailwind CSS**, and **MySQL**. Includes authentication, role‑based access, account management, transfers, transactions, and history.

## Stack
- Backend: Spring Boot 3, Spring Security, JPA (Hibernate)
- Frontend: React + Vite + Tailwind CSS
- Database: MySQL (Workbench)

## Prerequisites
- Java 17+
- Node.js 18+
- MySQL Server on `localhost:3306`

## Database Setup (MySQL Workbench)
Create the database:
```sql
CREATE DATABASE banking_system;
```
Default credentials used by the app:
- user: `root`
- password: `root`
Update if needed in [application.properties](file:///c:/Users/BHAVYA%20C%20SHETTY/OneDrive/Desktop/BankingSystem-master/modern-banking/backend/src/main/resources/application.properties).

## Configuration (Backend)
- Port: `8081`
- Datasource:
  ```
  spring.datasource.url=jdbc:mysql://localhost:3306/banking_system?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false
  spring.datasource.username=root
  spring.datasource.password=root
  spring.jpa.hibernate.ddl-auto=update
  ```

## Running
### Backend (Spring Boot)
In `modern-banking/backend`:
```bash
mvn spring-boot:run
```
Backend API: `http://localhost:8081`

### Frontend (React)
In `modern-banking/frontend`:
```bash
npm install
npm run dev
```
Frontend: `http://localhost:5173`


## Features
- Account creation for Savings, Current, Student
- Role‑based data access (Admin sees all, User sees own)
- Deposit, Withdraw, and Transfer funds
- Transaction history per account
- Error handling with clear messages

## Troubleshooting
- Port in use (8081):
  - Stop the existing process using port 8081, or change `server.port` in [application.properties](file:///c:/Users/BHAVYA%20C%20SHETTY/OneDrive/Desktop/BankingSystem-master/modern-banking/backend/src/main/resources/application.properties).
- MySQL credentials:
  - If your MySQL password differs, update `spring.datasource.username` and `spring.datasource.password` accordingly and restart the backend.
