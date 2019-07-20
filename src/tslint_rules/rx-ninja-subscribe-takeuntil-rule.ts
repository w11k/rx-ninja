import * as Lint from "tslint";
import * as ts from "typescript";
import {getObservableSubscribeExpression} from "./util";


export function checkPipeTakeUntilBeforeSubscribe(subscribeExpression: ts.Node, allowedTerminators: string[]): true | string {
    const propertyAccessExpression = subscribeExpression as ts.PropertyAccessExpression;
    const objWithSubscribeExpression = propertyAccessExpression.expression as ts.CallExpression;
    const beforeSubscribeExpression = objWithSubscribeExpression.expression as ts.PropertyAccessExpression;
    const allowedTerminatorsDesc = "[" + allowedTerminators.join(", ") + "]";

    if (beforeSubscribeExpression === undefined
        || beforeSubscribeExpression.name === undefined
        || beforeSubscribeExpression.name.escapedText !== "pipe") {
        return "Missing `.pipe(...)` with one of " + allowedTerminatorsDesc + " before .subscribe().";
    }

    let pipeCallArguments = objWithSubscribeExpression.arguments;
    if (pipeCallArguments.length === 0) {
        return "Missing one of " + allowedTerminatorsDesc + " as last pipe operator.";
    } else {
        const lastArg = pipeCallArguments[pipeCallArguments.length - 1] as ts.CallExpression;
        const lastArgExpr = lastArg.expression as ts.Identifier;
        if (allowedTerminators.indexOf(lastArgExpr.escapedText.toString()) === -1) {
            return "Missing one of " + allowedTerminatorsDesc + " as last pipe operator.";
        }
    }
    return true;
}

// noinspection JSUnusedGlobalSymbols
export class Rule extends Lint.Rules.TypedRule {

    // noinspection JSUnusedGlobalSymbols
    static metadata: Lint.IRuleMetadata = {
        description: "Enforces that `.pipe(..., takeUntil(...))` is called before `.subscribe()`.",
        options: {
            type: "array",
            "items": {
                "type": "string"
            }
        },
        optionsDescription: "TBD",
        requiresTypeInfo: true,
        ruleName: "rx-ninja-subscribe-takeuntil",
        type: "style",
        typescriptOnly: true
    };

    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        let ruleArguments = this.getOptions().ruleArguments;
        const allowedTerminators: string[] = ruleArguments.length === 0 ? ["takeUntil"] : ruleArguments;

        const failures: Lint.RuleFailure[] = [];
        // let relevantClasses: ts.Node[] = tsquery(sourceFile, "ClassDeclaration");
        // relevantClasses.forEach(classDeclaration => {
        const subscribeExpression = getObservableSubscribeExpression(sourceFile, program);
        subscribeExpression.forEach(node => {
            let okOrError = checkPipeTakeUntilBeforeSubscribe(node, allowedTerminators);
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
