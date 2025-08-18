# LAB1: Portfolio Website Development
## HTML5 & CSS3 Fundamentals

### 🎯 Lab Objectives
- เข้าใจโครงสร้างและ Semantic HTML5
- ใช้งาน CSS3 สำหรับ Layout และ Styling
- สร้าง Responsive Design
- ฝึกการใช้งาน Git สำหรับ Version Control
- ทำงานร่วมกันเป็นคู่ (Pair Programming)

### ⏰ Time Allocation
- **Total Time:** 3 hours
- **Part 1:** 1.5 hours (Individual - Following Template)
- **Part 2:** 1.5 hours (Pair Work - Adding Features)

---

## 📋 Prerequisites
- VS Code หรือ Text Editor
- Git และ GitHub Account
- Live Server Extension (สำหรับ VS Code)
- Basic understanding of HTML และ CSS

---

## 🔧 Part 1: Template Implementation (1.5 ชั่วโมง)

* นักศึกษาเรียนรู้จากการทำตามแบบอย่างที่ละเอียด
* ครอบคลุม HTML5 semantic structure, CSS3 modern features, responsive design
* มีการใช้งาน Git เบื้องต้น
* สร้างเว็บไซต์ Portfolio ที่สมบูรณ์

### **Step 1: Project Setup (15 minutes)**

1. **สร้าง Repository:**
   ```bash
   # สร้าง directory
   mkdir portfolio-website
   cd portfolio-website
   
   # Initialize git
   git init
   
   # สร้าง basic files
   touch index.html style.css script.js
   ```

2. **โครงสร้าง Files:**
   ```
   portfolio-website/
   ├── index.html
   ├── css/
   │   └── style.css
   ├── js/
   │   └── script.js
   ├── images/
   │   └── (profile pictures, project images)
   └── README.md
   ```

