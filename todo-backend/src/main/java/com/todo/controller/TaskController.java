package com.todo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todo.entities.Task;
import com.todo.repository.TaskRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

	@Autowired
 private final TaskRepository taskRepo;

 public TaskController(TaskRepository taskRepo) {
     this.taskRepo = taskRepo;
 }

 @GetMapping
 public List<Task> getAllTasks() {
     return taskRepo.findAll();
 }

 @PostMapping
 public Task addTask(@RequestBody Task task) {
     return taskRepo.save(task);
 }

 @PutMapping("/{id}")
 public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
     Optional<Task> task = taskRepo.findById(id);
     if (task.isPresent()) {
         Task t = task.get();
         t.setTitle(updatedTask.getTitle());
         t.setCompleted(updatedTask.isCompleted());
         return taskRepo.save(t);
     }
     return null;
 }

 @DeleteMapping("/{id}")
 public void deleteTask(@PathVariable Long id) {
     taskRepo.deleteById(id);
 }
}
