import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function Is2DArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "is2DArray",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }
          for (const row of value) {
            if (!Array.isArray(row)) {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a 2D array`;
        },
      },
    });
  };
}
