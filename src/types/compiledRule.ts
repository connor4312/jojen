import { IRuleValidationParams, Rule } from './rule';

export type validatorFn = (params: IRuleValidationParams<any>, callback: (error?: Error) => void) => void;

/**
 * The CompiledRule uses a precompiled function (built on the .compile()
 * call) to run against the input.
 */
export abstract class CompiledRule extends Rule {

    private validateInternal: validatorFn;

    public validate (params: IRuleValidationParams<any>, callback: (error?: Error) => void) {
        return this.validateInternal(params, callback);
    }

    /**
     * Returns a string for a function that will be called with the same
     * signature and arguments as #Validator.validate.
     * @example
     *   getFn() {
     *     return `if (params.value === 42) {
     *       return callback(this.error(params));
     *     }`;
     *   }
     */
    public getFn(..._args: any[]): string {
        throw new Error('not implemented');
    }

    public compile(...args: any[]) {
        const fn = this.getFn(...args);
        // tslint:disable-next-line no-function-constructor-with-string-args
        this.validateInternal = <validatorFn>new Function('params', 'callback', fn);
    }
}
