/**
 * Author: Rushabh Shah, Rushikesh Nere
 * (c) Midasfusion.com
 * License: MidasBlue
 */

/** @description
 *This module provides a utility for defining angular application,configuring it and injecting
 *different services,directives and event listeners.
 *This module includes logic for redirecting pages and setting search, post and profile link paths.  
 */

//Defines an angular module for our application and injects required directives to use in the application
var futureMakerApp = angular.module('app.futuremaker', ['ngCookies', 'ngResource', 'ngRoute',"ngTable", 'ngMessages', 'ngSanitize', 'selectize', '720kb.datepicker', 'ui.bootstrap', 'app.futureMakerApp.login', 'chart.js', 'ngAlertify','angular-thumbnails']);
futureMakerApp.config(
        function ($compileProvider)
        {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob|chrome-extension):/);

            // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
        }
);

//This starts the application and event listeners are injected in it
futureMakerApp.run(function ($rootScope, $route, $location, $cookieStore, $templateCache) {

    // Registers listener to watch route changes
    $rootScope.$on("$locationChangeStart", function (event, next, current, userService) {

        //On refreshing page, keeps username of logged in user
        if ($cookieStore.get("futuremaker")) {
            $rootScope.$broadcast('showUserName', {
                menu: 'Profile'
            });
        }

        var restrictedPage = $.inArray($location.path(), ['/home','/refer', '/home/feedback', '/contact-us', '/accept', '/reject', '/login',  '/profile', '/viewProfile', '/resetpass', '/verifyaccount', '/home/user-profile', '/home/forgot-pass', '/home/organisation-signup-form', '/home/institute-signup-form', '/home/student-signup-form', '/home/student-signup-form/upload-resume', '/home/mentor-signup-form', '/home/mentor-signup-form/upload-resume']) === -1;

        if (restrictedPage && (!$cookieStore.get("futuremaker")))
        {
            $location.path('/home');
        }
    });
});