### **Step 2: HTML Structure (45 minutes)**

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Name - Portfolio</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="#home">Portfolio</a>
            </div>
            <ul class="nav-menu">
                <li><a href="#home" class="nav-link">Home</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#skills" class="nav-link">Skills</a></li>
                <li><a href="#projects" class="nav-link">Projects</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="nav-toggle">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-content">
            <h1>Hello, I'm <span class="highlight">Your Name</span></h1>
            <p class="hero-subtitle">Full Stack Developer</p>
            <p class="hero-description">I create beautiful and functional web applications</p>
            <div class="hero-buttons">
                <a href="#projects" class="btn btn-primary">View My Work</a>
                <a href="#contact" class="btn btn-secondary">Get In Touch</a>
            </div>
        </div>
        <div class="hero-image">
            <img src="images/profile.jpg" alt="Profile Picture">
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>I am a passionate Full Stack Developer with experience in creating web applications using modern technologies. I love solving complex problems and learning new technologies.</p>
                    <div class="about-stats">
                        <div class="stat-item">
                            <h3>2+</h3>
                            <p>Years Experience</p>
                        </div>
                        <div class="stat-item">
                            <h3>15+</h3>
                            <p>Projects Completed</p>
                        </div>
                        <div class="stat-item">
                            <h3>10+</h3>
                            <p>Happy Clients</p>
                        </div>
                    </div>
                </div>
                <div class="about-image">
                    <img src="images/about.jpg" alt="About Image">
                </div>
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="skills">
        <div class="container">
            <h2 class="section-title">My Skills</h2>
            <div class="skills-grid">
                <div class="skill-item">
                    <i class="fab fa-html5"></i>
                    <h3>HTML5</h3>
                    <p>Semantic markup and modern HTML5 features</p>
                </div>
                <div class="skill-item">
                    <i class="fab fa-css3-alt"></i>
                    <h3>CSS3</h3>
                    <p>Responsive design and modern CSS techniques</p>
                </div>
                <div class="skill-item">
                    <i class="fab fa-js-square"></i>
                    <h3>JavaScript</h3>
                    <p>ES6+ features and modern JavaScript</p>
                </div>
                <div class="skill-item">
                    <i class="fab fa-react"></i>
                    <h3>React</h3>
                    <p>Component-based UI development</p>
                </div>
                <div class="skill-item">
                    <i class="fab fa-node-js"></i>
                    <h3>Node.js</h3>
                    <p>Server-side JavaScript development</p>
                </div>
                <div class="skill-item">
                    <i class="fas fa-database"></i>
                    <h3>MongoDB</h3>
                    <p>NoSQL database management</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title">My Projects</h2>
            <div class="projects-grid">
                <div class="project-card">
                    <img src="images/project1.jpg" alt="Project 1">
                    <div class="project-info">
                        <h3>E-commerce Website</h3>
                        <p>A full-stack e-commerce solution built with React and Node.js</p>
                        <div class="project-links">
                            <a href="#" class="btn btn-small">Live Demo</a>
                            <a href="#" class="btn btn-small btn-secondary">GitHub</a>
                        </div>
                    </div>
                </div>
                <div class="project-card">
                    <img src="images/project2.jpg" alt="Project 2">
                    <div class="project-info">
                        <h3>Task Management App</h3>
                        <p>A collaborative task management application with real-time updates</p>
                        <div class="project-links">
                            <a href="#" class="btn btn-small">Live Demo</a>
                            <a href="#" class="btn btn-small btn-secondary">GitHub</a>
                        </div>
                    </div>
                </div>
                <div class="project-card">
                    <img src="images/project3.jpg" alt="Project 3">
                    <div class="project-info">
                        <h3>Weather App</h3>
                        <p>A responsive weather application with location-based forecasts</p>
                        <div class="project-links">
                            <a href="#" class="btn btn-small">Live Demo</a>
                            <a href="#" class="btn btn-small btn-secondary">GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <h3>Let's work together</h3>
                    <p>I'm always interested in hearing about new projects and opportunities.</p>
                    <div class="contact-details">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>your.email@example.com</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>+66 12 345 6789</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Bangkok, Thailand</span>
                        </div>
                    </div>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-github"></i></a>
                        <a href="#"><i class="fab fa-linkedin"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
                <form class="contact-form">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Your Email" required>
                    </div>
                    <div class="form-group">
                        <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Your Name. All rights reserved.</p>
        </div>
    </footer>

    <script src="js/script.js"></script>
</body>
</html>
```

### **Step 3: CSS Styling (45 minutes)**

**css/style.css:**
```css
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
    color: #333;
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 1rem 0;
    transition: all 0.3s ease;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo a {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    text-decoration: none;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: #3498db;
}

.nav-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
}

.bar {
    width: 25px;
    height: 3px;
    background: #333;
    margin: 3px 0;
    transition: 0.3s;
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 100px 20px 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.hero-content {
    flex: 1;
    max-width: 600px;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.highlight {
    color: #f39c12;
}

.hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    opacity: 0.9;
}

.hero-description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.8;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn {
    padding: 12px 30px;
    text-decoration: none;
    border-radius: 5px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-block;
    text-align: center;
}

.btn-primary {
    background: #3498db;
    color: white;
}

.btn-primary:hover {
    background: #2980b9;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #333;
}

.hero-image {
    flex: 1;
    text-align: center;
}

.hero-image img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid rgba(255, 255, 255, 0.2);
}

/* Section Styles */
.section-title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: #2c3e50;
}

/* About Section */
.about {
    padding: 100px 0;
    background: #f8f9fa;
}

.about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
}

.about-text p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: #666;
}

.about-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.stat-item {
    text-align: center;
}

.stat-item h3 {
    font-size: 2rem;
    color: #3498db;
    margin-bottom: 0.5rem;
}

.about-image img {
    width: 100%;
    border-radius: 10px;
}

/* Skills Section */
.skills {
    padding: 100px 0;
}

