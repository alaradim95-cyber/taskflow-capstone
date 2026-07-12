package com.example.taskflow.task.dto;

import com.example.taskflow.task.model.TaskPriority;
import com.example.taskflow.task.model.TaskStatus;

import java.time.Instant;
import java.time.LocalDate;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        String assignee,
        LocalDate dueDate,
        Instant createdAt,
        Instant updatedAt
) {
}
