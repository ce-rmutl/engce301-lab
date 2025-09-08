// src/App.jsx - อัพเดทเพื่อใช้ Welcome component
import { useState } from 'react'
import Welcome from './components/Welcome'
import StudentCard from './components/StudentCard'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎉 React Components Demo</h1>
        
        {/* ใช้ Component พร้อม Props */}
        <Welcome 
          name="ธนิต เกตุแก้ว" 
          age={20} 
          university="มหาวิทยาลัยเทคโนโลยี"
        />
        
        <Welcome 
          name="สมหญิง รักเรียน" 
          age={19} 
          university="มหาวิทยาลัยเทคโนโลยี"
        />

        <StudentCard 
          student={{
            id: "S002",
            name: "สมหญิง รักเรียน",
            major: "วิทยาการคอมพิวเตอร์",
            year: 2,
            gpa: 3.8,
            photo: "https://picsum.photos/id/237/200/300",
            hobbies: ["อ่านหนังสือ", "เล่นเกม", "ดูหนัง"]
          }}
        />


      </header>
    </div>
  )
}

export default App