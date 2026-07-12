package com.example.taskflow.task.dto;

import com.example.taskflow.task.model.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateTaskRequest(
        @NotBlank(message = "title is required")
        @Size(max = 120, message = "title must be 120 characters or fewer")
        String title,

        @Size(max = 1000, message = "description must be 1000 characters or fewer")
        String description,

        TaskPriority priority,

        @Size(max = 100, message = "assignee must be 100 characters or fewer")
        String assignee,

        LocalDate dueDate
) {
}