.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.skill-item {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.skill-item:hover {
    transform: translateY(-5px);
}

.skill-item i {
    font-size: 3rem;
    color: #3498db;
    margin-bottom: 1rem;
}

.skill-item h3 {
    margin-bottom: 1rem;
    color: #2c3e50;
}

/* Projects Section */
.projects {
    padding: 100px 0;
    background: #f8f9fa;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
}

.project-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.project-card:hover {
    transform: translateY(-5px);
}

.project-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.project-info {
    padding: 1.5rem;
}

.project-info h3 {
    margin-bottom: 1rem;
    color: #2c3e50;
}

.project-info p {
    color: #666;
    margin-bottom: 1.5rem;
}

.project-links {
    display: flex;
    gap: 1rem;
}

.btn-small {
    padding: 8px 20px;
    font-size: 0.9rem;
}

/* Contact Section */
.contact {
    padding: 100px 0;
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
}

.contact-info h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.contact-info p {
    color: #666;
    margin-bottom: 2rem;
}

.contact-details {
    margin-bottom: 2rem;
}

.contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.contact-item i {
    font-size: 1.2rem;
    color: #3498db;
    margin-right: 1rem;
    width: 20px;
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #3498db;
    color: white;
    border-radius: 50%;
    text-decoration: none;
    transition: background 0.3s ease;
}

.social-links a:hover {
    background: #2980b9;
}

/* Contact Form */
.contact-form {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 10px;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3498db;
}

/* Footer */
.footer {
    background: #2c3e50;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        left: -100%;
        top: 70px;
        flex-direction: column;
        background-color: white;
        width: 100%;
        text-align: center;
        transition: 0.3s;
        box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
        padding: 2rem 0;
    }

    .nav-menu.active {
        left: 0;
    }

    .nav-toggle {
        display: flex;
    }

    .nav-toggle.active .bar:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }

    .nav-toggle.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }

    .hero {
        flex-direction: column-reverse;
        text-align: center;
        padding: 120px 20px 50px;
    }

    .hero h1 {
        font-size: 2rem;
    }

    .hero-image {
        margin-bottom: 2rem;
    }

    .hero-image img {
        width: 200px;
        height: 200px;
    }

    .about-content {
        grid-template-columns: 1fr;
    }

    .about-stats {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .skills-grid {
        grid-template-columns: 1fr;
    }

    .projects-grid {
        grid-template-columns: 1fr;
    }

    .contact-content {
        grid-template-columns: 1fr;
    }

    .hero-buttons {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .hero h1 {
        font-size: 1.8rem;
    }

    .section-title {
        font-size: 2rem;
    }

    .about-stats {
        grid-template-columns: 1fr;
    }

    .project-links {
        flex-direction: column;
    }
}
```

### **Step 4: Basic JavaScript (15 minutes)**

**js/script.js:**
```javascript
// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (name && email && message) {
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    } else {
        alert('Please fill in all fields.');
    }
});
```

### **Step 5: Git Commands (15 minutes)**

```bash
# Add files to git
git add .

# Commit initial version
git commit -m "Initial portfolio website structure"

# Create GitHub repository and push
git branch -M main
git remote add origin https://github.com/username/portfolio-website.git
git push -u origin main
```

---

## 🚀 Part 2: Pair Programming Features  (1.5 ชั่วโมง)

### **นักศึกษา 2 คนทำงานร่วมกันและแบ่งหน้าที่ Feature Distribution:**

### **นักศึกษา A:(45 minutes):**

1. **Dark Mode Toggle - เปลี่ยนธีมเว็บไซต์**
2. **Loading Animation - หน้าจอโหลดแบบมืออาชีพ**
3. **Scroll Progress Indicator - แสดงความคืบหน้าการเลื่อนหน้า**

### **นักศึกษา B: (45 minutes):**

1. **Project Filter System - กรองโปรเจกต์ตามหมวดหมู่**
2. **Typing Animation - เอฟเฟกต์พิมพ์ข้อความในส่วน Hero**
3. **Back to Top Button - ปุ่มกลับไปด้านบน**

### ✨ จุดเด่นของ Lab นี้:

1. เรียนรู้แบบค่อยเป็นค่อยไป - Part 1 สอนพื้นฐาน, Part 2 ต่อยอด
2. ใช้เทคโนโลยีทันสมัย - Modern CSS, ES6+ JavaScript, Git workflow
3. ฝึกการทำงานเป็นทีม - Pair programming และ Git collaboration
4. ผลงานที่ใช้งานได้จริง - Portfolio website ที่สามารถนำไปใช้ได้
5. ครอบคลุมทักษะที่จำเป็น - HTML5, CSS3, JavaScript, Git, Responsive Design

### **นักศึกษา A Implementation:**

#### **1. Dark Mode Toggle (15 minutes)**

**Add to HTML (in navbar):**
```html
<div class="theme-toggle">
    <i class="fas fa-moon" id="theme-icon"></i>
