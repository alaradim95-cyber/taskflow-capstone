# TaskFlow demo script

Target length: 3-5 minutes. Run this once from a fresh clone before recording or presenting.

## 1. Preflight

1. Confirm Docker Desktop is running.
2. Confirm no real credentials are present in tracked files.
3. Copy `.env.example` to `.env` and replace the local placeholder password.
4. From the repository root, run:

   ```text
   docker compose up --build -d --wait
   ```

5. Confirm every default service is healthy:

   ```text
   docker compose ps
   ```

If startup fails, use `docker compose logs --no-color` and resolve the issue before the demo.

## 2. Product walkthrough

Open <http://localhost:3000>.

Use this exact verified sequence:

1. On the task list, select **Create task**.
2. Create a task named **Prepare TaskFlow demo** with:
   - description: **Record the portfolio walkthrough**
   - priority: **High**
   - assignee: **Momo**
   - due date: **29 July 2026**
3. Submit with **Create task** and show the new task's detail page.
4. Select **Edit task**, change **Status** to **In progress**, and submit with **Save changes**.
5. Refresh the detail page and show that PostgreSQL retained the updated status.
6. Return to the task list. Demonstrate **Search tasks**, then the **Status** and **Priority** filters.
7. Clear the filters, reopen the demo task, select **Delete**, and confirm **Delete this task permanently?**
8. Show that the task is removed from the list.

## 3. Persistence and health

Show the backend health response at <http://localhost:8080/actuator/health>.

Restart only the application containers:

```text
docker compose restart backend frontend
```

Return to the UI and show that the demo data remains because the database volume was preserved.

## 4. Monitoring

Start the optional monitoring service:

```text
docker compose --profile monitoring up -d prometheus
```

Open <http://localhost:9090/targets> and show that `taskflow-backend` is `UP`. Run one small query, such as:

```promql
jvm_memory_used_bytes
```

or:

```promql
http_server_requests_seconds_count
```

Explain that Prometheus scrapes Spring Boot's `/actuator/prometheus` endpoint every 15 seconds.

## 5. Engineering evidence

On GitHub, show the latest green checks for:

- backend verification against PostgreSQL;
- frontend lint, test, and build;
- Trivy scans of both application images;
- container smoke testing;
- CodeQL;
- dependency review on a pull request, when applicable.

Keep this section short: the working product remains the center of the demo.

## 6. Cleanup

Stop services while preserving local data:

```text
docker compose --profile monitoring down
```

Use `docker compose --profile monitoring down -v` only after the presentation if the local database and Prometheus data should be intentionally deleted.

## Recording checklist

- [ ] No token, password, email inbox, or private browser tab is visible.
- [ ] The stack starts from the documented command.
- [ ] Product steps match the final UI labels.
- [ ] PostgreSQL persistence is visible after restart.
- [ ] Actuator health reports `UP`.
- [ ] Prometheus target reports `UP`.
- [ ] GitHub checks are green.
- [ ] The recording stays under five minutes.
