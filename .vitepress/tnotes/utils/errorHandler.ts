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
    console.error(`❌ TNotesError`)
    console.error(`错误码：${error.code}`)
    console.error(`错误信息：${error.message}`)

    if (error.context && Object.keys(error.context).length > 0) {
      console.error('错误上下文信息：', error.context)
    }

    if (error.stack && process.env.DEBUG) {
      console.error('错误堆栈信息：', error.stack)
    }
  } else if (error instanceof Error) {
    console.error(`❌ Error`)
    console.error(`错误信息：${error.message}`)

    if (error.stack && process.env.DEBUG) {
      console.error('错误堆栈信息：', error.stack)
    }
  } else {
    console.error('❌ 未知错误：', error)
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
    new TNotesError(`文件未找到：${path}`, ErrorCode.FILE_NOT_FOUND, {
      path,
    }),

  fileReadError: (path: string, originalError?: Error) =>
    new TNotesError(`读取文件失败：${path}`, ErrorCode.FILE_READ_ERROR, {
      path,
      originalError: originalError?.message,
    }),

  fileWriteError: (path: string, originalError?: Error) =>
    new TNotesError(`写入文件失败：${path}`, ErrorCode.FILE_WRITE_ERROR, {
      path,
      originalError: originalError?.message,
    }),

  gitNotRepo: (dir: string) =>
    new TNotesError(`不是一个 Git 仓库：${dir}`, ErrorCode.GIT_NOT_REPO, {
      dir,
    }),

  gitCommandFailed: (command: string, dir: string, originalError?: Error) =>
    new TNotesError(`Git 命令失败：${command}`, ErrorCode.GIT_COMMAND_FAILED, {
      command,
      dir,
      originalError: originalError?.message,
    }),

  noteIdInvalid: (id: string) =>
    new TNotesError(`无效的笔记 ID：${id}`, ErrorCode.NOTE_ID_INVALID, {
      id,
    }),

  noteConfigInvalid: (notePath: string, reason?: string) =>
    new TNotesError(
      `无效的笔记配置：${notePath}`,
      ErrorCode.NOTE_CONFIG_INVALID,
      { notePath, reason }
    ),

  configInvalid: (field: string, reason: string) =>
    new TNotesError(`无效的配置字段：${field}`, ErrorCode.CONFIG_INVALID, {
      field,
      reason,
    }),

  commandNotFound: (commandName: string) =>
    new TNotesError(`未找到命令：${commandName}`, ErrorCode.COMMAND_NOT_FOUND, {
      commandName,
    }),

  commandFailed: (
    commandName: string,
    exitCode?: number,
    originalError?: Error
  ) =>
    new TNotesError(`命令执行失败：${commandName}`, ErrorCode.COMMAND_FAILED, {
      commandName,
      exitCode,
      originalError: originalError?.message,
    }),

  serverStartFailed: (port: number, originalError?: Error) =>
    new TNotesError(
      `启动服务器失败：端口 ${port}`,
      ErrorCode.SERVER_START_FAILED,
      { port, originalError: originalError?.message }
    ),

  portInUse: (port: number) =>
    new TNotesError(`端口 ${port} 已被占用`, ErrorCode.PORT_IN_USE, {
      port,
    }),
}
