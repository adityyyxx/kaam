import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema, ZodError, z } from "zod";
import { Resolver, ResolverResult, ResolverOptions, FieldValues } from "react-hook-form";

/**
 * A safe wrapper around zodResolver that prevents uncaught promise rejections
 * and ensures validation errors are properly returned to react-hook-form
 */
export function zodResolverSafe<T extends ZodSchema<FieldValues>>(schema: T): Resolver<z.infer<T>> {
  const resolver = zodResolver(schema);
  
  // Use type assertion to work around TypeScript's strict type checking
  // The zodResolver already handles types correctly, we just need to catch errors
  return (async (
    values: unknown,
    context: unknown,
    options: unknown
  ) => {
    try {
      // Wrap in Promise.resolve to ensure we always get a promise
      const result = await Promise.resolve(
        (resolver as Resolver<FieldValues>)(values as FieldValues, context, options as ResolverOptions<FieldValues>)
      );
      return result as ResolverResult<z.infer<T>>;
    } catch (error) {
      // If it's a ZodError, convert it to the format react-hook-form expects
      // Zod v4 uses 'issues' property, not 'errors'
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, { type: string; message: string }> = {};
        
        // ZodError has 'issues' property in zod v4
        if (error.issues && Array.isArray(error.issues)) {
          error.issues.forEach((err) => {
            if (err.path && Array.isArray(err.path)) {
              const path = err.path.join('.');
              if (path) {
                fieldErrors[path] = {
                  type: err.code || 'validation',
                  message: err.message || 'Validation error',
                };
              }
            }
          });
        }
        
        return {
          values: {} as Record<string, never>,
          errors: fieldErrors,
        } as ResolverResult<z.infer<T>>;
      }
      
      // Check if error has issues property (ZodError serialized or other format)
      if (error && typeof error === 'object' && 'issues' in error && Array.isArray(error.issues)) {
        const fieldErrors: Record<string, { type: string; message: string }> = {};
        
        (error.issues as Array<{ path?: (string | number)[]; code?: string; message?: string }>).forEach((err) => {
          if (err.path && Array.isArray(err.path)) {
            const path = err.path.join('.');
            if (path) {
              fieldErrors[path] = {
                type: err.code || 'validation',
                message: err.message || 'Validation error',
              };
            }
          }
        });
        
        return {
          values: {} as Record<string, never>,
          errors: fieldErrors,
        } as ResolverResult<z.infer<T>>;
      }
      
      // For other errors, return empty result to prevent unhandled rejection
      console.error('Unexpected error in zodResolverSafe:', error);
      return {
        values: {} as Record<string, never>,
        errors: {},
      } as ResolverResult<z.infer<T>>;
    }
  }) as Resolver<z.infer<T>>;
}
