var DemoFramework = Assembly.createFramework(function () {

    this.useFeature('Core', { containerElement: 'div' });
    this.useFeature('Middleware');
    this.useFeature('Request_Handling');
    this.useFeature('Navigation');
    this.useFeature('Routing');
    this.useFeature('Action_Handling');
    this.useFeature('App_Init');

    this.describeAppInitializeProcess(function () {
        this.step(10, 'Add_Base');
        this.step(10, 'Add_Routing');
        this.step(20, 'Add_Middleware_Engine');
        this.step(20, 'Add_Request_Handling');
        this.step(30, 'Add_Navigation');
        this.step(30, 'Add_Action_Handling');
        this.step(40, 'Add_App_Init');
        this.step(50, 'Start_Middleware_Engine');
    });
});
