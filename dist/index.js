"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleStep = exports.StepVariety = void 0;
var StepVariety;
(function (StepVariety) {
    StepVariety["Default"] = "";
    StepVariety["Error"] = "\u001B[91m";
    StepVariety["Success"] = "\u001B[92m";
    StepVariety["Info"] = "\u001B[94m";
    StepVariety["Warning"] = "\u001B[93m";
    StepVariety["ObjectBrackets"] = "\u001B[95m";
    StepVariety["ArrayBrackets"] = "\u001B[96m"; // cyanBright
})(StepVariety || (exports.StepVariety = StepVariety = {}));
const reset = '\x1b[0m';
function applyStyle(text, style) {
    return style + text + reset;
}
class ConsoleStep {
    constructor(value, level = 0, isHead = true) {
        this.value = value;
        this.level = level;
        this.isHead = isHead;
        this.next = [];
    }
    createStep(value, variety = StepVariety.Default, level = this.level) {
        const content = `${this.spacing}${value}`;
        const contentColored = variety !== StepVariety.Default ? applyStyle(content, variety) : content;
        const step = new ConsoleStep(contentColored, level + 1, false);
        this.next.push(step);
        return step;
    }
    createStepParagraph(text, variety = StepVariety.Default) {
        const paragraph = this.breakLines(text);
        return this.createStep(paragraph, variety);
    }
    createStepObject(obj, pointer = this) {
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
    createStepArray(arr, pointer = this) {
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
    createObjectParser(value) {
        if (!value)
            return;
        if (Array.isArray(value)) {
            this.createStepArray(value);
            return;
        }
        this.createStepObject(value);
    }
    get spacing() {
        return "  ".repeat(this.level + 1);
    }
    get steps() {
        const value = this.isHead ? applyStyle(this.value, StepVariety.Info) : this.value;
        return !this.next.length
            ? value
            : value +
                this.next.reduce((prev, curr) => {
                    return prev + "\n" + curr.steps;
                }, "");
    }
    log() {
        console.log(this.steps);
    }
    nest(steps) {
        steps.increaseNestLevel(this.level);
        this.next.push(steps);
    }
    increaseNestLevel(increaseBy) {
        this.level += increaseBy;
        this.value = this.spacing + this.value;
        for (const step of this.next) {
            step.increaseNestLevel(increaseBy - 1);
        }
    }
    logAfter(callback) {
        const result = callback(this);
        this.log();
        return result;
    }
    logAfterAsync(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield callback();
            this.log();
            return result;
        });
    }
    returnAfter(callback) {
        const result = callback();
        return { step: this, data: result };
    }
    returnAfterAsync(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield callback();
            return { step: this, data: result };
        });
    }
    breakLines(text, breakAtLine = 50) {
        text = text.replace(/\n\n/g, " ").replace(/\n/g, " ");
        if (breakAtLine <= 0) {
            throw new Error("breakAtLine should be a positive integer");
        }
        const lines = [];
        for (let i = 0; i < text.length; i += breakAtLine) {
            const gapped = i + breakAtLine;
            const check = (text, index) => {
                return (text[index] === "\n" || text[index] === "\t" || text[index] === " ");
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
exports.ConsoleStep = ConsoleStep;
