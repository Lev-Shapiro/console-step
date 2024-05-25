import { NonPromise, WithConsole } from "./console-step.types";
export declare enum StepVariety {
    Default = "",
    Error = "\u001B[91m",// redBright
    Success = "\u001B[92m",// greenBright
    Info = "\u001B[94m",// blueBright
    Warning = "\u001B[93m",// yellowBright
    ObjectBrackets = "\u001B[95m",// magentaBright
    ArrayBrackets = "\u001B[96m"
}
export declare class ConsoleStep {
    private value;
    private level;
    private isHead;
    next: ConsoleStep[];
    constructor(value: string, level?: number, isHead?: boolean);
    createStep(value: string | boolean | number, variety?: StepVariety, level?: number): ConsoleStep;
    createStepParagraph(text: string, variety?: StepVariety): ConsoleStep;
    createStepObject(obj: object, pointer?: ConsoleStep): void;
    createStepArray(arr: (object | boolean | number | string)[], pointer?: ConsoleStep): void;
    createObjectParser(value: object): void;
    private get spacing();
    get steps(): string;
    log(): void;
    nest(steps: ConsoleStep): void;
    increaseNestLevel(increaseBy: number): void;
    logAfter<T>(callback: (step: ConsoleStep) => NonPromise<T>): NonPromise<T>;
    logAfterAsync<T>(callback: () => Promise<T>): Promise<T>;
    returnAfter<T>(callback: () => NonPromise<T>): NonPromise<WithConsole<{
        data: T;
    }>>;
    returnAfterAsync<T>(callback: () => Promise<T>): Promise<WithConsole<{
        data: T;
    }>>;
    private breakLines;
}
