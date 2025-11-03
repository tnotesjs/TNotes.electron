declare module 'minimist' {
  interface ParsedArgs {
    [arg: string]: any
    _: string[]
  }

  interface Opts {
    string?: string | string[]
    boolean?: boolean | string | string[]
    alias?: { [key: string]: string | string[] }
    default?: { [key: string]: any }
    stopEarly?: boolean
    '--'?: boolean
    unknown?: (arg: string) => boolean
  }

  function minimist(args?: string[], opts?: Opts): ParsedArgs

  export = minimist
}
