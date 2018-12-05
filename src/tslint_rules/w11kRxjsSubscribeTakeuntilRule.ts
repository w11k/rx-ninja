import * as Lint from "tslint";
import * as ts from "typescript";
import {getObservableSubscribeExpression} from "./util";


export function checkPipeTakeUntilBeforeSubscribe(subscribeExpression: ts.Node): true | string {
    const propertyAccessExpression = subscribeExpression as ts.PropertyAccessExpression;
    const objWithSubscribeExpression = propertyAccessExpression.expression as ts.CallExpression;
    const beforeSubscribeExpression = objWithSubscribeExpression.expression as ts.PropertyAccessExpression;

    if (beforeSubscribeExpression === undefined
        || beforeSubscribeExpression.name === undefined
        || beforeSubscribeExpression.name.escapedText !== "pipe") {
        return "Missing `.pipe(..., takeUntil(...))` before .subscribe().";
    }

    let pipeCallArguments = objWithSubscribeExpression.arguments;
    if (pipeCallArguments.length === 0) {
        return "Missing takeUntil(...) as last pipe operator.";
    } else {
        const lastArg = pipeCallArguments[pipeCallArguments.length - 1] as ts.CallExpression;
        const lastArgExpr = lastArg.expression as ts.Identifier;
        if (lastArgExpr.escapedText === "untilComponentDestroyed") {
            return "Use `takeUntil(componentDestroyed(this)) instead of `untilComponentDestroyed(this)` (Note: `componentDestroyed` will be renamed to `ngDestroyCalled` in the future).";
        }
        if (lastArgExpr.escapedText !== "takeUntil") {
            return "Missing takeUntil(...) as last pipe operator.";
        }
    }
    return true;
}

export function checkLiftScopedBeforeSubscribe(subscribeExpression: ts.Node): true | string {
    const propertyAccessExpression = subscribeExpression as ts.PropertyAccessExpression;
    const objWithSubscribeExpression = propertyAccessExpression.expression as ts.CallExpression;
    const beforeSubscribeExpression = objWithSubscribeExpression.expression as ts.PropertyAccessExpression;

    if (beforeSubscribeExpression === undefined
        || beforeSubscribeExpression.name === undefined
        || beforeSubscribeExpression.name.escapedText !== "lift") {
        return "Missing `.pipe(..., takeUntil(...))` before .subscribe().";
    }

    let pipeCallArguments = objWithSubscribeExpression.arguments;
    if (pipeCallArguments.length === 0) {
        return "Missing `.pipe(..., takeUntil(...))` before .subscribe().";
    } else {
        const lastArg = pipeCallArguments[pipeCallArguments.length - 1] as ts.CallExpression;
        const takeUntilCall = lastArg.expression as ts.Identifier;
        if (takeUntilCall.escapedText !== "scoped") {
            return "Missing `.pipe(..., takeUntil(...))` before .subscribe().";
        }
    }
    return true;
}


// noinspection JSUnusedGlobalSymbols
export class Rule extends Lint.Rules.TypedRule {

    // noinspection JSUnusedGlobalSymbols
    static metadata: Lint.IRuleMetadata = {
        description: "Enforces that `.pipe(..., takeUntil(...))` is called before `.subscribe()`.",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "w11k-rxjs-subscribe-takeuntil",
        type: "style",
        typescriptOnly: true
    };

    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const failures: Lint.RuleFailure[] = [];
        // let relevantClasses: ts.Node[] = tsquery(sourceFile, "ClassDeclaration");
        // relevantClasses.forEach(classDeclaration => {
        const subscribeExpression = getObservableSubscribeExpression(sourceFile, program);
        subscribeExpression.forEach(node => {

            let okOrError = checkPipeTakeUntilBeforeSubscribe(node);
            // if (okOrError === true) {
            //     okOrError = checkLiftScopedBeforeSubscribe(node);
            // }

            if (okOrError !== true) {
                const propertyAccessExpression = node as ts.PropertyAccessExpression;
                const {name} = propertyAccessExpression;
                failures.push(new Lint.RuleFailure(
                    sourceFile,
                    name.getStart(),
                    name.getStart() + name.getWidth(),
                    okOrError,
                    this.ruleName
                ));
            }
        });
        // });
        return failures;
    }
}
