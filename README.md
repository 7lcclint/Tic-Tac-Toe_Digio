**Setup Projects**

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

**Note**
```
In Play vs Bot mode, if the website is lagging or running slow,
adjust the depthLimit value in Main.jsx, line 129 (increasing the number makes the bot smarter
*does not affect playing against a bot on a 3x3 grid).
```
