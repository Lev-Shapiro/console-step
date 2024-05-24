import { ConsoleStep } from "."

export type NonPromise<T> = T extends Promise<infer _> ? never : T

export type WithConsole<T> = {
    [K in keyof T]: T[K]
  } & { step: ConsoleStep }
  