import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsUrlsArray(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: "IsUrlsArray",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }

          // Check each element in the array
          for (const url of value) {
            if (!isUrl(url)) {
              return false;
            }
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of valid URLs`;
        },
      },
    });
  };
}

// Helper function to validate URL format
function isUrl(url: string): boolean {
  // Regular expression for URL validation
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}
