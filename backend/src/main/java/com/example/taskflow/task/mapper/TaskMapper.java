package com.example.taskflow.task.mapper;

import com.example.taskflow.task.dto.CreateTaskRequest;
import com.example.taskflow.task.dto.TaskResponse;
import com.example.taskflow.task.dto.UpdateTaskRequest;
import com.example.taskflow.task.model.Task;
import com.example.taskflow.task.model.TaskPriority;
import com.example.taskflow.task.model.TaskStatus;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public Task toEntity(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.title().trim());
        task.setDescription(normalizeNullable(request.description()));
        task.setStatus(TaskStatus.TODO);
        task.setPriority(request.priority() == null ? TaskPriority.MEDIUM : request.priority());
        task.setAssignee(normalizeNullable(request.assignee()));
        task.setDueDate(request.dueDate());
        return task;
    }

    public void updateEntity(Task task, UpdateTaskRequest request) {
        task.setTitle(request.title().trim());
        task.setDescription(normalizeNullable(request.description()));
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setAssignee(normalizeNullable(request.assignee()));
        task.setDueDate(request.dueDate());
    }

    public TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getAssignee(),
                task.getDueDate(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
