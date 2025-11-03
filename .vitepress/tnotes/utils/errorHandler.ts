/**
 * .vitepress/tnotes/utils/errorHandler.ts
 *
 * 统一的错误处理系统
 */

/**
 * TNotes 错误代码枚举
 */
export enum ErrorCode {
  // 文件系统错误
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',

  // Git 相关错误
  GIT_NOT_REPO = 'GIT_NOT_REPO',
  GIT_COMMAND_FAILED = 'GIT_COMMAND_FAILED',
  GIT_MERGE_CONFLICT = 'GIT_MERGE_CONFLICT',

  // 笔记相关错误
  NOTE_ID_INVALID = 'NOTE_ID_INVALID',
  NOTE_CONFIG_INVALID = 'NOTE_CONFIG_INVALID',
  NOTE_NOT_FOUND = 'NOTE_NOT_FOUND',

  // 配置错误
  CONFIG_INVALID = 'CONFIG_INVALID',
  CONFIG_MISSING = 'CONFIG_MISSING',

  // 命令执行错误
  COMMAND_NOT_FOUND = 'COMMAND_NOT_FOUND',
  COMMAND_FAILED = 'COMMAND_FAILED',

  // 服务器错误
  SERVER_START_FAILED = 'SERVER_START_FAILED',
  SERVER_STOP_FAILED = 'SERVER_STOP_FAILED',
  PORT_IN_USE = 'PORT_IN_USE',

  // 未知错误
  UNKNOWN = 'UNKNOWN',
}

/**
 * TNotes 自定义错误类
 */
export class TNotesError extends Error {
  constructor(
    message: string,
    public code: ErrorCode = ErrorCode.UNKNOWN,
    public context?: Record<string, any>
  ) {
    super(message)
    this.name = 'TNotesError'

    // 保持正确的堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TNotesError)
    }
  }
}

/**
 * 统一的错误处理函数
 */
export function handleError(error: unknown, exitOnError = false): void {
  if (error instanceof TNotesError) {
    console.error(`❌ [${error.code}] ${error.message}`)

    if (error.context && Object.keys(error.context).length > 0) {
      console.error('📋 Context:', error.context)
    }

    if (error.stack && process.env.DEBUG) {
      console.error('Stack trace:', error.stack)
    }
  } else if (error instanceof Error) {
    console.error(`❌ ${error.message}`)

    if (error.stack && process.env.DEBUG) {
      console.error('Stack trace:', error.stack)
    }
  } else {
    console.error('❌ Unexpected error:', error)
  }

  if (exitOnError) {
    process.exit(1)
  }
}

/**
 * 包装异步函数，自动处理错误
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  exitOnError = false
): (...args: T) => Promise<R | void> {
  return async (...args: T): Promise<R | void> => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, exitOnError)
    }
  }
}

/**
 * 创建特定类型的错误
 */
export const createError = {
  fileNotFound: (path: string) =>
    new TNotesError(`File not found: ${path}`, ErrorCode.FILE_NOT_FOUND, {
      path,
    }),

  fileReadError: (path: string, originalError?: Error) =>
    new TNotesError(`Failed to read file: ${path}`, ErrorCode.FILE_READ_ERROR, {
      path,
      originalError: originalError?.message,
    }),

  fileWriteError: (path: string, originalError?: Error) =>
    new TNotesError(
      `Failed to write file: ${path}`,
      ErrorCode.FILE_WRITE_ERROR,
      { path, originalError: originalError?.message }
    ),

  gitNotRepo: (dir: string) =>
    new TNotesError(`Not a git repository: ${dir}`, ErrorCode.GIT_NOT_REPO, {
      dir,
    }),

  gitCommandFailed: (command: string, dir: string, originalError?: Error) =>
    new TNotesError(
      `Git command failed: ${command}`,
      ErrorCode.GIT_COMMAND_FAILED,
      { command, dir, originalError: originalError?.message }
    ),

  noteIdInvalid: (id: string) =>
    new TNotesError(`Invalid note ID: ${id}`, ErrorCode.NOTE_ID_INVALID, {
      id,
    }),

  noteConfigInvalid: (notePath: string, reason?: string) =>
    new TNotesError(
      `Invalid note config: ${notePath}`,
      ErrorCode.NOTE_CONFIG_INVALID,
      { notePath, reason }
    ),

  configInvalid: (field: string, reason: string) =>
    new TNotesError(
      `Invalid config field: ${field}`,
      ErrorCode.CONFIG_INVALID,
      { field, reason }
    ),

  commandNotFound: (commandName: string) =>
    new TNotesError(
      `Command not found: ${commandName}`,
      ErrorCode.COMMAND_NOT_FOUND,
      { commandName }
    ),

  commandFailed: (
    commandName: string,
    exitCode?: number,
    originalError?: Error
  ) =>
    new TNotesError(
      `Command failed: ${commandName}`,
      ErrorCode.COMMAND_FAILED,
      { commandName, exitCode, originalError: originalError?.message }
    ),

  serverStartFailed: (port: number, originalError?: Error) =>
    new TNotesError(
      `Failed to start server on port ${port}`,
      ErrorCode.SERVER_START_FAILED,
      { port, originalError: originalError?.message }
    ),

  portInUse: (port: number) =>
    new TNotesError(`Port ${port} is already in use`, ErrorCode.PORT_IN_USE, {
      port,
    }),
}
