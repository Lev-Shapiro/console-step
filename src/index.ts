import { NonPromise, WithConsole } from "./console-step.types";

export enum StepVariety {
  Default = '',
  Error = '\x1b[91m', // redBright
  Success = '\x1b[92m', // greenBright
  Info = '\x1b[94m', // blueBright
  Warning = '\x1b[93m', // yellowBright

  ObjectBrackets = '\x1b[95m', // magentaBright
  ArrayBrackets = '\x1b[96m' // cyanBright
}

const reset = '\x1b[0m';

function applyStyle(text: string, style: StepVariety): string {
  return style + text + reset;
}

export class ConsoleStep {
  next: ConsoleStep[] = [];

  constructor(
    private value: string,
    private level = 0,
    private isHead = true
  ) {}

  createStep(
    value: string | boolean | number,
    variety: StepVariety = StepVariety.Default,
    level: number = this.level
  ): ConsoleStep {
    const content = `${this.spacing}${value}`;

    const contentColored =
      variety !== StepVariety.Default ? applyStyle(content, variety) : content;

    const step = new ConsoleStep(contentColored, level + 1, false);

    this.next.push(step);

    return step;
  }

  createStepParagraph(
    text: string,
    variety: StepVariety = StepVariety.Default
  ) {
    const paragraph = this.breakLines(text);

    return this.createStep(paragraph, variety);
  }

  createStepObject(obj: object, pointer: ConsoleStep = this) {
    if (Array.isArray(obj)) {
      throw new Error(".createStepObject can't have arrays passed");
    }

    pointer.value += applyStyle("{", StepVariety.ObjectBrackets);

    if (!Object.keys(obj).length) {
      pointer.value += applyStyle("}", StepVariety.ObjectBrackets);
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value) {
        pointer.createStep(key + ": ").createObjectParser(value);
        continue;
      }

      pointer.createStep(`${key}: ${value}`);
    }

    pointer.createStep("}", StepVariety.ObjectBrackets, pointer.level - 1);
  }

  createStepArray(
    arr: (object | boolean | number | string)[],
    pointer: ConsoleStep = this
  ) {
    if (!Array.isArray(arr)) {
      throw new Error(".createStepArray only accepts arrays");
    }

    pointer.value += applyStyle("[", StepVariety.ArrayBrackets);

    if (!arr.length) {
      pointer.value += applyStyle("]", StepVariety.ArrayBrackets);
      return;
    }

    for (const value of arr) {
      if (typeof value === "object") {
        pointer.createStep("").createObjectParser(value);
        continue;
      }

      if (!value) {
        continue;
      }

      pointer.createStep(value);
    }

    pointer.createStep("]", StepVariety.ArrayBrackets, pointer.level - 1);
  }

  createObjectParser(value: object) {
    if (!value) return;

    if (Array.isArray(value)) {
      this.createStepArray(value);
      return;
    }

    this.createStepObject(value);
  }

  private get spacing() {
    return "  ".repeat(this.level + 1);
  }

  get steps(): string {
    const value = this.isHead ? applyStyle(this.value, StepVariety.Info) : this.value;

    return !this.next.length
      ? value
      : value +
          this.next.reduce<string>((prev, curr) => {
            return prev + "\n" + curr.steps;
          }, "");
  }

  log() {
    console.log(this.steps);
  }

  nest(steps: ConsoleStep) {
    steps.increaseNestLevel(this.level);

    this.next.push(steps);
  }

  increaseNestLevel(increaseBy: number) {
    this.level += increaseBy;
    this.value = this.spacing + this.value;

    for (const step of this.next) {
      step.increaseNestLevel(increaseBy - 1);
    }
  }

  logAfter<T>(callback: (step: ConsoleStep) => NonPromise<T>): NonPromise<T> {
    const result = callback(this);
    this.log();

    return result;
  }

  async logAfterAsync<T>(callback: () => Promise<T>): Promise<T> {
    const result = await callback();
    this.log();

    return result;
  }

  returnAfter<T>(
    callback: () => NonPromise<T>
  ): NonPromise<WithConsole<{ data: T }>> {
    const result = callback();

    return { step: this, data: result };
  }

  async returnAfterAsync<T>(
    callback: () => Promise<T>
  ): Promise<WithConsole<{ data: T }>> {
    const result = await callback();

    return { step: this, data: result };
  }

  private breakLines(text: string, breakAtLine = 50) {
    text = text.replace(/\n\n/g, " ").replace(/\n/g, " ");
    if (breakAtLine <= 0) {
      throw new Error("breakAtLine should be a positive integer");
    }

    const lines: string[] = [];
    for (let i = 0; i < text.length; i += breakAtLine) {
      const gapped = i + breakAtLine;

      const check = (text: string, index: number) => {
        return (
          text[index] === "\n" || text[index] === "\t" || text[index] === " "
        );
      };

      if (check(text, gapped) || check(text, gapped + 1)) {
        lines.push(text.slice(i, i + breakAtLine));
        continue;
      }

      lines.push(text.slice(i, i + breakAtLine) + "-");
    }

    return lines.join(`\n${this.spacing}`);
  }
}
