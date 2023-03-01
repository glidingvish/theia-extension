import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, CommandService, MenuContribution, MenuModelRegistry, MessageService } from '@theia/core/lib/common';
import {TerminalService} from '@theia/terminal/lib/browser/base/terminal-service';
import {MiniBrowserCommands} from '@theia/mini-browser/lib/browser/mini-browser-open-handler'
import { CommonMenus, FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
// import {WorkspaceService} from '@theia/workspace/src/browser/index'
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { TerminalWidget } from '@theia/terminal/lib/browser/base/terminal-widget';
export const HelloWorldCommand: Command = {
    id: 'HelloWorld.command',
    label: 'Run App'
};
@injectable()
export class HelloWorldCommandContribution implements CommandContribution {
    @inject(TerminalService) private readonly terminalService: TerminalService;
    @inject(EnvVariablesServer) protected readonly envVariableServer: EnvVariablesServer;
    @inject(MessageService) private readonly messageService: MessageService,
    constructor() { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(HelloWorldCommand, {
            execute: async () => {
                this.messageService.info('Hello glider!')
                // this.commandService.executeCommand()
                let url = (await this.envVariableServer.getValue("URL"))?.value;
                let shell_command = (await this.envVariableServer.getValue("shell_command"))?.value;
                console.log("++++ ::", url, shell_command);
                let terminalWidget: TerminalWidget;
                if(this.terminalService.lastUsedTerminal){
                    console.log(">>>>>>>>>>>>>>>>>>>using current terminal")
                    terminalWidget = this.terminalService.lastUsedTerminal;
                } else {
                    console.log(">>>>>>>>>>>>>>>>>>>NOT using current terminal")

                    terminalWidget = await this.terminalService.newTerminal({title:"Run app terminal"});
                }
                await terminalWidget.start();
                terminalWidget.sendText(shell_command+"\n")
                this.terminalService.open(terminalWidget);
                
                // registry.executeCommand(TerminalCommands.NEW.id,"ping bing.com")
                registry.executeCommand(MiniBrowserCommands.OPEN_URL.id,url)
                // this.messageService.showProgress({text:"Loading your app",options:{cancelable:true,timeout:5}});
            }
        });
    }
}

@injectable()
export class HelloWorldMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE, {
            commandId: HelloWorldCommand.id,
            label: HelloWorldCommand.label
        });
    }
}
@injectable()
export class HelloWorldFrontendApplicationContribution implements FrontendApplicationContribution {
    @inject(CommandService) private readonly commandService: CommandService;
    @inject(FrontendApplicationStateService) protected readonly stateService: FrontendApplicationStateService;
    // async initializeLayout(): Promise<void> {
    // }
    async onStart(app: FrontendApplication): Promise<void> {
        this.stateService.reachedState('ready').then(
            async () => {
                // const terminal = await this.terminalService.newTerminal({title:"some command will run here"});
                // await terminal.start();
                // this.terminalService.open(terminal);
                // terminal.sendText("echo 'hi glider.ai'\n");
                // this.messageService.showProgress({text:"Loading your app",options:{cancelable:true,timeout:5}});
                this.commandService.executeCommand(HelloWorldCommand.id);
            }
        );
    }
}

// @injectable()
// export class HelloworldFrontendApplication extends FrontendApplication {

//     @inject(TerminalService) private readonly terminalService: TerminalService;
//     @inject(MessageService) private readonly messageService: MessageService;
//     protected async createDefaultLayout(): Promise<void> {
//         // Initialize the default layout for search-in-workspace, git, etc.
//         await super.createDefaultLayout();
//         console.log("************** hooking ************************");
//         this.messageService.showProgress({text:"hook Loading your app",options:{cancelable:true,timeout:5}});
//         // Open a terminal in the bottom panel
//         const terminal = await this.terminalService.newTerminal({});
//         terminal.start();
//         this.terminalService.open(terminal);
//         terminal.sendText("echo 'hi glider.ai'\n");
//     }

// }
