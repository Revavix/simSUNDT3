import { expect, test } from "vitest";
import { ProjectSingleton } from "../../../src/lib/data/ProjectSingleton";
import TreeNode from "../../../src/lib/models/tree/TreeNode";

test("New project", () => {
    const projectSingleton = ProjectSingleton.GetInstance();
    const initialProject = projectSingleton.Tree;

    projectSingleton.New();

    const newProject = projectSingleton.Tree;

    expect(newProject).not.toBe(initialProject);
    expect(newProject).toBeInstanceOf(TreeNode);
});

test("Import tree", async () => {
    const projectSingleton = ProjectSingleton.GetInstance();
    const newTree = new TreeNode("Test Tree");

    projectSingleton.ImportTree(newTree);

    expect(projectSingleton.Tree).toBe(newTree);
});

test("Push postprocessor data", async () => {
    const projectSingleton = ProjectSingleton.GetInstance();
    const data = { timestamp: new Date(), value: 123 };

    projectSingleton.PushPostprocessorData(data);

    expect(projectSingleton.Postprocessor).toContain(data);
});