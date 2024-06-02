import path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("lcov-localviewer.helloWorld", () => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel(
        "lcov-localviewer",
        "LCov Local Viewer",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      // And set its HTML content
      panel.webview.html = getWebviewContent(
        panel.webview,
        context.extensionUri
      );
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
  const scriptLocalUri = vscode.Uri.file(
    path.join(extensionUri.path, "build", "webview", "index.js")
  );
  const src = webview.asWebviewUri(scriptLocalUri);
  const nonce = getNonce();

  return `
		<!DOCTYPE html>
		<html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta
        http-equiv="Content-Security-Policy" 
        content="default-src 'none'; img-src ${webview.cspSource} https:; script-src ${webview.cspSource}; style-src ${webview.cspSource};"
      >
    </head>
    <body>
      <div id="root">HogeHoge</div>
      <script type="module" nonce="${nonce}" src="${src}"></script>
    </body>
		</html>
	`;
}
