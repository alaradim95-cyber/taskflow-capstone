package com.example.taskflow.task.mapper;

import com.example.taskflow.task.dto.CreateTaskRequest;
import com.example.taskflow.task.dto.TaskResponse;
import com.example.taskflow.task.dto.UpdateTaskRequest;
import com.example.taskflow.task.model.Task;
import com.example.taskflow.task.model.TaskPriority;
import com.example.taskflow.task.model.TaskStatus;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class TaskMapperTest {

    private final TaskMapper taskMapper = new TaskMapper();

    @Test
    void toEntityAppliesDefaultsAndNormalizesOptionalText() {
        CreateTaskRequest request = new CreateTaskRequest(
                "  Finish API  ",
                "   ",
                null,
                "  Momo  ",
                LocalDate.of(2026, 7, 20)
        );

        Task task = taskMapper.toEntity(request);

        assertThat(task.getTitle()).isEqualTo("Finish API");
        assertThat(task.getDescription()).isNull();
        assertThat(task.getStatus()).isEqualTo(TaskStatus.TODO);
        assertThat(task.getPriority()).isEqualTo(TaskPriority.MEDIUM);
        assertThat(task.getAssignee()).isEqualTo("Momo");
        assertThat(task.getDueDate()).isEqualTo(LocalDate.of(2026, 7, 20));
    }

    @Test
    void updateEntityChangesMutableFieldsAndPreservesIdentityAndCreatedAt() {
        Instant createdAt = Instant.parse("2026-07-12T10:00:00Z");
        Task task = task(7L, "Old", TaskStatus.TODO, TaskPriority.LOW, createdAt);
        UpdateTaskRequest request = new UpdateTaskRequest(
                "  Updated task  ",
                "  Updated description  ",
                TaskStatus.IN_PROGRESS,
                TaskPriority.HIGH,
                "  Alex  ",
                LocalDate.of(2026, 7, 25)
        );

        taskMapper.updateEntity(task, request);

        assertThat(task.getId()).isEqualTo(7L);
        assertThat(task.getCreatedAt()).isEqualTo(createdAt);
        assertThat(task.getTitle()).isEqualTo("Updated task");
        assertThat(task.getDescription()).isEqualTo("Updated description");
        assertThat(task.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        assertThat(task.getPriority()).isEqualTo(TaskPriority.HIGH);
        assertThat(task.getAssignee()).isEqualTo("Alex");
        assertThat(task.getDueDate()).isEqualTo(LocalDate.of(2026, 7, 25));
    }

    @Test
    void toResponseCopiesEveryExposedField() {
        Instant createdAt = Instant.parse("2026-07-12T10:00:00Z");
        Instant updatedAt = Instant.parse("2026-07-12T11:00:00Z");
        Task task = task(3L, "Test mapper", TaskStatus.DONE, TaskPriority.HIGH, createdAt);
        task.setDescription("Description");
        task.setAssignee("Momo");
        task.setDueDate(LocalDate.of(2026, 7, 18));
        task.setUpdatedAt(updatedAt);

        TaskResponse response = taskMapper.toResponse(task);

        assertThat(response).isEqualTo(new TaskResponse(
                3L,
                "Test mapper",
                "Description",
                TaskStatus.DONE,
                TaskPriority.HIGH,
                "Momo",
                LocalDate.of(2026, 7, 18),
                createdAt,
                updatedAt
        ));
    }

    private Task task(
            Long id,
            String title,
            TaskStatus status,
            TaskPriority priority,
            Instant createdAt
    ) {
        Task task = new Task();
        task.setId(id);
        task.setTitle(title);
        task.setStatus(status);
        task.setPriority(priority);
        task.setCreatedAt(createdAt);
        task.setUpdatedAt(createdAt);
        return task;
    }
}
