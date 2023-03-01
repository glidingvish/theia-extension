import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, CommandService, MenuContribution, MenuModelRegistry, MessageService } from '@theia/core/lib/common';
import {TerminalService} from '@theia/terminal/lib/browser/base/terminal-service';
import {MiniBrowserCommands} from '@theia/mini-browser/lib/browser/mini-browser-open-handler'
import { CommonMenus, FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
export const HelloWorldCommand: Command = {
    id: 'HelloWorld.command',
    label: 'Run App'
};

@injectable()
export class HelloWorldCommandContribution implements CommandContribution {
    @inject(TerminalService) private readonly terminalService: TerminalService;
    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(HelloWorldCommand, {
            execute: async () => {
                // this.messageService.info('Hello World!')
                // this.commandService.executeCommand()
                let terminalWidget = await this.terminalService.newTerminal({title:"Run app terminal"});
                await terminalWidget.start();
                terminalWidget.sendText("npm start\n")
                await this.terminalService.open(terminalWidget);
                
                // registry.executeCommand(TerminalCommands.NEW.id,"ping bing.com")
                registry.executeCommand(MiniBrowserCommands.OPEN_URL.id,'localhost:3000')
                this.messageService.showProgress({text:"Loading your app",options:{cancelable:true,timeout:5}});
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
    @inject(TerminalService) private readonly terminalService: TerminalService;
    @inject(MessageService) private readonly messageService: MessageService;
    @inject(CommandService) private readonly commandService: CommandService;
    @inject(FrontendApplicationStateService) protected readonly stateService: FrontendApplicationStateService;
    // async initializeLayout(): Promise<void> {
    //     console.log("************** initializing ************************");
    //      // Open a terminal in the bottom panel
    //     const terminal = await this.terminalService.newTerminal({title:"some command will run here"});
    //     terminal.start();
    //     this.terminalService.open(terminal);
    //     terminal.sendText("echo 'hi glider.ai'\n");
    //     this.messageService.showProgress({text:"Loading your app",options:{cancelable:true,timeout:5}});
    // }
    async onStart(app: FrontendApplication): Promise<void> {
        this.stateService.reachedState('ready').then(
            async () => {
                // console.log("+++++++++++ on state ready ++++++++++++++");
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

@injectable()
export class HelloworldFrontendApplication extends FrontendApplication {

    @inject(TerminalService) private readonly terminalService: TerminalService;
    @inject(MessageService) private readonly messageService: MessageService;
    protected async createDefaultLayout(): Promise<void> {
        // Initialize the default layout for search-in-workspace, git, etc.
        await super.createDefaultLayout();
        console.log("************** hooking ************************");
        this.messageService.showProgress({text:"hook Loading your app",options:{cancelable:true,timeout:5}});
        // Open a terminal in the bottom panel
        const terminal = await this.terminalService.newTerminal({});
        terminal.start();
        this.terminalService.open(terminal);
        terminal.sendText("echo 'hi glider.ai'\n");
    }

}
