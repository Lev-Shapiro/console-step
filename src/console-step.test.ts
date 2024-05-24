
import { ConsoleStep, StepVariety } from '.';

describe('ConsoleStep', () => {
  it('should create a step with default values', () => {
    const step = new ConsoleStep('test');
    expect(step).toBeInstanceOf(ConsoleStep);
    expect(step['value']).toBe('test');
    expect(step['level']).toBe(0);
    expect(step['isHead']).toBe(true);
  });

  it('should create a new step with given value and variety', () => {
    const step = new ConsoleStep('test');
    const newStep = step.createStep('new step', StepVariety.Success);
    expect(newStep).toBeInstanceOf(ConsoleStep);
    expect(newStep['value']).toContain('new step');
    expect(newStep['level']).toBe(1);
    expect(newStep['isHead']).toBe(false);
  });

  it('should create a step paragraph', () => {
    const step = new ConsoleStep('test');
    const paragraphStep = step.createStepParagraph('This is a long paragraph that should be broken into multiple lines.');
    expect(paragraphStep).toBeInstanceOf(ConsoleStep);
    expect(paragraphStep['value']).toContain('This is a long paragraph');
  });

  it('should create a step object', () => {
    const step = new ConsoleStep('test');
    step.createStepObject({ key: 'value', nested: { innerKey: 'innerValue' } });
    expect(step['next']).toHaveLength(3);
  });

  it('should create a step array', () => {
    const step = new ConsoleStep('test');
    step.createStepArray(['item1', 'item2', 'item3']);
    expect(step['next']).toHaveLength(4);
  });

  it('should log steps after callback', () => {
    const step = new ConsoleStep('test');
    const callback = jest.fn();
    step.logAfter(callback);
    expect(callback).toHaveBeenCalledWith(step);
  });

  it('should log steps after async callback', async () => {
    const step = new ConsoleStep('test');
    const callback = jest.fn().mockResolvedValue('async result');
    await step.logAfterAsync(callback);
    expect(callback).toHaveBeenCalled();
  });

  it('should return data with step after callback', () => {
    const step = new ConsoleStep('test');
    const callback = jest.fn().mockReturnValue('result');
    const result = step.returnAfter(callback);
    expect(result.data).toBe('result');
    expect(result.step).toBe(step);
  });

  it('should return data with step after async callback', async () => {
    const step = new ConsoleStep('test');
    const callback = jest.fn().mockResolvedValue('async result');
    const result = await step.returnAfterAsync(callback);
    expect(result.data).toBe('async result');
    expect(result.step).toBe(step);
  });
});
