import { beforeAll, expect, test } from "vitest";
import { KernelSaver } from "../../../../src/lib/kernel/utdefect/KernelSaver";
import TreeNode from "../../../../src/lib/models/tree/TreeNode";
import { mockIPC } from "@tauri-apps/api/mocks";
import { New } from "../../../../src/lib/tree/Utils";
import { InvokeArgs } from "@tauri-apps/api/core";

function mockedWriteTextFile<T>(cmd: string, payload: InvokeArgs | undefined): Promise<T> {
    if (cmd === "plugin:fs|write_text_file") {
        return Promise.resolve({} as T);
    }

    return Promise.reject();
}

beforeAll(() => {
    mockIPC(mockedWriteTextFile)
});

test("Save with valid root node", async () => {
    const saver = new KernelSaver();
    const rootNode = New();
    saver.rootNode = rootNode;

    await saver.Save("test.txt");

    // Assert that the file is saved successfully
    // You can add your own assertions here
});

test("Save with null root node", async () => {
    const saver = new KernelSaver();
    saver.rootNode = null;

    await expect(saver.Save("test.txt")).rejects.toEqual("No valid root node found");
});

// Add more test cases as needed