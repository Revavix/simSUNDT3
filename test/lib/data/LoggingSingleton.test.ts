import { expect, test } from "vitest";
import { LoggingSingleton } from "../../../src/lib/data/LoggingSingleton";
import { LoggingLevel } from "../../../src/lib/models/Logging";

test("Log message", () => {
    const loggingSingleton = LoggingSingleton.GetInstance();
    const logs: any[] = [];

    const unsubscribe = loggingSingleton.Subscribe((newLogs: any) => {
        logs.push(...newLogs);
    });

    loggingSingleton.Log(LoggingLevel.INFO, "Test message");

    unsubscribe();

    expect(logs.length === 1);
    expect(logs[0].message === "Test message");
    expect(logs[0].icon === "info");
    expect(logs[0].color === "#4d4d4d");
});

test("Clear logs", () => {
    const loggingSingleton = LoggingSingleton.GetInstance();
    const logs = [];

    const unsubscribe = loggingSingleton.Subscribe((newLogs: any) => {
        logs.push(...newLogs);
    });

    loggingSingleton.Log(LoggingLevel.INFO, "Test message");
    loggingSingleton.Clear();

    unsubscribe();

    expect(logs.length === 0);
});

test("Set max entries", () => {
    const loggingSingleton = LoggingSingleton.GetInstance();

    loggingSingleton.MaxEntries = 100;

    expect(loggingSingleton.MaxEntries === 100);
});
