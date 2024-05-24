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
const _1 = require(".");
const step_variety_enum_1 = require("./step-variety.enum");
describe('ConsoleStep', () => {
    it('should create a step with default values', () => {
        const step = new _1.ConsoleStep('test');
        expect(step).toBeInstanceOf(_1.ConsoleStep);
        expect(step['value']).toBe('test');
        expect(step['level']).toBe(0);
        expect(step['isHead']).toBe(true);
    });
    it('should create a new step with given value and variety', () => {
        const step = new _1.ConsoleStep('test');
        const newStep = step.createStep('new step', step_variety_enum_1.StepVariety.Success);
        expect(newStep).toBeInstanceOf(_1.ConsoleStep);
        expect(newStep['value']).toContain('new step');
        expect(newStep['level']).toBe(1);
        expect(newStep['isHead']).toBe(false);
    });
    it('should create a step paragraph', () => {
        const step = new _1.ConsoleStep('test');
        const paragraphStep = step.createStepParagraph('This is a long paragraph that should be broken into multiple lines.');
        expect(paragraphStep).toBeInstanceOf(_1.ConsoleStep);
        expect(paragraphStep['value']).toContain('This is a long paragraph');
    });
    it('should create a step object', () => {
        const step = new _1.ConsoleStep('test');
        step.createStepObject({ key: 'value', nested: { innerKey: 'innerValue' } });
        expect(step['next']).toHaveLength(3);
    });
    it('should create a step array', () => {
        const step = new _1.ConsoleStep('test');
        step.createStepArray(['item1', 'item2', 'item3']);
        expect(step['next']).toHaveLength(4);
    });
    it('should log steps after callback', () => {
        const step = new _1.ConsoleStep('test');
        const callback = jest.fn();
        step.logAfter(callback);
        expect(callback).toHaveBeenCalledWith(step);
    });
    it('should log steps after async callback', () => __awaiter(void 0, void 0, void 0, function* () {
        const step = new _1.ConsoleStep('test');
        const callback = jest.fn().mockResolvedValue('async result');
        yield step.logAfterAsync(callback);
        expect(callback).toHaveBeenCalled();
    }));
    it('should return data with step after callback', () => {
        const step = new _1.ConsoleStep('test');
        const callback = jest.fn().mockReturnValue('result');
        const result = step.returnAfter(callback);
        expect(result.data).toBe('result');
        expect(result.step).toBe(step);
    });
    it('should return data with step after async callback', () => __awaiter(void 0, void 0, void 0, function* () {
        const step = new _1.ConsoleStep('test');
        const callback = jest.fn().mockResolvedValue('async result');
        const result = yield step.returnAfterAsync(callback);
        expect(result.data).toBe('async result');
        expect(result.step).toBe(step);
    }));
});
