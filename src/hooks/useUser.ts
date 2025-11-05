import { useQuery, useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { $sdk } from '../graphql/default/ofetch'
import { isType, isError, isUserNotFoundError, isUnauthorizedError } from '../utils/graphql-helpers'

/**
 * Reusable hook for user data with union type error handling
 *
 * This hook demonstrates the "Errors as Data" pattern where errors
 * are part of the schema rather than out-of-band in the errors array.
 *
 * @param userId - User ID to fetch
 *
 * @example
 * ```ts
 * const userId = '123'
 * const { user, isLoading, isSuccess, isNotFound, errorMessage } = useUser(userId)
 *
 * if (isSuccess) {
 *   console.log(user?.name)
 * } else if (isNotFound) {
 *   console.log('User not found')
 * }
 * ```
 */
export function useUser(userId: string = '1') {
  // Query returns UserResult union type
  const { data: userResult, isLoading, error, refetch } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const result = await $sdk.test({ id: userId })

      // System errors (network, server crash, etc.) still go in errors array
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      // Return the union type result (User | UserNotFoundError | UnauthorizedError)
      return result.data?.getUser
    },
    staleTime: 5000,
  })

  // Memoized properties for type-safe discrimination
  const isSuccess = useMemo(() =>
    userResult ? isType(userResult, 'User') : false,
    [userResult]
  )

  const isNotFound = useMemo(() =>
    userResult ? isUserNotFoundError(userResult) : false,
    [userResult]
  )

  const isUnauthorized = useMemo(() =>
    userResult ? isUnauthorizedError(userResult) : false,
    [userResult]
  )

  const isErrorResult = useMemo(() =>
    userResult ? isError(userResult) : false,
    [userResult]
  )

  // Extract user data (only available when success)
  const user = useMemo(() =>
    isSuccess && userResult?.__typename === 'User'
      ? userResult
      : null,
    [isSuccess, userResult]
  )

  // Extract error message (available for any error type)
  const errorMessage = useMemo(() =>
    isErrorResult && userResult && 'message' in userResult
      ? userResult.message
      : null,
    [isErrorResult, userResult]
  )

  return {
    // Raw result (includes __typename and all union members)
    userResult,

    // Extracted user data (null if error)
    user,

    // Loading state
    isLoading,

    // System error (network, server crash)
    error,

    // Type discrimination flags
    isSuccess,
    isNotFound,
    isUnauthorized,
    isErrorResult,

    // Extracted error message
    errorMessage,

    // Refetch function
    refetch,
  }
}

/**
 * Example mutation hook
 */
export function useUpdateUser() {
  return useMutation({
    mutationFn: async (variables: { id: string; name: string }) => {
      // GraphQL mutation will be done here
      console.log('Update user:', variables)
      return variables
    },
    onSuccess: () => {
      console.log('User updated successfully')
    },
  })
}
