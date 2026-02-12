const taskRepository = require('../repositories/taskRepository');
const Task = require('../models/Task');

class TaskService {
    /**
     * ดึง tasks ทั้งหมดพร้อมตัวกรอง
     */
    async getAllTasks(filters = {}) {
        return await taskRepository.findAll(filters);
    }

    /**
     * ดึง task ตาม ID
     */
    async getTaskById(id) {
        const task = await taskRepository.findById(id);
        
        if (!task) {
            throw new Error(`ไม่พบ task ที่มี ID ${id}`);
        }
        
        return task;
    }

    /**
     * สร้าง task ใหม่พร้อมตรวจสอบกฎทางธุรกิจ
     */
    async createTask(taskData) {
        // สร้าง task model
        const task = new Task(taskData);

        // ตรวจสอบความถูกต้องพื้นฐาน
        const validation = task.isValid();
        if (!validation.valid) {
            throw new Error(`ข้อมูลไม่ถูกต้อง: ${validation.errors.join(', ')}`);
        }

        // กฎทางธุรกิจเพิ่มเติม
        if (task.priority === 'HIGH' && !task.description) {
            throw new Error('งานลำดับความสำคัญสูงต้องมีรายละเอียด');
        }

        // บันทึกลงฐานข้อมูล
        const createdTask = await taskRepository.create(task);
        
        // Business logic: บันทึก log งานสำคัญ
        if (createdTask.priority === 'HIGH') {
            console.log(`🔥 สร้างงานลำดับความสำคัญสูง: ${createdTask.title}`);
        }

        return createdTask;
    }

    /**
     * อัพเดท task พร้อมกฎทางธุรกิจ
     */
    async updateTask(id, updates) {
        // ตรวจสอบว่า task มีอยู่จริง
        const existingTask = await this.getTaskById(id);

        // ตรวจสอบการอัพเดท
        if (updates.title !== undefined) {
            const tempTask = new Task({ ...existingTask, ...updates });
            const validation = tempTask.isValid();
            if (!validation.valid) {
                throw new Error(`ข้อมูลไม่ถูกต้อง: ${validation.errors.join(', ')}`);
            }
        }

        // กฎทางธุรกิจ: ไม่สามารถเปลี่ยนจาก DONE กลับไปเป็น TODO
        if (existingTask.status === 'DONE' && updates.status === 'TODO') {
            throw new Error('ไม่สามารถเปลี่ยนงานที่เสร็จแล้วกลับไปเป็น TODO ได้');
        }

        // กฎทางธุรกิจ: HIGH priority ต้องมี description
        if (updates.priority === 'HIGH' && !existingTask.description && !updates.description) {
            throw new Error('งานลำดับความสำคัญสูงต้องมีรายละเอียด');
        }

        const updatedTask = await taskRepository.update(id, updates);

        // บันทึก log เมื่อเปลี่ยน status
        if (updates.status && updates.status !== existingTask.status) {
            console.log(`📝 เปลี่ยนสถานะ task ${id}: ${existingTask.status} → ${updates.status}`);
        }

        return updatedTask;
    }

    /**
     * ลบ task พร้อมกฎทางธุรกิจ
     */
    async deleteTask(id) {
        // ตรวจสอบว่า task มีอยู่จริง
        const task = await this.getTaskById(id);

        // กฎทางธุรกิจ: บันทึก log เมื่อลบงานสำคัญ
        if (task.priority === 'HIGH') {
            console.log(`⚠️ กำลังลบงานลำดับความสำคัญสูง: ${task.title}`);
        }

        return await taskRepository.delete(id);
    }

    /**
     * ดึงสถิติ tasks
     */
    async getStatistics() {
        const counts = await taskRepository.countByStatus();
        const allTasks = await taskRepository.findAll();

        return {
            total: allTasks.length,
            byStatus: {
                TODO: counts.TODO || 0,
                IN_PROGRESS: counts.IN_PROGRESS || 0,
                DONE: counts.DONE || 0
            },
            byPriority: {
                LOW: allTasks.filter(t => t.priority === 'LOW').length,
                MEDIUM: allTasks.filter(t => t.priority === 'MEDIUM').length,
                HIGH: allTasks.filter(t => t.priority === 'HIGH').length
            }
        };
    }

    /**
     * เลื่อนงานไปสถานะถัดไป
     */
    async moveToNextStatus(id) {
        const task = await this.getTaskById(id);
        
        const statusFlow = {
            'TODO': 'IN_PROGRESS',
            'IN_PROGRESS': 'DONE',
            'DONE': 'DONE'
        };

        const nextStatus = statusFlow[task.status];
        
        if (nextStatus === task.status) {
            throw new Error('งานนี้เสร็จสมบูรณ์แล้ว');
        }

        return await this.updateTask(id, { status: nextStatus });
    }
}

module.exports = new TaskService();