/**
 * Generated using theia-extension-generator
 */
import { CommandContribution } from '@theia/core';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { ContainerModule } from '@theia/core/shared/inversify';
import { HelloWorldCommandContribution, HelloWorldFrontendApplicationContribution } from './hello-world-contribution';
export default new ContainerModule((bind, unbind, isBound, rebind) => {
    // add your contribution bindings here
    bind(CommandContribution).to(HelloWorldCommandContribution);
    // bind(MenuContribution).to(HelloWorldMenuContribution);
    bind(FrontendApplicationContribution).to(HelloWorldFrontendApplicationContribution);
});
