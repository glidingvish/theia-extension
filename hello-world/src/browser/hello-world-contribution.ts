import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from '@theia/core/lib/common';
import {TerminalService} from '@theia/terminal/lib/browser/base/terminal-service';
import {MiniBrowserCommands} from '@theia/mini-browser/lib/browser/mini-browser-open-handler'
import { CommonMenus } from '@theia/core/lib/browser';
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
