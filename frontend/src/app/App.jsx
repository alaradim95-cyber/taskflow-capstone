import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import NotFoundPage from '../pages/NotFoundPage'
import TaskCreatePage from '../pages/TaskCreatePage'
import TaskDetailPage from '../pages/TaskDetailPage'
import TaskEditPage from '../pages/TaskEditPage'
import TaskListPage from '../pages/TaskListPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/tasks" replace />} />
        <Route path="tasks" element={<TaskListPage />} />
        <Route path="tasks/new" element={<TaskCreatePage />} />
        <Route path="tasks/:id" element={<TaskDetailPage />} />
        <Route path="tasks/:id/edit" element={<TaskEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
