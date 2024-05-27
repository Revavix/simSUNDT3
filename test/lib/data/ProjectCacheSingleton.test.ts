import { expect, test } from "vitest";
import { ProjectCacheSingleton } from "../../../src/lib/data/ProjectCacheSingleton";
import { type Project } from "../../../src/lib/models/Project";

test("Write project to cache", () => {
    const projectCacheSingleton = ProjectCacheSingleton.GetInstance();
    const project: Project = {
        name: "Test Project",
        path: "/path/to/project",
        data: {} as any
    };

    projectCacheSingleton.Write(project);

    expect(projectCacheSingleton.projects.length === 1);
    expect(projectCacheSingleton.projects[0].name === "Test Project");
    expect(projectCacheSingleton.projects[0].path === "/path/to/project");
});

test("Refresh project cache with non-existent project", async () => {
    const projectCacheSingleton = ProjectCacheSingleton.GetInstance();
    const project: Project = {
        name: "Test Project",
        path: "/path/to/nonexistent/project",
        data: {} as any
    };

    projectCacheSingleton.Write(project);

    await projectCacheSingleton.Refresh();

    expect(projectCacheSingleton.projects.length === 0);
});