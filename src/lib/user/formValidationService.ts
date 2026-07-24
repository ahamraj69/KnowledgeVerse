export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Evaluates core credential parameter inputs during user authentication loops [INDEX].
 */
export function validateLoginFormFields(email?: string, password?: string): ValidationResult {
  if (!email?.trim()) return { isValid: false, errorMessage: "Email address is required." };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, errorMessage: "Please supply a valid email format layout." };
  }
  
  if (!password || password.length < 6) {
    return { isValid: false, errorMessage: "Password is required and must contain at least 6 characters." };
  }
  
  return { isValid: true };
}

/**
 * Certifies mandatory metadata descriptions inside teacher studio workflows [INDEX].
 */
export function validateCourseCreationFields(title?: string, description?: string, category?: string): ValidationResult {
  if (!title?.trim()) return { isValid: false, errorMessage: "Course Title heading is required." };
  if (title.trim().length < 5) return { isValid: false, errorMessage: "Course Title must be at least 5 characters long." };
  
  if (!description?.trim()) return { isValid: false, errorMessage: "Syllabus description context summary is missing." };
  if (description.trim().length < 20) return { isValid: false, errorMessage: "Description text summary must be at least 20 characters." };
  
  if (!category?.trim() || category === "unselected") {
    return { isValid: false, errorMessage: "Please select an explicit focal Subject Category track." };
  }
  
  return { isValid: true };
}
