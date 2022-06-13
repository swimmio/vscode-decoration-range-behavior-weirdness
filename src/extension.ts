import path = require('path');
import * as vscode from 'vscode';
import DecorationProvider from './decorationProvider';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(new DecorationProvider(context));

	context.subscriptions.push(vscode.commands.registerCommand('vscode-decoration-range-behavior-weirdness.wat', () => {
		vscode.window.showInformationMessage('WAT!!!');
	}));
}

export function deactivate() {}
