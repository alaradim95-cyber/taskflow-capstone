package com.example.taskflow.task.dto;

import com.example.taskflow.task.model.TaskPriority;
import com.example.taskflow.task.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateTaskRequest(
        @NotBlank(message = "title is required")
        @Size(max = 120, message = "title must be 120 characters or fewer")
        String title,

        @Size(max = 1000, message = "description must be 1000 characters or fewer")
        String description,

        @NotNull(message = "status is required")
        TaskStatus status,

        @NotNull(message = "priority is required")
        TaskPriority priority,

        @Size(max = 100, message = "assignee must be 100 characters or fewer")
        String assignee,

        LocalDate dueDate
) {
}
