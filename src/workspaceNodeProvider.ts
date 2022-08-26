import * as vscode from 'vscode';
import * as path from 'path';
import {detailsKeys} from './detailsKeys'

export interface IRunnableInfo
{
    id:string;
    type:string;
    declaredIn:string[];
    state:RunnableState;
    details: { [index:string]:any };
}

export type ServerState = 'UNKNOWN' | 'IDLE' | 'LOADED' | 'RUNNING';
export type WorkspaceState = 'UNKNOWN' | 'IDLE' | 'HEALTHY' | 'DEGRADED';
export type RunnableState =  'ZERO' | 'INITIATED' | 'STARTED' | 'HEALTH_CHECK' | 'HEALTHY' |  'DEAD' | 'RECOVERING';

export interface IWorkspaceInfo {
    path:string;
    runnables:IRunnableInfo[];
    flavours:string[];
    currentFlavour: string;
    serverState: ServerState;
    workspaceState:  WorkspaceState;
}

export class WorkspaceNode extends vscode.TreeItem {
    public children:RunnableNode[] = [];
    public id:string;
    constructor(
                public workspaceInfo:IWorkspaceInfo,
                protected context:vscode.ExtensionContext
                )
    {
        super(workspaceInfo.path);
        super.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        this.contextValue = "ring.workspace";
        this.iconPath = WorkspaceNode.getIconPath(workspaceInfo.workspaceState, context);
        this.children = workspaceInfo.runnables.map(r => new RunnableNode(r, context));
        this.id = workspaceInfo.path;
    }

    static getIconPath(state:WorkspaceState, context:vscode.ExtensionContext)
     {
        const svg = state === 'DEGRADED' ? "recovering.svg" :
                    state === 'HEALTHY' ? "healthy.svg" :
                    state === 'IDLE' ? "stopped.svg" : "";

        return context.asAbsolutePath(path.join("media", "status", svg));
     }
}

export class RunnableNode extends vscode.TreeItem {

    public id:string;
    constructor(public runnable:IRunnableInfo, protected context:vscode.ExtensionContext) {
        super(runnable.id);
        this.runnable = runnable;
        this.label = `${runnable.details[detailsKeys.friendlyName] ?? runnable.id}`;
        this.tooltip = `${runnable.id}`;
        this.contextValue = "," + Object.keys(runnable.details).reduce((m, x) => m + "," + x, '') + ",";
        this.iconPath = RunnableNode.getIconPath(context, runnable.state);
        this.id = runnable.id;
     }
     static getIconPath(context:vscode.ExtensionContext, State:RunnableState)
     {
        const svg =  State === 'INITIATED' ? "initiated.svg" :
        State ==='STARTED' ? "started.svg" :
        State ==='RECOVERING' ? "recovering.svg" :
        State ==='HEALTH_CHECK' ? "healthcheck.svg" :
        State ==='HEALTHY' ? "healthy.svg" :
        State ==='DEAD' ? "dead.svg" :
        State ==='ZERO' ? "zero.svg" : "";
        return context.asAbsolutePath(path.join("media", "status", svg));
     }

}

export type RingNode = WorkspaceNode | RunnableNode;

export class WorkspaceProvider implements vscode.TreeDataProvider<RingNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<RingNode | null> = new vscode.EventEmitter<RingNode | null>();
    readonly onDidChangeTreeData: vscode.Event<RingNode | null> = this._onDidChangeTreeData.event;
    private root:WorkspaceNode;

    public static emptyWorkspace:IWorkspaceInfo = {runnables:[], flavours: [], currentFlavour: "", path:"Not loaded", serverState: 'UNKNOWN', workspaceState: 'UNKNOWN'}

    constructor(private context: vscode.ExtensionContext)
    {
        this.root = new WorkspaceNode(WorkspaceProvider.emptyWorkspace, context);
    }

    getTreeItem(element: RingNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: RingNode | undefined): vscode.ProviderResult<RingNode[]> {

        if (element)
        {
            const wsNode = <WorkspaceNode>element;
            return wsNode ? wsNode.children : [];
        }
        else
        {
            return [this.root];
        }
    }

    getRunnable(id:string) {return this.root.children.find(r => r.id === id);}

        async updateRunnable(id:string, state: RunnableState ){
        const r = this.getRunnable(id);
        if (!r) {return;}

        r.runnable.state = state;
        r.iconPath = RunnableNode.getIconPath(this.context, state);
        this._onDidChangeTreeData.fire(r);
    }

    updateWorkspace(wsInfo:IWorkspaceInfo)
    {
        this.root = new WorkspaceNode(wsInfo, this.context);
        this._onDidChangeTreeData.fire(null);
    }

    resetWorkspace()
    {
        this.root = new WorkspaceNode(WorkspaceProvider.emptyWorkspace, this.context);
    }

    current() {return this.root.workspaceInfo;}
}
