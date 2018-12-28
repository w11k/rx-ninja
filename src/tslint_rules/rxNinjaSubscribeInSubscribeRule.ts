import * as Lint from "tslint";
import * as ts from "typescript";
import {getObservableSubscribeExpression} from "./util";


// noinspection JSUnusedGlobalSymbols
export class Rule extends Lint.Rules.TypedRule {

    // noinspection JSUnusedGlobalSymbols
    static metadata: Lint.IRuleMetadata = {
        description: "Enforces that `Observable#subscribe()` is not called inside Observable#subscribe().",
        options: null,
        optionsDescription: "Not configurable.",
        requiresTypeInfo: true,
        ruleName: "rx-ninja-subscribe-in-subscribe",
        type: "style",
        typescriptOnly: true
    };

    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const failures: Lint.RuleFailure[] = [];

        const subscribeExpression = getObservableSubscribeExpression(sourceFile, program);
        subscribeExpression.forEach(node => {
            const subscribeCallExpr = node.parent as ts.CallExpression;
            if (subscribeCallExpr.arguments !== undefined) {
                subscribeCallExpr.arguments.forEach(arg => {
                    const innerSubscribeExpr = getObservableSubscribeExpression(arg, program);
                    innerSubscribeExpr.forEach(node => {
                        const propertyAccessExpression = node as ts.PropertyAccessExpression;
                        const {name} = propertyAccessExpression;
                        failures.push(new Lint.RuleFailure(
                            sourceFile,
                            name.getStart(),
                            name.getStart() + name.getWidth(),
                            "Observable#subscribe() called inside Observable.subscribe()",
                            this.ruleName
                        ));
                    });
                });
            }
        });
        return failures;
    }
}
