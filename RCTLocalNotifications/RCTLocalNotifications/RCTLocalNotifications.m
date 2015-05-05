//
//  RCTLocalNotifications.m
//  RCTLocalNotifications
//
//  Created by Christian Bak on 05/05/15.
//  Copyright (c) 2015 Christian Bak. All rights reserved.
//

#import "RCTLocalNotifications.h"
#import <UIKit/UIKit.h>
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@implementation RCTLocalNotifications

RCT_EXPORT_MODULE();

NSString * const NotificationCategoryIdent  = @"ACTIONABLE";
NSString * const NotificationActionOneIdent = @"ACTION_ONE";
//NSString * const NotificationActionTwoIdent = @"ACTION_TWO";

@synthesize bridge = _bridge;

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onJoinMeetingAction:) name: @"JoinMeeting" object: nil];
    }
    return self;
}

- (void) onJoinMeetingAction:(NSNotification*) notification {
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"EventReminder" body: notification.userInfo ];
}

- (void) onJoinMeetingAction {
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"EventReminder" body: nil ];
}


RCT_EXPORT_METHOD(showMessage:(NSString *)body title:(NSString *)title alertAction:(NSString *)alertAction customInfo:(NSDictionary *) customInfo)
{
    UILocalNotification *notification = [[UILocalNotification alloc] init];
    if (notification)
    {
        notification.repeatInterval = 0;
        notification.category = NotificationCategoryIdent;
        notification.alertTitle = title;
        notification.alertBody = body;
        notification.alertAction = alertAction;
        notification.hasAction = true;
        notification.userInfo = customInfo;

        [[UIApplication sharedApplication] presentLocalNotificationNow:notification];
    }
}


RCT_EXPORT_METHOD(registerForNotification:(RCTResponseSenderBlock)callback) {
    
    UIMutableUserNotificationAction *action1;
    action1 = [[UIMutableUserNotificationAction alloc] init];
    [action1 setActivationMode:UIUserNotificationActivationModeBackground];
    [action1 setTitle:@"Join Meeting"];
    [action1 setIdentifier:NotificationActionOneIdent];
    [action1 setDestructive:NO];
    [action1 setAuthenticationRequired:NO];
    
    /*UIMutableUserNotificationAction *action2;
    action2 = [[UIMutableUserNotificationAction alloc] init];
    [action2 setActivationMode:UIUserNotificationActivationModeBackground];
    [action2 setTitle:@"Action 2"];
    [action2 setIdentifier:NotificationActionTwoIdent];
    [action2 setDestructive:NO];
    [action2 setAuthenticationRequired:NO];*/
    
    UIMutableUserNotificationCategory *actionCategory;
    actionCategory = [[UIMutableUserNotificationCategory alloc] init];
    [actionCategory setIdentifier:NotificationCategoryIdent];
    [actionCategory setActions:@[action1]
                    forContext:UIUserNotificationActionContextDefault];
    
    NSSet *categories = [NSSet setWithObject:actionCategory];
    UIUserNotificationType types = (UIUserNotificationTypeAlert|
                                    UIUserNotificationTypeSound|
                                    UIUserNotificationTypeBadge);

    UIUserNotificationSettings *settings;
    settings = [UIUserNotificationSettings settingsForTypes:types
                                                 categories:categories];
    
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
}


/*RCT_EXPORT_METHOD(findEvents:(RCTResponseSenderBlock)callback)
{
    NSArray *events = ...
    callback(@[[NSNull null], events]);
}*/


@end
