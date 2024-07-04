**การติดตั้งโปรเจค**

1. ติดตั้ง dependencies ทั้งหมด
```
yarn
```
3. ตั้งค่าฐานข้อมูล
```
ตั้งค่า connection string ในไฟล์ database.js
ใช้เพียงหนึ่งตารางในฐานข้อมูล คำสั่ง create และข้อมูลตัวอย่างอยู่ในไฟล์ game_history.sql อยู่ในโฟลเดอร์ backend
*ไม่จำเป็นต้อง insert ข้อมูลเดิม แค่ create table ก็พอ
```
5. คำสั่งรันโปรเจค
```
npx lerna run dev --parallel
```

**หมายเหตุ:**
```
ในโหมด Play vs Bot หากเว็บไซต์มีความหน่วงหรือทำงานช้า สามารถปรับค่า depthLimit ที่บรรทัดที่ 129 ในไฟล์ Main.jsx เพื่อทำให้บอทเล่นฉลาดขึ้น (เพิ่มค่านี้จะไม่มีผลกับการเล่นกับบอทในกริดขนาด 3x3)
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
