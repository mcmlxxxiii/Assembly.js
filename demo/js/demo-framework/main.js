define([
    'Assembly',
    './features/LeveragingRequirejs',
    './features/requirejs_Routing',
    './features/requirejs_Settings',
    './features/requirejs_ActionHandling',
    'Assembly/contrib/features/Middleware',
    'Assembly/contrib/features/AppInit',
    'Assembly/contrib/features/Navigation',
    'Assembly/contrib/features/RequestHandling'],

function (Assembly) {

    var DemoFramework = Assembly.createFramework(function () {

        this.useFeature('Core', { containerElement: 'div' });
        this.useFeature('Leveraging_RequireJS');
        this.useFeature('Middleware');
        this.useFeature('Routing__RequireJS');
        this.useFeature('Request_Handling');
        this.useFeature('Settings__RequireJS');
        this.useFeature('Navigation');
        this.useFeature('Action_Handling__RequireJS');
        this.useFeature('App_Init');

        this.describeAppInitializeProcess(function () {
            this.step(10, 'Add_Base');
            this.step(10, 'Leverage_RequireJS');
            this.step(20, 'Add_Middleware_Engine');
            this.step(20, 'Add_Routing');
            this.step(20, 'Add_Request_Handling');
            this.step(20, 'Add_Settings__RequireJS');
            this.step(30, 'Add_Navigation');
            this.step(30, 'Add_Action_Handling');
            this.step(40, 'Add_App_Init');
            this.step(50, 'Start_Middleware_Engine');
        });
    });

    return DemoFramework;
});
