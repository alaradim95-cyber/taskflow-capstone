package com.example.taskflow.task.service;

import com.example.taskflow.task.dto.CreateTaskRequest;
import com.example.taskflow.task.dto.TaskResponse;
import com.example.taskflow.task.dto.UpdateTaskRequest;
import com.example.taskflow.task.exception.TaskNotFoundException;
import com.example.taskflow.task.mapper.TaskMapper;
import com.example.taskflow.task.model.Task;
import com.example.taskflow.task.model.TaskPriority;
import com.example.taskflow.task.model.TaskStatus;
import com.example.taskflow.task.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskServiceImpl taskService;

    @Test
    void createTaskMapsSavesAndReturnsResponse() {
        CreateTaskRequest request = new CreateTaskRequest("Create", null, null, null, null);
        Task unsavedTask = task(null, "Create");
        Task savedTask = task(1L, "Create");
        TaskResponse expected = response(savedTask);
        when(taskMapper.toEntity(request)).thenReturn(unsavedTask);
        when(taskRepository.saveAndFlush(unsavedTask)).thenReturn(savedTask);
        when(taskMapper.toResponse(savedTask)).thenReturn(expected);

        TaskResponse result = taskService.createTask(request);

        assertThat(result).isEqualTo(expected);
        verify(taskRepository).saveAndFlush(unsavedTask);
    }

    @Test
    void getAllTasksRequestsNewestFirstAndMapsResults() {
        Task first = task(2L, "Newest");
        Task second = task(1L, "Older");
        when(taskRepository.findAll(any(Sort.class))).thenReturn(List.of(first, second));
        when(taskMapper.toResponse(first)).thenReturn(response(first));
        when(taskMapper.toResponse(second)).thenReturn(response(second));

        List<TaskResponse> result = taskService.getAllTasks();

        assertThat(result).extracting(TaskResponse::id).containsExactly(2L, 1L);
        verify(taskRepository).findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Test
    void getTaskByIdReturnsMappedTask() {
        Task task = task(4L, "Read");
        when(taskRepository.findById(4L)).thenReturn(Optional.of(task));
        when(taskMapper.toResponse(task)).thenReturn(response(task));

        TaskResponse result = taskService.getTaskById(4L);

        assertThat(result.id()).isEqualTo(4L);
    }

    @Test
    void getTaskByIdThrowsWhenTaskIsMissing() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(99L))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessage("Task not found with id: 99");
    }

    @Test
    void updateTaskUpdatesExistingEntityAndReturnsResponse() {
        Task task = task(5L, "Old");
        UpdateTaskRequest request = new UpdateTaskRequest(
                "New",
                null,
                TaskStatus.IN_PROGRESS,
                TaskPriority.HIGH,
                null,
                null
        );
        when(taskRepository.findById(5L)).thenReturn(Optional.of(task));
        when(taskRepository.saveAndFlush(task)).thenReturn(task);
        when(taskMapper.toResponse(task)).thenReturn(response(task));

        TaskResponse result = taskService.updateTask(5L, request);

        assertThat(result.id()).isEqualTo(5L);
        verify(taskMapper).updateEntity(task, request);
        verify(taskRepository).saveAndFlush(task);
    }

    @Test
    void updateTaskDoesNotSaveWhenTaskIsMissing() {
        UpdateTaskRequest request = new UpdateTaskRequest(
                "New",
                null,
                TaskStatus.IN_PROGRESS,
                TaskPriority.HIGH,
                null,
                null
        );
        when(taskRepository.findById(8L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(8L, request))
                .isInstanceOf(TaskNotFoundException.class);
        verify(taskRepository, never()).saveAndFlush(any(Task.class));
    }

    @Test
    void deleteTaskDeletesExistingTask() {
        Task task = task(6L, "Delete");
        when(taskRepository.findById(6L)).thenReturn(Optional.of(task));

        taskService.deleteTask(6L);

        verify(taskRepository).delete(task);
    }

    @Test
    void deleteTaskDoesNotDeleteWhenTaskIsMissing() {
        when(taskRepository.findById(7L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.deleteTask(7L))
                .isInstanceOf(TaskNotFoundException.class);
        verify(taskRepository, never()).delete(any(Task.class));
    }

    private Task task(Long id, String title) {
        Task task = new Task();
        task.setId(id);
        task.setTitle(title);
        task.setStatus(TaskStatus.TODO);
        task.setPriority(TaskPriority.MEDIUM);
        task.setCreatedAt(Instant.parse("2026-07-12T10:00:00Z"));
        task.setUpdatedAt(Instant.parse("2026-07-12T10:00:00Z"));
        return task;
    }

    private TaskResponse response(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getAssignee(),
                LocalDate.of(2026, 7, 20),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
