import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: "isDateFormat",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") {
            return false;
          }

          const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
          return dateFormatRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format YYYY-MM-DD`;
        },
      },
    });
  };
}