//Define Routing for application,contollers associated to html forms and active tabs in navigation bar. This is application configuration
futureMakerApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
                when('/#', {
                    templateUrl: 'templates/base.html',
                    activetab: 'Home'
                }).
                when('/home', {
                    templateUrl: 'templates/base.html',
                    activetab: 'Home'
                })
                .when('/home/dashboard', {
                    templateUrl: 'templates/dashboard.html',
                    activetab: 'Home'
                })
                .when('/matchingOpportunities', {
                    templateUrl: 'templates/seeMatchingOpportunities.html',
                    activetab: 'Home'
                })
                .when('/matchingOpportunities/viewDetail', {
                    templateUrl: 'templates/oppDetail.html',
                    activetab: 'Home'
                })
                .when('/home/changeUserType', {
                    templateUrl: 'templates/changeUserType.html',
                    activetab: 'Home'
                })
                .when('/contact-us', {
                    templateUrl: 'templates/contactus.html',
                    activetab: 'Home'
                })
                .when('/home/feedback', {
                    templateUrl: 'templates/feedback.html',
                    activetab: 'Home'
                })
                .when('/accept', {
                    templateUrl: 'templates/contactRequest.html',
                    activetab: 'Home'
                })
                .when('/reject', {
                    templateUrl: 'templates/contactRequest.html',
                    activetab: 'Home'
                })
                .when('/notify', {
                    templateUrl: 'templates/notificationDemo.html',
                    activetab: 'Home'
                })
                .when('/home/updatepass', {
                    templateUrl: 'templates/updatePassword.html',
                    activetab: 'Home'
                })
                .when('/home/saved-search', {
                    templateUrl: 'templates/saved-search.html',
                    activetab: 'Home'
                })
                .when('/home/update-resume', {
                    templateUrl: 'templates/updateResume.html',
                    activetab: 'Home'
                })
                .when('/home/view-resume', {
                    templateUrl: 'templates/viewResume.html',
                    activetab: 'Home'
                })
                .when('/home/applied-opportunities', {
                    templateUrl: 'templates/applied-opportunities.html',
                    activetab: 'Home'
                })
                .when('/home/applied-candidates', {
                    templateUrl: 'templates/applied-candidates.html',
                    activetab: 'Home'
                })
                .when('/home/personal-folders', {
                    templateUrl: 'templates/personal-folders.html',
                    activetab: 'Home'
                })
                .when('/home/folder-contents', {
                    templateUrl: 'templates/folder-content.html',
                    activetab: 'Home'
                })
                .when('/profile', {
                    templateUrl: 'templates/preprofile.html',
                    activetab: 'Login'
                })
                .when('/login', {
                    templateUrl: 'templates/login.html',
                    activetab: 'Login'
                })
                .when('/refer', {
                    templateUrl: 'templates/referEmails.html',
                    activetab: 'Home'
                })
                .when('/viewProfile', {
                    templateUrl: 'templates/viewProfile.html',
                    activetab: 'Login'
                })
                .when('/home/forgot-pass', {
                    templateUrl: 'templates/forget-pass.html',
                    activetab: 'Sign Up'
                })
                .when('/verifyaccount', {
                    templateUrl: 'templates/verifyAccount.html',
                    activetab: 'Sign Up'
                })
                .when('/resetpass', {
                    templateUrl: 'templates/resetpass.html',
                    activetab: 'Sign Up'
                })
                .when('/home/user-profile', {
                    templateUrl: 'templates/signup-form.html',
                    activetab: 'Sign up'

                })
                .when('/home/organisation-signup-form', {
                    templateUrl: 'templates/profile.html',
                    activetab: 'Organisation'
                })
                .when('/home/institute-signup-form', {
                    templateUrl: 'templates/profile.html',
                    activetab: 'Institute'
                })
                .when('/home/student-signup-form', {
                    templateUrl: 'templates/profile.html',
                    activetab: 'Student'
                })
                .when('/home/student-signup-form/upload-resume', {
                    templateUrl: 'templates/upload-resume.html',
                    activetab: 'Student'
                })
                .when('/home/mentor-signup-form', {
                    templateUrl: 'templates/profile.html',
                    activetab: 'Mentor'
                })
                .when('/home/mentor-signup-form/upload-resume', {
                    templateUrl: 'templates/upload-resume.html',
                    activetab: 'Mentor'
                })
                .when('/org-search', {
                    templateUrl: 'templates/org-search.html',
                    activetab: 'Search'
                })
                .when('/search-result', {
                    templateUrl: 'templates/search-result.html',
                    activetab: 'Search'
                })
                .when('/folder-results', {
                    templateUrl: 'templates/folder-results.html',
                    activetab: 'Search'
                })

                .when('/home/email-template', {
                    templateUrl: 'templates/emailTemplate.html',
                    activetab: 'Email Templates'
                })
                .when('/home/email-template/write-template', {
                    templateUrl: 'templates/writeTemplate.html',
                    activetab: 'Email Templates'
                })
                .when('/home/organisation', {
                    templateUrl: 'templates/org-search-post-selection.html', //default search(campus recruitment)
                    activetab: 'Search'

                })
                .when('/home/organisation/campus-form', {
                    templateUrl: 'templates/org-search-campus.html',
                    activetab: 'Search',
                })
                .when('/home/institute-selection', {
                    templateUrl: 'templates/institute-selection.html',
                    activetab: 'Education Institute'
                })
                .when('/home/student', {
                    templateUrl: 'templates/student-search.html',
                    activetab: 'Student'
                })
                .when('/home/SME', {
                    templateUrl: 'templates/SME-search.html',
                    activetab: 'SME/Mentor'
                })
                .when('/home/org-post/org-posted', {
                    templateUrl: 'templates/oppPosted.html',
                    activetab: 'Post'
                })
                .when('/home/inst-posted', {
                    templateUrl: 'templates/instOppPosted.html',
                    activetab: 'Post'
                })
                .when('/home/mentor-posted', {
                    templateUrl: 'templates/mentorOppPosted.html',
                    activetab: 'Post'
                })
                .when('/home/stud-posted', {
                    templateUrl: 'templates/studOppPosted.html',
                    activetab: 'Post'
                })
                .when('/home/edit-post-job', {
                    templateUrl: 'templates/edit-post-job.html',
                    activetab: 'Post'
                })
                .when('/home/edit-post-internship', {
                    templateUrl: 'templates/edit-post-internship.html',
                    activetab: 'Post'
                })
                .when('/home/edit-post-menteeship', {
                    templateUrl: 'templates/edit-menteeship.html',
                    activetab: 'Post'
                })
                .when('/home/edit-post-research', {
                    templateUrl: 'templates/edit-post-internship.html',
                    activetab: 'Post'
                })
                .when('/home/org-edit-post-mentorship', {
                    templateUrl: 'templates/org-edit-post-mentorship.html',
                    activetab: 'Post'
                })
                .when('/home/mentor-for-stud-edit', {
                    templateUrl: 'templates/mentor-edit.html',
                    activetab: 'Post'
                })
                .when('/home/mentor-for-inst-edit', {
                    templateUrl: 'templates/mentor-edit.html',
                    activetab: 'Post'
                })
                .when('/home/event-for-inst-edit', {
                    templateUrl: 'templates/event-edit.html',
                   activetab: 'Post'
                })
                .when('/home/speaker-for-inst-edit', {
                    templateUrl: 'templates/speaker-edit.html',
                    activetab: 'Post'
                })
                .when('/home/org-copy-post-job', {
                    templateUrl: 'templates/org-copy-post-job.html',
                    activetab: 'Post'
                })
                .when('/home/save-as-template', {
                    templateUrl: 'templates/saveAsTemplate.html',
                    activetab: 'Post'
                })
                .when('/home/org-post/campus-form', {
                    templateUrl: 'templates/org-post-job.html',
                    activetab: 'Post'

                })
                .when('/home/org-post/internship-form', {
                    templateUrl: 'templates/org-post-intern.html',
                    activetab: 'Internship'
                })
                .when('/home/org-post/research-project-form', {
                    templateUrl: 'templates/org-post-research-project.html',
                    activetab: 'Research Project'
                })
                .when('/home/org-post/mentorship-form', {
                    templateUrl: 'templates/org-post-mentorship.html',
                    activetab: 'Mentorship'
                })
                .when('/home/update-individual-profile', {
                    templateUrl: 'templates/updateIndProfile.html',
                    activetab: 'Profile'
                })
                .when('/home/update-institute-profile', {
                    templateUrl: 'templates/updateInstProfile.html',
                    activetab: 'Profile'
                })
                .when('/home/inst-search-post-selection', {
                    templateUrl: 'templates/inst-search-post-selection.html',
                    activetab: 'Search'
                })
                .when('/home/mentor-search-post-selection', {
                    templateUrl: 'templates/mentor-search-post-selection.html',
                    activetab: 'Search'
                })
                .when('/home/update-org-profile', {
                    templateUrl: 'templates/updateOrgProfile.html',
                    activetab: 'Profile'
                })
                .when('/home/update-mentor-profile', {
                    templateUrl: 'templates/updateMentorProfile.html',
                    activetab: 'Profile'
                })
                .when('/home/institute-selection/mentor-for-inst', {
                    templateUrl: 'templates/mentor-for-inst.html',
                    activetab: 'Post'
                })
                .when('/home/institute-selection/event-for-inst', {
                    templateUrl: 'templates/event-for-inst.html',
                    activetab: 'Post'
                })
                .when('/home/institute-selection/speaker-for-inst', {
                    templateUrl: 'templates/speaker-for-inst.html',
                    activetab: 'Post'
                })
                .when('/home/institute-selection/student-availability', {
                    templateUrl: 'templates/student-availability.html',
                    activetab: 'Post'
                })
                .when('/home/post-selection', {
                    templateUrl: 'templates/post-selection.html',
                    activetab: 'Post'
                })
                .when('/home/inst-post-selection', {
                    templateUrl: 'templates/inst-post-selection.html',
                    activetab: 'Post'
                })
                .when('/home/mentor-post-selection', {
                    templateUrl: 'templates/mentor-post-selection.html',
                    activetab: 'Post'
                })
                .when('/home/post-opportunity', {
                    templateUrl: 'templates/commonPostOpportunity.html',
                    activetab: 'Post'
                })
                .when('/home/posted-opportunity', {
                    templateUrl: 'templates/commonPostedOpportunities.html',
                    activetab: 'Post'
                })
                .when('/home/search', {
                    templateUrl: 'templates/commonSearchOpportunity.html',
                    activetab: 'Post'
                })
                .when('/home/post-selection/org-post-internship', {
                    templateUrl: 'templates/org-post-internship.html',
                    activetab: 'Post'
                })
                .when('/home/post-selection/org-post-research', {
                    templateUrl: 'templates/org-post-research.html',
                    activetab: 'Post'
                })
                .when('/home/post-selection/org-post-internship', {
                    templateUrl: 'templates/org-post-internship.html',
                    activetab: 'Post'
                })
                .when('/home/post-selection/org-post-mentorship', {
                    templateUrl: 'templates/org-post-mentorship.html',
                    activetab: 'Post'
                })
                .when('/home/post-selection/org-post-job', {
                    templateUrl: 'templates/org-post-job.html',
                    activetab: 'Post'
                })
                .when('/home/mentor-for-stud', {
                    templateUrl: 'templates/mentor-for-stud.html',
                    activetab: 'Post'
                })
                .when('/home/search-options', {
                    templateUrl: 'templates/search-options.html',
                    activetab: 'Search'
                })
                .when('/home/mentor-search-options', {
                    templateUrl: 'templates/mentor-search-options.html',
                    activetab: 'Search'
                })
                .when('/home/SME-post', {
                    templateUrl: '',
                    activetab: 'Post'
                })
                .otherwise({
                    redirectTo: '/home'
                });
    }]);

