package com.example.taskflow.integration;

import com.example.taskflow.task.dto.TaskResponse;
import com.example.taskflow.task.dto.UpdateTaskRequest;
import com.example.taskflow.task.model.TaskPriority;
import com.example.taskflow.task.model.TaskStatus;
import com.example.taskflow.task.repository.TaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void clearDatabase() {
        taskRepository.deleteAll();
    }

    @Test
    void completeCrudLifecyclePersistsDefaultsUpdatesAndDeletesTask() throws Exception {
        MvcResult createResult = mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Integration task",
                                  "description": "Stored in H2",
                                  "assignee": "Momo",
                                  "dueDate": "2026-07-28"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.priority").value("MEDIUM"))
                .andReturn();

        TaskResponse created = objectMapper.readValue(
                createResult.getResponse().getContentAsByteArray(),
                TaskResponse.class
        );
        assertThat(created.id()).isNotNull();
        assertThat(created.createdAt()).isNotNull();
        assertThat(created.updatedAt()).isNotNull();
        assertThat(taskRepository.count()).isEqualTo(1);

        mockMvc.perform(get("/api/tasks/{id}", created.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Integration task"));

        UpdateTaskRequest update = new UpdateTaskRequest(
                "Integration task complete",
                "Updated through the API",
                TaskStatus.DONE,
                TaskPriority.HIGH,
                "Momo",
                created.dueDate()
        );
        mockMvc.perform(put("/api/tasks/{id}", created.id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.id()))
                .andExpect(jsonPath("$.status").value("DONE"))
                .andExpect(jsonPath("$.priority").value("HIGH"));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(created.id()));

        mockMvc.perform(delete("/api/tasks/{id}", created.id()))
                .andExpect(status().isNoContent());

        assertThat(taskRepository.count()).isZero();
        mockMvc.perform(get("/api/tasks/{id}", created.id()))
                .andExpect(status().isNotFound());
    }
}
