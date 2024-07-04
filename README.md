[![วิดีโอตัวอย่าง](https://img.youtube.com/vi/G_4P9ih92hg/0.jpg)](https://youtu.be/G_4P9ih92hg)

**การติดตั้งโปรเจค**

1. คำสั่งติดตั้ง dependencies ทั้งหมด
```
yarn
```
3. ตั้งค่าฐานข้อมูล
```
ตั้งค่า connection string ในไฟล์ database.js
ใช้เพียงหนึ่งตารางในฐานข้อมูล คำสั่ง create และข้อมูลตัวอย่างอยู่ในไฟล์ game_history.sql อยู่ในโฟลเดอร์ backend
note: ไม่จำเป็นต้อง insert ข้อมูลเดิม แค่ create table ก็พอ
```
5. คำสั่งรันโปรเจค
```
npx lerna run dev --parallel
```

**หมายเหตุ:**
```
ในโหมด Play vs Bot หากเว็บไซต์มีความหน่วงหรือทำงานช้า สามารถปรับลดค่า depthLimit ที่บรรทัดที่ 129 ในไฟล์ Main.jsx
note: บอทเก่งขึ้นตามตัวเลขที่ปรับ ไม่มีผลกับการเล่นกับบอทในขนาดตาราง 3x3
```

**Detail**
```
Stack ที่ใช้พัฒนา
Front-end : ReactJS with Vite
Back-end  : NodeJS express.js
Database  : Mysql

Algorithm Bot : Minimax
Monorepo management tool : lerna
```

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
```

**Note**
```
In Play vs Bot mode, if the website is lagging or running slow, adjust the depthLimit value in Main.jsx,
line 129 (increasing the number makes the bot smarter
*does not affect playing against a bot on a 3x3 grid).
```