//This is controller for navigation bar which defines logic for events on menu and submenu clicks
futureMakerApp.controller('NavController', function ($scope, $location, $window, $cookieStore, userService, $http, CONSTANTS) {

    $scope.states = {};
    $scope.states.activeMenuItem = 'home';
    $scope.menuItems = [{
            id: 'menuItem1',
            title: 'Home',
            template: '#/home',
            show: true
//            color:'#000'
        }, {
            id: 'menuItem2',
            title: 'Search',
            template: '#/login',
//             color:'#000',
            submenuItems: [
                {
                    id: 'submenuItem1',
                    title: 'Saved Search',
                    template: '#/login'
                }
            ],
            show: true
        }, {
            id: 'menuItem3',
            title: 'Post Opportunities',
            template: '#/login',
            submenuItems: [
                {
                    id: 'submenuItem1',
                    title: 'Posted Opportunities',
                    template: '#/login'
                }
            ],
            show: true
//            color:'#000'
        }, {
            id: 'menuItem4',
            title: 'Login',
            template: '#/login',
            show: true
//            color:'#000'
        }, {
            id: 'menuItem5',
            title: 'More',
            template: '#/login',
            submenuItems: [
                {
                    id: 'submenuItem1',
                    title: 'Edit Profile',
                    template: '#'
                },
                {
                    id: 'submenuItem2',
                    title: 'Email Templates',
                    template: '#/home/email-template'
                }
            ],
            show: false
//            color:'#000'
        },
        {
            id: 'menuItem6',
            title: 'Free Sign Up',
            template: '#/home/user-profile',
            show: true,
            color: '#FFA500',
            bold: 'bold',
            size: '12px'
        }];




    $scope.$on('showUserName', function (event, args) {
        $scope.user = userService.getUser();
        //while signup and login take firstname for mentor and student as an acknowledgement and name of organization and institute to display on navihation bar  
        $scope.loggedUserMessage = "logout, " + (($scope.user.name));
        $scope.menuItems[$scope.menuItems.length - 3].title = $scope.loggedUserMessage;
        $scope.menuItems[$scope.menuItems.length - 2].show = true;
        $scope.menuItems[$scope.menuItems.length - 1].show = false;
        $scope.states.activeItem = args.menu;

        $scope.setProfileLinkPath();
        $scope.setSearchLinkPath();
      
        $scope.setPostOpportunityPath();
        $scope.setSearchOpportunityPath();
        $scope.setPostedOpportunityPath();
        $scope.menuItems[$scope.menuItems.length - 2].template = "#/home";
        $scope.menuItems[0].template = "#/home/dashboard";
    });

    //setting a search link path
    $scope.setSearchLinkPath = function () {
        var userType = $scope.user.userType;
        var pathToRedirect = "#org-search";
        switch (userType) {
            case 'organisation':
                pathToRedirect = "#org-search";
                break;
            case 'student':
                pathToRedirect = "#/home/student";
                break;
            case 'institue':
                pathToRedirect = "#";
                break;
            default:
                pathToRedirect = "#";
                break;
        }

        $scope.menuItems[1].template = pathToRedirect;
    };

    //setting a profile link path
    $scope.setProfileLinkPath = function () {
        var userType = $scope.user.userType;

        var pathToRedirect;

        switch (userType) {
            case 'student':
                pathToRedirect = "#/home/update-individual-profile";
                break;
            case 'organisation':
                pathToRedirect = "#/home/update-org-profile";
                break;
            case 'institute':
                pathToRedirect = "#/home/update-institute-profile";
                break;
            case 'mentor':
                pathToRedirect = "#/home/update-mentor-profile";
                break;
            default:
                pathToRedirect = "#";
                break;
        }
        $scope.menuItems[4].submenuItems[0].template = pathToRedirect;
        

    };
    $scope.setPostOpportunityPath = function () {

        $scope.menuItems[2].template = '#/home/post-opportunity';
        $scope.menuItems[3].template = '/home';

    };
    $scope.setSearchOpportunityPath = function () {
        
        $scope.menuItems[1].template = '#/home/search';
        $scope.menuItems[1].submenuItems[0].template = '#/home/saved-search';

    };
    $scope.setPostedOpportunityPath = function () {
        
        $scope.menuItems[2].submenuItems[0].template = '#/home/posted-opportunity';

    };

    //setting a post link path
   

    // hide/show log in modal
    $scope.openLoginModal = function (menuItem) {
        if (!$cookieStore.get("futuremaker"))
        {
            if (menuItem.menuItem.title === 'Search' || menuItem.menuItem.title === 'Post Opportunities' || menuItem.menuItem.title === 'More' || menuItem.menuItem.title === 'Login') {
                $location.url("/login");
            }
        } else {
            switch (menuItem.menuItem.title) {
                case 'Login':
                    $location.path("/home");
                    break;
                    //check authentication when user try to access search pages 
//                case 'Search Opportunities':
                case 'More':
//                case 'Post Opportunities':
                    if (menuItem.submenuItem.title !== undefined) {
                        switch (menuItem.submenuItem.title) {
                     case 'Edit Profile':
                                break;

                            case 'Email Templates':
                                $location.path("#/home/email-template");
                                break;
                            default:
                                break;
                        }
                    }
                    break;

                    //Removes cookies after logout
                case $scope.loggedUserMessage:
                case 'logout':
                    $cookieStore.remove("futuremaker");
                    $location.path("/");
                    $window.location.reload();
                    break;

                default:
                    break;
            }
        }
    };

    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) === path) {
            return 'active';
        } else {
            return '';
        }
    };
});


