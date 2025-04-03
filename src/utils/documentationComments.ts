
/**
 * This file provides examples of JSDoc documentation patterns
 * to follow throughout the codebase for consistency.
 * 
 * @module Documentation
 */

/**
 * Component documentation example:
 * 
 * @component
 * @example
 * ```tsx
 * <Button 
 *   variant="primary" 
 *   onClick={() => console.log('clicked')}
 * >
 *   Click me
 * </Button>
 * ```
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child elements
 * @param {'default' | 'primary' | 'secondary'} [props.variant='default'] - Button style variant
 * @param {() => void} props.onClick - Click handler function
 * @returns {JSX.Element} A button component
 */

/**
 * Utility function documentation example:
 * 
 * @function
 * @example
 * ```ts
 * // Format 1000 as "1,000"
 * const formatted = formatNumber(1000);
 * ```
 * 
 * @param {number} num - The number to format
 * @returns {string} Formatted number string with locale-specific separators
 */

/**
 * Hook documentation example:
 * 
 * @hook
 * @example
 * ```tsx
 * const { data, isLoading, error } = useData(id);
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage message={error.message} />;
 * 
 * return <DataDisplay data={data} />;
 * ```
 * 
 * @param {string} id - Resource identifier
 * @returns {Object} Hook result object
 * @returns {T|null} result.data - The retrieved data or null if not loaded
 * @returns {boolean} result.isLoading - Loading state indicator
 * @returns {Error|null} result.error - Error object or null if no error
 */

/**
 * Context provider documentation example:
 * 
 * @context
 * @example
 * ```tsx
 * // Provider usage
 * <MyContextProvider initialValue="default">
 *   <App />
 * </MyContextProvider>
 * 
 * // Consumer usage
 * const { value, updateValue } = useMyContext();
 * ```
 * 
 * @param {Object} props - Provider props
 * @param {ReactNode} props.children - Child components that will have access to the context
 * @param {any} [props.initialValue] - Optional initial value for the context
 * @returns {JSX.Element} Provider component
 */

/**
 * Interface documentation example:
 * 
 * @interface
 * @description Represents a user in the system
 * 
 * @property {string} id - Unique identifier
 * @property {string} username - The user's username
 * @property {string} email - The user's email address
 * @property {Date} createdAt - When the user was created
 * @property {boolean} [isActive] - Whether the user is active
 */

/**
 * Type documentation example:
 * 
 * @typedef {Object} FilterOptions
 * @property {'asc'|'desc'} sortOrder - Sorting direction
 * @property {string} sortBy - Field to sort by
 * @property {number} page - Current page number
 * @property {number} limit - Results per page
 */
