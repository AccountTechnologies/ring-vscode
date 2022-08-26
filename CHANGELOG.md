# Change Log

All notable changes to the "ring-vscode" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 0.2.0
### Changed
- BREAKING: only supports Ring >= v4

### Added
- Support for Ring v4 workspace flavours
- Add 'Reveal in Octant' option for Kustomize runnables (needs a running Octant)
- Support for runnables `friendlyName`

## 0.1.3
### Changed
- Added filtering of available actions in the runnable view context menu depending on available data

## 0.0.6
### Fixed
- Removed aggressive recovery on unhealthy.

## 0.0.5
### Added
- Quick and dirty support for debugging.

## 0.0.4
### Added
- commands:
  - start/stop runnable
  - open in terminal (runnable working dir)
- Made the Runnables View context commands available via Command Palette with a pick list.
- Made the Runnables View show up on sync
 
## 0.0.3
### Fixed
- Fixed restarting runnables.
- Renamed the misleading "open folder" command to "open folder in VS Code".
