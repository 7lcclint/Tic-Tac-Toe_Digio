Setup Projects

1. install all dependencies
```
yarn
```
2. Setup database
```
- Setup connection string in database.js
- Use only one table in the database. The create 
command and sample data (no need to insert actual data) are in a file named game_history.sql in the backend folder.
```
4. run web and api-gateway in parallel
```
npx lerna run dev --parallel

