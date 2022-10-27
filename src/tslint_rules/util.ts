/*
 * Extended from https://github.com/cartant/rxjs-tslint-rules
 *
 * MIT License
 *
 * Copyright (c) 2017-2018 Nicholas Jamieson and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {tsquery} from "@phenomnomnominal/tsquery";
import * as tsutils from "tsutils";
import * as ts from "typescript";

export function couldBeType(type: ts.Type, name: string | RegExp): boolean {
    if (isReferenceType(type)) {
        type = type.target;
    }

    if (isType(type, name)) {
        return true;
    }

    if (isUnionType(type)) {
        return type.types.some((t) => couldBeType(t, name));
    }

    const baseTypes = type.getBaseTypes();
    return baseTypes !== undefined && baseTypes.some((t) => couldBeType(t, name));
}

export function isReferenceType(type: ts.Type): type is ts.TypeReference {
    return tsutils.isTypeFlagSet(type, ts.TypeFlags.Object) &&
        tsutils.isObjectFlagSet(type as ts.ObjectType, ts.ObjectFlags.Reference);
}

export function isType(type: ts.Type, name: string | RegExp): boolean {
    if (!type.symbol) {
        return false;
    }
    return (typeof name === "string") ?
        (type.symbol.name === name) :
        Boolean(type.symbol.name.match(name));
}

export function isUnionType(type: ts.Type): type is ts.UnionType {
    return tsutils.isTypeFlagSet(type, ts.TypeFlags.Union);
}

export function getClassesWithAnnotation(sourceFile: ts.SourceFile, annotationName: string): ts.Node[] {
    const componentAnnotations = tsquery(
        sourceFile,
        `ClassDeclaration Decorator CallExpression Identifier[name='${annotationName}']`
    );

    return componentAnnotations.map(ca => ca.parent.parent.parent);
}

export function hasImport(sourceFile: ts.SourceFile, moduleName: string, namedImport: string): boolean {
    let importFound = false;
    const angularCoreImports = tsquery(
        sourceFile,
        `ImportDeclaration StringLiteral[value='${moduleName}']`
    );

    angularCoreImports.forEach(stringLiteral => {
        const componentImports = tsquery(
            stringLiteral.parent,
            `NamedImports Identifier[name='${namedImport}']`
        );
        if (componentImports.length > 0) {
            importFound = true;
        }
    });

    return importFound;
}

export function getObservableSubscribeExpression(node: ts.Node, program: ts.Program) {
    const typeChecker = program.getTypeChecker();

    const propertyAccessExpressions = tsquery(
        node,
        `CallExpression PropertyAccessExpression[name.name="subscribe"]`
    );

    const subscribeExpressions: ts.Node[] = [];
    propertyAccessExpressions.forEach(node => {
        const propertyAccessExpression = node as ts.PropertyAccessExpression;
        const type = typeChecker.getTypeAtLocation(propertyAccessExpression.expression);
        if (couldBeType(type, "Observable")) {
            subscribeExpressions.push(node);
        }
    });
    return subscribeExpressions;
}