</div>
```

**Add to CSS:**
```css
/* Dark Mode Styles */
[data-theme="dark"] {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --card-bg: #2d2d2d;
    --section-bg: #262626;
}

[data-theme="light"] {
    --bg-color: #ffffff;
    --text-color: #333333;
    --card-bg: #ffffff;
    --section-bg: #f8f9fa;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
}

.theme-toggle {
    cursor: pointer;
    font-size: 1.2rem;
    color: #333;
    transition: color 0.3s ease;
}

.theme-toggle:hover {
    color: #3498db;
}

/* Update other elements to use CSS variables */
.skill-item, .project-card, .contact-form {
    background: var(--card-bg);
}

.about, .projects {
    background: var(--section-bg);
}
```

**Add to JavaScript:**
```javascript
// Dark Mode Toggle
const themeToggle = document.getElementById('theme-icon');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}
```

#### **2. Loading Animation (15 minutes)**

**Add to HTML (at the beginning of body):**
```html
<div class="loader">
    <div class="loader-content">
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>
</div>
```

**Add to CSS:**
```css
/* Loading Animation */
.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
}

.loader-content {
    text-align: center;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loader.fade-out {
    opacity: 0;
    pointer-events: none;
}
```

**Add to JavaScript:**
```javascript
// Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
});
```

#### **3. Scroll Progress Indicator (15 minutes)**

**Add to HTML (after navbar):**
```html
<div class="scroll-progress">
    <div class="progress-bar"></div>
</div>
```

**Add to CSS:**
```css
/* Scroll Progress Indicator */
.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    z-index: 1001;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #f39c12);
    width: 0%;
    transition: width 0.1s ease;
}
```

**Add to JavaScript:**
```javascript
// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    document.querySelector('.progress-bar').style.width = scrollPercent + '%';
});
```

### **นักศึกษา B Implementation:**

#### **1. Project Filter System (15 minutes)**

**Update Projects HTML:**
```html
<section id="projects" class="projects">
    <div class="container">
        <h2 class="section-title">My Projects</h2>
        
        <!-- Filter Buttons -->
        <div class="filter-buttons">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="web">Web Apps</button>
            <button class="filter-btn" data-filter="mobile">Mobile</button>
            <button class="filter-btn" data-filter="ui">UI/UX</button>
        </div>
        
        <div class="projects-grid">
            <div class="project-card" data-category="web">
                <!-- Project content -->
            </div>
            <div class="project-card" data-category="mobile">
                <!-- Project content -->
            </div>
            <div class="project-card" data-category="ui">
                <!-- Project content -->
            </div>
        </div>
    </div>
</section>
```

**Add to CSS:**
```css
/* Project Filter */
.filter-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 10px 20px;
    border: none;
    background: transparent;
    color: #666;
    cursor: pointer;
    border-radius: 25px;
    transition: all 0.3s ease;
    font-weight: 500;
}

.filter-btn.active,
.filter-btn:hover {
    background: #3498db;
    color: white;
}

.project-card.hide {
    display: none;
}
```

**Add to JavaScript:**
```javascript
// Project Filter System
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    });
});
```

#### **2. Typing Animation for Hero (15 minutes)**

**Update Hero HTML:**
```html
<h1>Hello, I'm <span class="highlight">Your Name</span></h1>
<p class="hero-subtitle">
    <span id="typing-text"></span>
    <span class="cursor">|</span>
