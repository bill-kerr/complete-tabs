import {
  ValidationArguments,
  ValidationError as ClassValidationError,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';

export const validation = {
  length: (property: string, min: number, max: number) =>
    `Property ${property} must be between ${min} and ${max} characters long.`,

  string: (property: string) => `Property ${property} must contain a string.`,

  boolean: (property: string) => `Property ${property} must contain a boolean value.`,

  number: (property: string) => `Property ${property} must contain a number.`,

  integer: (property: string) => `Property ${property} must contain an integer.`,

  date: (property: string) => `Property ${property} must contain a date formatted as YYYY-MM-DD.`,

  email: (property: string = 'email') => `Property ${property} must contain a valid email.`,

  required: (property: string) => `Property ${property} is required and should not be empty.`,

  extra: (property: string) => `Property ${property} should not exist.`,
};

export function mapClassValidationErrors(errors: ClassValidationError[]): string[] {
  const messages: string[] = [];
  errors.forEach(error => {
    if (error.constraints) {
      const fieldErrors = Object.values(error.constraints).map(message =>
        parseValidationMessage(message)
      );
      messages.push(...fieldErrors);
    }
  });
  return messages;
}

function parseValidationMessage(message: string) {
  if (message.endsWith('should not exist')) {
    message = message[0].toUpperCase() + message.slice(1) + '.';
  }
  return message;
}

@ValidatorConstraint({ name: 'customDate', async: false })
export class IsDate implements ValidatorConstraintInterface {
  validate(text: string, _args: ValidationArguments) {
    const date = parse(text, 'yyyy-MM-dd', new Date());
    return isValid(date);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Dates must be formatted as YYYY-MM-DD.';
  }
}
