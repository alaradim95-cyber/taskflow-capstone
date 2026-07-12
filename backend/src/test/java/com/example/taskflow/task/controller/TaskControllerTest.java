package com.example.taskflow.task.controller;

import com.example.taskflow.task.dto.TaskResponse;
import com.example.taskflow.task.exception.TaskNotFoundException;
import com.example.taskflow.task.model.TaskPriority;
import com.example.taskflow.task.model.TaskStatus;
import com.example.taskflow.task.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Test
    void createTaskReturnsCreatedResponseAndLocation() throws Exception {
        when(taskService.createTask(any())).thenReturn(response(1L, "Build TaskFlow"));

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Build TaskFlow",
                                  "description": "Finish the backend",
                                  "priority": "HIGH",
                                  "assignee": "Momo",
                                  "dueDate": "2026-07-20"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/tasks/1"))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("TODO"));
    }

    @Test
    void createTaskReturnsStructuredValidationErrorForBlankTitle() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "   "}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.title").value("title is required"));
    }

    @Test
    void getTaskReturnsNotFoundErrorWhenServiceCannotFindTask() throws Exception {
        when(taskService.getTaskById(44L)).thenThrow(new TaskNotFoundException(44L));

        mockMvc.perform(get("/api/tasks/44"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Task not found with id: 44"))
                .andExpect(jsonPath("$.path").value("/api/tasks/44"));
    }

    @Test
    void updateTaskReturnsUpdatedTask() throws Exception {
        when(taskService.updateTask(any(), any())).thenReturn(response(2L, "Updated"));

        mockMvc.perform(put("/api/tasks/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Updated",
                                  "status": "IN_PROGRESS",
                                  "priority": "HIGH"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.title").value("Updated"));
    }

    @Test
    void deleteTaskReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/tasks/3"))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

        verify(taskService).deleteTask(3L);
    }

    @Test
    void invalidEnumReturnsBadRequestWithoutInternalDetails() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "Task", "priority": "URGENT"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Malformed request or invalid enum value"));
    }

    @Test
    void negativeIdReturnsValidationError() throws Exception {
        doThrow(new AssertionError("service should not be called for invalid id"))
                .when(taskService).getTaskById(-1L);

        mockMvc.perform(get("/api/tasks/-1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    void invalidIdFormatReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/tasks/not-a-number"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid path parameter"));
    }

    private TaskResponse response(Long id, String title) {
        return new TaskResponse(
                id,
                title,
                "Description",
                TaskStatus.TODO,
                TaskPriority.HIGH,
                "Momo",
                LocalDate.of(2026, 7, 20),
                Instant.parse("2026-07-12T10:00:00Z"),
                Instant.parse("2026-07-12T10:00:00Z")
        );
    }
}
