# LAB-06: Low-Level Design และการสร้าง UI Components

**ประเภทงาน:** งานกลุ่ม (Group Project)
**เครื่องมือ:** React.js, VS Code

---

### 🎯 วัตถุประสงค์ (Objectives)

1.  สามารถแปลง Wireframe จาก High-Level Design มาเป็นโครงสร้าง React Component ได้
2.  สามารถแยกความรับผิดชอบระหว่าง Logic (Container) และ UI (Presentational) Components ได้
3.  สามารถสร้างชุด UI Components ที่นำกลับมาใช้ใหม่ได้ (Reusable) และสื่อสารกันผ่าน Props

---

### 📝 สถานการณ์ (Scenario)

ต่อเนื่องจาก **LAB-05** หลังจากที่กลุ่มของคุณได้ออกแบบโครงสร้างและ Wireframe สำหรับแอปพลิเคชัน **"TaskFlow"** เรียบร้อยแล้ว ใน Lab นี้ เราจะเริ่มลงมือสร้างส่วนประกอบหน้าจอ (UI Components) ตามพิมพ์เขียวที่ได้ออกแบบไว้

**เป้าหมายหลัก:** สร้างหน้าจอ Task Board ที่แสดงผลข้อมูลตัวอย่าง (Hardcoded Data) ให้ได้ตาม Wireframe โดยใช้หลักการออกแบบ Component ที่ดี

---

### 🚀 ขั้นตอนการทำ Lab (Tasks)

#### ส่วนที่ 1: ตั้งค่าโปรเจกต์และวางโครงสร้างโฟลเดอร์

1.  **สร้างโปรเจกต์ React:**
    ```bash
    npx create-react-app task-board-ui
    cd task-board-ui
    ```
2.  **สร้างโครงสร้างโฟลเดอร์:** ภายในโฟลเดอร์ `src` ให้สร้างโฟลเดอร์ `components` และแบ่งย่อยดังนี้
    ```
    /src
    |-- /components
    |   |-- /common  (สำหรับ Components ทั่วไปที่ใช้ซ้ำได้ เช่น Button, Card)
    |   |-- /features (สำหรับ Components ที่จัดการ Logic เฉพาะทาง เช่น TaskList)
    ```

#### ส่วนที่ 2: สร้าง Presentational Components

สร้าง Components ที่ทำหน้าที่ "แสดงผล" เพียงอย่างเดียว โดยรับข้อมูลผ่าน `props` (ไม่มี State ของตัวเอง) ในโฟลเดอร์ `src/components/common`

1.  **`TaskCard.js`:**
    * เป็น Component ที่แสดงข้อมูลของงาน 1 ชิ้น
    * รับ `props`: `title` และ `description`
    * **ตัวอย่าง:**
        ```jsx
        // src/components/common/TaskCard.js
        const TaskCard = ({ title, description }) => {
          return (
            <div className="task-card">
              <h4>{title}</h4>
              <p>{description}</p>
            </div>
          );
        };
        export default TaskCard;
        ```
2.  **`Button.js`:**
    * Component ปุ่มที่ใช้ซ้ำได้
    * รับ `props`: `label` และ `onClick`

#### ส่วนที่ 3: สร้าง Container Components

สร้าง Components ที่ทำหน้าที่ "จัดการ Logic และ State" แล้วส่งข้อมูลไปยัง Presentational Components ในโฟลเดอร์ `src/components/features`

1.  **`TaskList.js`:**
    * เป็น Component ที่แสดงรายการงาน 1 คอลัมน์ (เช่น "To Do")
    * รับ `props`: `title` (ชื่อรายการ) และ `tasks` (Array ของข้อมูลงาน)
    * ใช้ `useState` เพื่อเก็บข้อมูล `tasks` (ในขั้นนี้ให้ Hardcode ข้อมูลตัวอย่างไว้ก่อน)
    * ใช้เมธอด `.map()` เพื่อวนลูป `tasks` และแสดงผล `TaskCard` Component สำหรับแต่ละงาน

2.  **`TaskBoard.js`:**
    * เป็น Component หลักที่รวบรวม `TaskList` ทั้งหมดไว้ด้วยกัน
    * สร้างข้อมูลตัวอย่าง (Mock Data) สำหรับทั้ง 3 รายการ (To Do, In Progress, Done)
    * แสดงผล `TaskList` Component 3 ครั้ง โดยส่ง `title` และ `tasks` ที่แตกต่างกันไปให้แต่ละรายการ

#### ส่วนที่ 4: ประกอบร่างใน `App.js`

* ในไฟล์ `App.js` ให้นำ `TaskBoard` Component ที่สร้างขึ้นมาแสดงผล

---

### ✅ ผลลัพธ์ที่คาดหวัง (Expected Outcome)

1.  **GitHub Repository:** Push โค้ดโปรเจกต์ React ทั้งหมดขึ้นบน GitHub Repository ของกลุ่ม
2.  **แอปพลิเคชันที่ทำงานได้:** เมื่อรันโปรเจกต์ (`npm start`) จะต้องเห็นหน้าเว็บที่แสดง Task Board ซึ่งมี 3 คอลัมน์ และมีการ์ดงานที่มาจากข้อมูล Hardcoded แสดงผลถูกต้องตามที่ออกแบบใน Wireframe

---

### 💡 คำแนะนำ (Tips)

* **ข้อมูลสมมติคือเพื่อนของคุณ:** ใน Lab นี้ เราเน้นที่โครงสร้าง UI ยังไม่ต้องกังวลเรื่องการต่อ API หรือการจัดการ State ที่ซับซ้อน ให้ใช้ข้อมูล Array และ Object ธรรมดาไปก่อน
* **Props คือช่องทางการสื่อสาร:** คิดเสมอว่า Container Component จะส่งข้อมูลอะไรให้ Presentational Component ผ่าน `props` บ้าง
* **ทำทีละส่วน:** สร้าง `TaskCard` ให้เสร็จและดูดีก่อน แล้วค่อยสร้าง `TaskList` มาครอบ หลังจากนั้นค่อยนำทั้งหมดไปรวมใน `TaskBoard`