# ring-vscode

Ring-VsCode is an extension for [ring!](https://github.com/AccountTechnologies/ring) - a service launcher and monitor designed to help teams during the transition from the legacy into the cloud.

## Features

Hit `CTRL+R R` to sync to a running instance of Ring.

## Requirements

It requires the latest version of the [ring! dotnet cli tool](https://www.nuget.org/packages/ATech.Ring.DotNet.Cli).

## Extension Settings

ring.serverUrl: ws://localhost:7999/ws

## Known Issues

* The extension does not start Ring automatically yet
* Does not support debugging yet

## Release Notes

### 0.0.6

Removed aggressive recovery on unhealthy.

### 0.0.5

Quick and dirty support for debugging.

### 0.0.4

* Made the Runnables View context commands available via Command Palette with a pick list.
* Made the Runnables View show up on sync

* Added the following commands:
    * start/stop runnable
    * open in terminal (runnable working dir)
 
### 0.0.3

Fixed restarting runnables.
Renamed the misleading "open folder" command to "open folder in VS Code".