</p>
```

**Add to CSS:**
```css
/* Typing Animation */
.cursor {
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}
```

**Add to JavaScript:**
```javascript
// Typing Animation
const typingText = document.getElementById('typing-text');
const textArray = ['Full Stack Developer', 'React Specialist', 'Node.js Expert', 'UI/UX Enthusiast'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentText = textArray[textIndex];
    
    if (!isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeWriter, 2000);
            return;
        }
    } else {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
        }
    }
    
    setTimeout(typeWriter, isDeleting ? 50 : 150);
}

// Start typing animation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeWriter, 1000);
});
```

#### **3. Back to Top Button (15 minutes)**

**Add to HTML:**
```html
<button class="back-to-top" id="backToTop">
    <i class="fas fa-arrow-up"></i>
</button>
```

**Add to CSS:**
```css
/* Back to Top Button */
.back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
}

.back-to-top.show {
    opacity: 1;
    visibility: visible;
}

.back-to-top:hover {
    background: #2980b9;
    transform: translateY(-2px);
}
```

**Add to JavaScript:**
```javascript
// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
```

---

## 📋 Final Integration & Testing (30 minutes)

### **Step 1: Code Review (10 minutes)**
- นักศึกษาทั้งสองคนรวม code เข้าด้วยกัน
- ตรวจสอบความถูกต้องของ syntax
- ทดสอบ responsive design

### **Step 2: Git Collaboration (10 minutes)**
```bash
# Student A pushes their features
git add .
git commit -m "Add dark mode, loading animation, and scroll progress"
git push origin main

# Student B pulls and merges
git pull origin main
git add .
git commit -m "Add project filter, typing animation, and back to top"
git push origin main
```

### **Step 3: Final Testing (10 minutes)**
- ทดสอบทุก features ที่เพิ่มเข้ามา
- ตรวจสอบ responsive design บนหน้าจอขนาดต่างๆ
- ทดสอบ cross-browser compatibility

---

## 🎯 Assessment Criteria

### **Part 1: Template Implementation (50%)**
- ความถูกต้องของ HTML structure (15%)
- การใช้งาน CSS และ responsive design (20%)
- การใช้งาน JavaScript (10%)
- การใช้งาน Git อย่างถูกต้อง (5%)

### **Part 2: Feature Implementation (50%)**
- ความถูกต้องของ features ที่เพิ่ม (30%)
- Code quality และ organization (10%)
- การทำงานร่วมกันเป็นทีม (10%)

---

## 📚 Learning Resources

### **HTML5 & CSS3:**
- [MDN Web Docs - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN Web Docs - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### **JavaScript:**
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)

### **Git & GitHub:**
- [Pro Git Book](https://git-scm.com/book)
- [GitHub Guides](https://guides.github.com/)

---

## 🔍 Troubleshooting

### **Common Issues:**
1. **Images not loading:** ตรวจสอบ path และ file names
2. **CSS not applying:** ตรวจสอบ link tag และ CSS syntax
3. **JavaScript errors:** ใช้ browser developer tools
4. **Git conflicts:** ใช้ git status และ git diff

### **Tips:**
- ใช้ Live Server extension ใน VS Code
- ตรวจสอบ console ใน browser developer tools
- ใช้ Git กระซิบๆ ตั้งแต่เริ่มต้น
- Comment code อย่างชัดเจน

---

## 📝 Submission Requirements

1. **GitHub Repository** พร้อม complete source code
2. **README.md** อธิบายโครงการและวิธีการใช้งาน
3. **Live Demo** (deploy ไปยัง GitHub Pages หรือ Netlify)
4. **Documentation** ของ features ที่เพิ่มเข้ามา
5. **Reflection Report** (1-2 หน้า) เกี่ยวกับสิ่งที่เรียนรู้

**Due Date:** สิ้นสุด Week 3