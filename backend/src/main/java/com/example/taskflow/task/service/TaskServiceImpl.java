package com.example.taskflow.task.service;

import com.example.taskflow.task.dto.CreateTaskRequest;
import com.example.taskflow.task.dto.TaskResponse;
import com.example.taskflow.task.dto.UpdateTaskRequest;
import com.example.taskflow.task.exception.TaskNotFoundException;
import com.example.taskflow.task.mapper.TaskMapper;
import com.example.taskflow.task.model.Task;
import com.example.taskflow.task.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TaskServiceImpl implements TaskService {

    private static final Logger log = LoggerFactory.getLogger(TaskServiceImpl.class);

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        Task savedTask = taskRepository.saveAndFlush(taskMapper.toEntity(request));
        log.info("Created task id={}", savedTask.getId());
        return taskMapper.toResponse(savedTask);
    }

    @Override
    public List<TaskResponse> getAllTasks() {
        List<TaskResponse> tasks = taskRepository
                .findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(taskMapper::toResponse)
                .toList();
        log.debug("Retrieved {} tasks", tasks.size());
        return tasks;
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        return taskMapper.toResponse(findTask(id));
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, UpdateTaskRequest request) {
        Task task = findTask(id);
        taskMapper.updateEntity(task, request);
        Task savedTask = taskRepository.saveAndFlush(task);
        log.info("Updated task id={}", savedTask.getId());
        return taskMapper.toResponse(savedTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        Task task = findTask(id);
        taskRepository.delete(task);
        log.info("Deleted task id={}", id);
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> {
            log.warn("Task not found id={}", id);
            return new TaskNotFoundException(id);
        });
    }
}
