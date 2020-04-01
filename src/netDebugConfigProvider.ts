import * as vscode from 'vscode';
import * as model  from './workspaceNodeProvider'; 
import * as main  from './extension'; 

export class NetDebugConfigProvider implements vscode.DebugConfigurationProvider
{
    constructor(private wsProvider:model.WorkspaceProvider)
    {
    }

     resolveDebugConfiguration(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration> {

        if (folder && !config.name)
        {

            const r = this.wsProvider.getRunnable(folder.name);
            if (r)
            {

                const cfg = main.getConfiguration(r.runnable);
                if (cfg) {config = cfg;}
            }
            else{
                vscode.window.showInformationMessage("No runnable loaded");
            return undefined;
            }
		  
        }
        else{
            vscode.window.showInformationMessage("No folders loaded");
            return undefined;
        }
		return config;
    }
    
    provideDebugConfigurations?(folder: vscode.WorkspaceFolder | undefined, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration[]>
    {
        if (folder)
        {

            const r = this.wsProvider.getRunnable(folder.name);
            if (r)
            {
                var cfg = main.getConfiguration(r.runnable);
                if (cfg) {return [cfg];}
                else {return [];}
            }
        }{
            return [];
        }
            
    }
}