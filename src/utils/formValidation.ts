
export type ValidationRule = {
  validate: (value: any) => boolean;
  message: string;
};

export const validateRequired = (fieldName: string): ValidationRule => ({
  validate: (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 && value.some(item => !!item);
    }
    return !!value;
  },
  message: `${fieldName} is required`
});

export const validateEmail = (): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Only validate if there's a value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  message: "Please enter a valid email address"
});

export const validateUrl = (): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Only validate if there's a value
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  message: "Please enter a valid URL"
});

export const validateLength = (min: number, max: number, fieldName: string): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Only validate if there's a value
    const length = String(value).length;
    return length >= min && length <= max;
  },
  message: `${fieldName} must be between ${min} and ${max} characters`
});

export const validateForm = (values: Record<string, any>, validationRules: Record<string, ValidationRule[]>) => {
  const errors: Record<string, string> = {};
  
  Object.entries(validationRules).forEach(([field, rules]) => {
    const value = values[field];
    
    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors[field] = rule.message;
        break;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
