package com.example.taskflow.task.service;

import com.example.taskflow.task.dto.CreateTaskRequest;
import com.example.taskflow.task.dto.TaskResponse;
import com.example.taskflow.task.dto.UpdateTaskRequest;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request);

    List<TaskResponse> getAllTasks();

    TaskResponse getTaskById(Long id);

    TaskResponse updateTask(Long id, UpdateTaskRequest request);

    void deleteTask(Long id);
}
