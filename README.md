# Console Step

Console Step is an npm library that enhances your console logs by making them visually appealing. It provides a structured and colorful way to log messages, objects, arrays, and more, with different levels and color varieties.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Examples](#examples)
- [Contributors](#contributors)
- [License](#license)

## Introduction

Console Step allows you to create step-based logs with nested levels and a variety of styles. It is particularly useful for applications that require structured and easy-to-read console output, such as CLI tools and development logging.

## Installation

To install ConsoleStep, use npm:

```bash
npm install console_step
```

## Features

- **Create Steps**: Create steps with different values and styles.
- **Nested Steps**: Create nested steps to represent hierarchical data.
- **Colored Output**: Use different colors for different types of messages.
- **Object and Array** Logging: Log objects and arrays with appropriate formatting.
- **Paragraph Logging**: Break long text into paragraphs for better readability.

## Usage

```javascript
import { ConsoleStep, StepVariety } from "console_step";

const fetchToServer = () => Promise.resolve();

const pingStep = new ConsoleStep("Ping server");

fetchToServer()
  .then(() => pingStep.createStep("Pong!", StepVariety.Success))
  .catch(() => pingStep.createStep("Server is down!", StepVariety.Error));

pingStep.log();

new ConsoleStep("AI Summary Request").logAfter((step) => {
  step.createStep("Model: GPT-3.5-turbo");
  step.createStep("Task: Summarize article");
  step.createStep("Language: English");
  step.createStep("Temperature: 0.5");
});

new ConsoleStep("AI Summary Response").logAfter((step) => {
  step.createStepObject({
    title: "OpenAI Released GPT-4o model",
    pricing: 0.0002,
    description:
      "Some relatively short text about what is the GPT-4o model about",
    url: "https://openai.com/blog/gpt-4o/",
  });
});
```

## Methods

### createStep

```typescript
createStep(value: string | boolean | number, variety?: StepVariety, level?: number): ConsoleStep
```
- value: The message or value for the step.
- variety: (Optional) The style variety for the step. Default is StepVariety.Default.
- level: (Optional) The level of nesting for the step. Default is the current level.

### createStepParagraph
Creates a step with a long text, breaking it into paragraphs.

```typescript
createStepParagraph(text: string, variety?: StepVariety): ConsoleStep
```
- text: The long text to be logged.
- variety: (Optional) The style variety for the text. Default is StepVariety.Default.

### createStepObject
Logs an object with a formatted output.

```typescript
createStepObject(obj: object, pointer?: ConsoleStep): void
```
- obj: The object to be logged.
- pointer: (Optional) The parent step. Default is the current step.

### createStepArray
Logs an array with a formatted output.

```typescript
createStepArray(arr: (object | boolean | number | string)[], pointer?: ConsoleStep): void
```
- arr: The array to be logged.
- pointer: (Optional) The parent step. Default is the current step.

### log
Logs the current step and all nested steps to the console.

```typescript
log(): void
```

### logAfter
Logs the steps after executing a callback.

```typescript
logAfter<T>(callback: (step: ConsoleStep) => NonPromise<T>): NonPromise<T>
```
- callback: A function that performs actions and returns a result.

### logAfterAsync
Logs the steps after executing an asynchronous callback.

```typescript
logAfterAsync<T>(callback: () => Promise<T>): Promise<T>
```
- callback: An asynchronous function that performs actions and returns a result.

### StepVariety
An enum of various colors to use when logging texts
```typescript
export enum StepVariety {
  Default = 'default',
  Error = 'redBright',
  Success = 'greenBright',
  Info = 'blueBright',
  Warning = 'yellowBright',
  ObjectBrackets = 'magentaBright',
  ArrayBrackets = 'cyanBright',
}
```

## Github
[github](https://github.com/Lev-Shapiro/console_step)

## Maintainers

- [Lev Shapiro](https://github.com/Lev-Shapiro)