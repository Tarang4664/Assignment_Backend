var login = angular.module('app.futureMakerApp.login', ['app.futuremaker']);

login.constant('SIGNUPTYPE', {
    "ORGANIZATION": "Organization",
    "INSTITUTE": "Institute",
    "STUDENT": "Student",
    "MENTOR": "Mentor"
});

//This is controller for Login which defines function to log user in and set cookies, show/hide password
login.controller('LoginController', function ($scope, $location, $resource, $window, $http, $cookieStore, CONSTANTS, userService) {

    // Set the default value of inputType
    $scope.inputType = 'password';
    $scope.passwordCheckbox = false;
    $scope.user = {
        type: '',
        username: '',
        password: ''
    };

    // This function is to Hide & show password on "Show Password" checkbox click
    $scope.hideShowPassword = function () {
        if ($scope.inputType === 'password')
        {
            $scope.inputType = 'text';
            $scope.visible = 'Hide';
        } else
        {
            $scope.inputType = 'password';
            $scope.visible = 'Show';
        }
    };

    //This function is called when user logs in
    $scope.loginUser = function () {
        $user = {};

        //This assigns user input from html to "$user" object
        $user.username = $scope.user.username;
        $user.password = $scope.user.password;

        //This authenticates user
        $authdata = utilities.Base64.encode($user.username + ':' + $user.password);
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

        //This is http request for geeting user object with API and user object as parameters
        $http.get(CONSTANTS.SERVICES.USERS, $user).success(function ($user) {

            //This sets cookies for application
            $cookieStore.put("futuremaker", $user);

            //This adds user object in userService
            userService.addUser($user);

            $scope.$emit('showUserName', {
                menu: 'home'
            });
            //set cookie expiry (works when page is refreshed by user)
            var now = new $window.Date(), //get the current date
                    // this will set the expiration to 1 hour
                    exp = new $window.Date(now.getDate() + 1);

            $cookieStore.put("futuremaker", $user, {
                expires: exp
            });

            $location.path("/home");

            $scope.closeModal();

        }).error(function (error) {
            if (error === 'Credentials are required to access this resource.')
                $scope.errorMessage = 'Username Password Invalid ';
            else
                $scope.errorMessage = error.error;
            $location.path("/login");
        });
    };

    $scope.closeModal = function () {
        $('[visible="showModal"]').modal('hide');
    };

    //This function is called when user clicks on sign up link
    $scope.signupUser = function () {
        $scope.closeModal();
    };

});

login.controller('SignupController', function ($scope, $location, $resource, $window, $http, $cookieStore, SIGNUPTYPE, CONSTANTS, INTERESTS, LOCATIONS, dropdownOptionsService, COURSES, FUNCTIONALINTEREST, STREAMS, KEYSKILLS, ITDOMAINS, NONITDOMAINS, MAJORS, userService, userContactService)
{
    //This method is used to initialize signup type
    $scope.init = function (type)
    {
        //This function is sort of private constructor for controller
        $scope.type = type;

        var addInterests;
        switch ($scope.type) {
            case(SIGNUPTYPE.ORGANIZATION):

                addInterests = [
                    {id: 6, name: 'Event Sponsorship'},
                    {id: 7, name: 'Mentorship'},
                    {id: 8, name: 'SME Consultation'}
                ];
                break;
            case(SIGNUPTYPE.MENTOR):

                $scope.locationConfig.maxItems = 3;
                $scope.itDomainsConfig.maxItems = 3;
                $scope.nonItDomainsConfig.maxItems = 3;
                $scope.functionalInterestConfig.maxItems = 3;
                $scope.courseConfig.maxItems = 1;
                $scope.streamConfig.maxItems = 1;

                addInterests = [
                    {id: 6, name: 'Mentorship'},
                    {id: 7, name: 'SME Consultation'}
                ];
                break;
            case(SIGNUPTYPE.STUDENT):

                $scope.locationConfig.maxItems = 3;
                $scope.itDomainsConfig.maxItems = 3;
                $scope.nonItDomainsConfig.maxItems = 3;
                $scope.functionalInterestConfig.maxItems = 3;
                $scope.courseConfig.maxItems = 1;
                $scope.streamConfig.maxItems = 1;

                addInterests = [
                    {id: 6, name: 'Mentorship'},
                    {id: 7, name: 'SME Consultation'}
                ];
                break;
            case(SIGNUPTYPE.INSTITUTE):


                addInterests = [
                    {id: 6, name: 'Mentorship'},
                    {id: 7, name: 'Event Sponsorship'}
                ];
                break;
            default:

        }

        angular.forEach(addInterests, function (addInterest) {
            var flag = true;
            angular.forEach($scope.interest, function (inter) {
                if (inter.name === addInterest.name)
                {
                    flag = false;
                }
            });
            if (flag)
                $scope.interest.push(addInterest);
        });


    };

    // To get IT domains
    $scope.itDomain = undefined;
    $scope.itDomainOptions = [ITDOMAINS.count - 1];
    $scope.itDomainOptions = ITDOMAINS.ITDomains;
    $scope.itDomainsConfig = dropdownOptionsService.getITDomainConfig();

    // To get non IT domains
    $scope.nonItDomain = undefined;
    $scope.nonItDomainOptions = [NONITDOMAINS.count - 1];
    $scope.nonItDomainOptions = NONITDOMAINS.NonITDomains;
    $scope.nonItDomainsConfig = dropdownOptionsService.getNonITDomainConfig();

    // To fetch key skills
    $scope.keySkills = [];
    $scope.skillOptions = [KEYSKILLS.count - 1];
    $scope.skillOptions = KEYSKILLS.keyskills;
    $scope.skillConfig = dropdownOptionsService.getSkillsConfig();

    // To fetch functional interests
    $scope.functionalInterest = [];
    $scope.functionalInterestOptions = [FUNCTIONALINTEREST.count - 1];
    $scope.functionalInterestOptions = FUNCTIONALINTEREST.functionalInterest;
    $scope.functionalInterestConfig = dropdownOptionsService.getFunctionalInterestConfig();

    // To get locations
    $scope.prefLocation = [];
    $scope.$parent.jobLocation;
    $scope.locationOptions = [LOCATIONS.count - 1];
    $scope.locationOptions = LOCATIONS.location;
    $scope.locationConfig = dropdownOptionsService.getLocationConfig();

    // To get courses
    $scope.$parent.course = [];
    $scope.courseOptions = [COURSES.count - 1];
    $scope.courseOptions = COURSES.courses;
    $scope.courseConfig = dropdownOptionsService.getCourseConfig();

    // To get streams
    $scope.$parent.stream = [];
    $scope.streamOptions = [STREAMS.count - 1];
    $scope.streamOptions = STREAMS.streams;
    $scope.streamConfig = dropdownOptionsService.getStreamConfig();


    //show/hide IT and Non-IT domains
    $scope.showIT = function (domainType) {
        if ($scope.domainType === 'IT') {
            return true;
        }
    };

    $scope.showNonIT = function (domainType) {
        if ($scope.domainType === 'Non-IT') {
            return true;
        }
    };

    // To display select box
    $scope.showSelectbox = function (country) {
        if (($scope.country === 'India') || ($scope.country === 'USA')) {
            return true;
        } else {
            return false;
        }
    };

    //to bind a multiple checkbox
    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(itemName) {
        var idx = $scope.selection.indexOf(itemName);
        //is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }
        //is newly selected
        else {
            $scope.selection.push(itemName);
        }
    };

    //Json List for the repeatation of Interest of organizations
    $scope.interest = [];
    $scope.interest = INTERESTS.interests;
    $scope.eduDetails = [];
    //  To add education details
    $scope.addDetails = function () {

        if ($scope.showBlock)
        {
            $scope.details = {};
            $scope.details.school = $scope.school;
            $scope.details.startDate = $scope.startDate;
            $scope.details.endDate = $scope.endDate;
            $scope.details.degree = $scope.course;
            $scope.details.fieldOfStudy = $scope.stream;
            $scope.details.grade = $scope.grade;
            $scope.details.activities = $scope.activity;
            $scope.details.description = $scope.description;
            $scope.eduDetails.push($scope.details);
        }
        if ($scope.showBlock1)
        {
            $scope.details = {};
            $scope.details.school = $scope.school1;
            $scope.details.startDate = $scope.startDate1;
            $scope.details.endDate = $scope.endDate1;
            $scope.details.degree = $scope.course1;
            $scope.details.fieldOfStudy = $scope.stream1;
            $scope.details.grade = $scope.grade1;
            $scope.details.activities = $scope.activity1;
            $scope.details.description = $scope.description1;
            $scope.eduDetails.push($scope.details);
        }
        if ($scope.showBlock2)
        {
            $scope.details = {};
            $scope.details.school = $scope.school2;
            $scope.details.startDate = $scope.startDate2;
            $scope.details.endDate = $scope.endDate2;
            $scope.details.degree = $scope.course2;
            $scope.details.fieldOfStudy = $scope.stream2;
            $scope.details.grade = $scope.grade2;
            $scope.details.activities = $scope.activity2;
            $scope.details.description = $scope.description2;
            $scope.eduDetails.push($scope.details);
        }
        if ($scope.showBlock3)
        {
            $scope.details = {};
            $scope.details.school = $scope.school3;
            $scope.details.startDate = $scope.startDate3;
            $scope.details.endDate = $scope.endDate3;
            $scope.details.degree = $scope.course3;
            $scope.details.fieldOfStudy = $scope.stream3;
            $scope.details.grade = $scope.grade3;
            $scope.details.activities = $scope.activity3;
            $scope.details.description = $scope.description3;
            $scope.eduDetails.push($scope.details);
        }
        if ($scope.showBlock4)
        {
            $scope.details = {};
            $scope.details.school = $scope.school4;
            $scope.details.startDate = $scope.startDate4;
            $scope.details.endDate = $scope.endDate4;
            $scope.details.degree = $scope.course4;
            $scope.details.fieldOfStudy = $scope.stream4;
            $scope.details.grade = $scope.grade4;
            $scope.details.activities = $scope.activity4;
            $scope.details.description = $scope.description4;
            $scope.eduDetails.push($scope.details);
        }
    };

    $scope.employmentDetails = [];
    // To add experience details
    $scope.addExpDetails = function () {
        if ($scope.showExpBlock) {
            $scope.details = {};
            $scope.details.companyName = $scope.companyName;
            $scope.details.title = $scope.jobTitle;
            $scope.details.location = $scope.jobLocation;
            $scope.details.startJobMonth = $scope.startMonth;
            $scope.details.startJobYear = $scope.startYear;
            $scope.details.endJobMonth = $scope.endMonth;
            $scope.details.endJobYear = $scope.endYear;
            $scope.details.description = $scope.jobDescription;
            $scope.employmentDetails.push($scope.details);
        }
        if ($scope.showExpBlock1) {
            $scope.details = {};
            $scope.details.companyName = $scope.companyName1;
            $scope.details.title = $scope.jobTitle1;
            $scope.details.location = $scope.jobLocation1;
            $scope.details.startJobMonth = $scope.startMonth1;
            $scope.details.startJobYear = $scope.startYear1;
            $scope.details.endJobMonth = $scope.endMonth1;
            $scope.details.endJobYear = $scope.endYear1;
            $scope.details.description = $scope.jobDescription1;
            $scope.employmentDetails.push($scope.details);
        }
        if ($scope.showExpBlock2) {
            $scope.details = {};
            $scope.details.companyName = $scope.companyName2;
            $scope.details.title = $scope.jobTitle2;
            $scope.details.location = $scope.jobLocation2;
            $scope.details.startJobMonth = $scope.startMonth2;
            $scope.details.startJobYear = $scope.startYear2;
            $scope.details.endJobMonth = $scope.endMonth2;
            $scope.details.endJobYear = $scope.endYear2;
            $scope.details.description = $scope.jobDescription2;
            $scope.employmentDetails.push($scope.details);
        }
        if ($scope.showExpBlock3) {
            $scope.details = {};
            $scope.details.companyName = $scope.companyName3;
            $scope.details.title = $scope.jobTitle3;
            $scope.details.location = $scope.jobLocation3;
            $scope.details.startJobMonth = $scope.startMonth3;
            $scope.details.startJobYear = $scope.startYear3;
            $scope.details.endJobMonth = $scope.endMonth3;
            $scope.details.endJobYear = $scope.endYear3;
            $scope.details.description = $scope.jobDescription3;
            $scope.employmentDetails.push($scope.details);
        }
        if ($scope.showExpBlock4) {
            $scope.details = {};
            $scope.details.companyName = $scope.companyName4;
            $scope.details.title = $scope.jobTitle4;
            $scope.details.location = $scope.jobLocation4;
            $scope.details.startJobMonth = $scope.startMonth4;
            $scope.details.startJobYear = $scope.startYear4;
            $scope.details.endJobMonth = $scope.endMonth4;
            $scope.details.endJobYear = $scope.endYear4;
            $scope.details.description = $scope.jobDescription4;
            $scope.employmentDetails.push($scope.details);
        }
    };

    //autofill country state and city
    $scope.user = {
        country: '',
        state: ''
    };

    // To fetch list of country
    $scope.countries = userContactService.getCountry();

    $scope.getCountryStates = function () {
        $scope.states = userContactService.getCountryState($scope.country);

    };

    // Used to signup organization,student, mentor and institute
    $scope.submitSignupForm = function (isValid) {
        var url;
        if ($scope.selection.length === 0) {
            //If length of an array to bind value of selected checkbox show a mesaage to fill atleast select one interest.
            //HTML form validations are also not apply to checkbox input type,'Interest' is  mendatory field, Show a message to fill this field.
            $scope.interestMessage = 'Please select in which service you are interested.';
            $scope.errorMessage = 'Please select in which service you are interested.';
            //set isValid variable false, will not send a data to Backend(Not allow to hit an API)
            isValid = false;
        } else if ($scope.user.tc === false) {
            $scope.tcMessage = 'Please accept Terms & Conditions';
            $scope.errorMessage = 'Please accept Terms & Conditions';
            isValid = false;
        }

        if ($scope.type === SIGNUPTYPE.INSTITUTE && $scope.stream.length === 0) {
            //'streams' field has multiple selection, it's input type is custom directive  (here,dropdownMultiselect directive) HTMl form not validate this type.
            //If length of an array binding and selected stream is NULL. Show a message to fill this mendatoy field.
            $scope.streamMessage = 'Please select streams available in your Institute';
            $scope.errorMessage = 'Please select streams available in your Institute';
            //set isValid variable false, will not send a data to Backend(Not allow to hit an API)
            isValid = false;
        }


        if ((($scope.type === SIGNUPTYPE.ORGANIZATION) || ($scope.type === SIGNUPTYPE.MENTOR) || ($scope.type === SIGNUPTYPE.STUDENT)) && ((($scope.itDomain) || ($scope.nonItDomain)) === undefined)) {
            //'Domains' field has multiple selection, it's input type is custom directive  (here,dropdownMultiselect directive) HTMl form not validate this type.
            //If length of an array binding and selected stream is NULL. Show a message to fill this mendatoy field.
            $scope.domainMessage = 'Please select Domain';
            $scope.errorMessage = 'Please select Domain';

            //set isValid variable false, will not send a data to Backend(Not allow to hit an API)
            isValid = false;
        }

        if ($scope.type === SIGNUPTYPE.MENTOR || $scope.type === SIGNUPTYPE.STUDENT)
        {
            if (!($scope.keySkills)) {
                //user.skill model is NULL and it is a mendatory field, Show a message to fill this field.
                $scope.skillMessage = true;
                $scope.errorMessage = 'Select Key Skills';
                //set isValid variable false, will not send a data to Backend(Not allow to hit an API)
                isValid = false;
            } else if ($scope.functionalInterest.length === 0) {
                //'function interest' field has multiple selection, it's input type is custom directive  (here,dropdownMultiselect directive) HTMl form not validate this type.
                //If length of an array binding and selected stream is NULL. Show a message to fill this mendatoy field.
                $scope.functionInterestMessage = 'Please select interested Function';
                $scope.errorMessage = 'Please select interested Function';
                //set isValid variable false, will not send a data to Backend(Not allow to hit an API)
                isValid = false;
            }
            if ($scope.employmentDetails.length === 0)
            {
                $scope.employmentDetails = undefined
            }
        }

        if ($scope.type === SIGNUPTYPE.STUDENT && $scope.prefLocation.length === 0) {
            //'prefered locations' field has multiple selection, it's input type is custom directive  (here,dropdownMultiselect directive) HTMl form not validate this type.
            //If length of an array binding and selected stream is NULL. Show a message to fill this mendatoy field.
            $scope.prefLocationsMessage = 'Please select prefered Locations';
            $scope.errorMessage = 'Please select prefered Locations';
            //set isValid variable false, will not send a data to Backend(Not allow to hit an API)
            isValid = false;
        }

        // check to make sure the form is completely valid (including checkbox, user defined input type(custom dierctive) are validated/are not null)
        if (isValid) {
            //declare a Null object to store all the data filled by user and send it to Backend
            $user = {};
            //LHS field name (exe:emailId,password,firstName) must be same as name given in Backend (name must be mapped with backend)
            //RHS field name (exe:username,password,Fname) must be same as name given in HTML template to bind an input
            $addressDetails = {};
            if ($scope.type === SIGNUPTYPE.ORGANIZATION)
            {
                $addressDetails.addressLine1 = $scope.addressLine1;
                $addressDetails.addressLine2 = $scope.addressLine2;
                $addressDetails.state = $scope.state;
                $addressDetails.city = $scope.city;
                $addressDetails.pincode = $scope.pincode;
                $addressDetails.country = $scope.country;
                $user.addressDetails = $addressDetails;
                $user.password = $scope.pwOrg1;
                $user.name = $scope.user.name;
                if ($scope.user.type === 'Both')
                    $scope.user.type = 'Product Based and Service Based';
                $user.type = $scope.user.type;

                if ($scope.itDomain !== undefined) {
                    $user.itDomain = $scope.itDomain;
                }
                if ($scope.nonItDomain !== undefined) {
                    $user.nonItDomain = $scope.nonItDomain;
                }


                $user.website = $scope.user.website;
                $user.numberOfEmployees = $scope.user.numberOfEmployees;
                $user.interest = $scope.selection;
                $user.emailId = $scope.user.email;
                $user.contactPerson = $scope.user.contactPerson;
                $user.contactNumber = $scope.user.contactNumber;
                url = CONSTANTS.SERVICES.ORGANIZATIONS;


            } else if ($scope.type === SIGNUPTYPE.MENTOR)
            {
                $addressDetails.addressLine1 = $scope.addressLine1;
                $addressDetails.addressLine2 = $scope.addressLine2;
                $addressDetails.country = $scope.country;
                $addressDetails.state = $scope.state;
                $addressDetails.city = $scope.city;
                $addressDetails.pincode = $scope.pincode;
                $user.addressDetails = $addressDetails;
                $user.emailId = $scope.user.emailId;
                $user.password = $scope.pwMent1;
                $user.firstName = $scope.user.firstName;
                $user.lastName = $scope.user.lastName;
                $user.gender = $scope.user.gender;
                $user.orgName = $scope.user.orgName;
                $user.orgEmail = $scope.user.orgEmail;
                $user.phone = $scope.user.phone;
                $user.skype = $scope.user.skype;
                $user.areaOfExpertise = $scope.keySkills;
                $user.itDomain = $scope.itDomain;
                $user.nonItDomain = $scope.nonItDomain;
                $user.functionInterest = $scope.functionalInterest;
                $user.yearsOfExperience = $scope.user.yearsOfExperience;
                $user.interest = $scope.selection;

                $user.eduDetails = $scope.eduDetails;
                $user.jeeMain = $scope.user.jeeMain;
                $user.jeeAdv = $scope.user.jeeAdv;
                $user.employmentDetails = $scope.employmentDetails;
                $user.certificates = $scope.user.certificates;
                $user.patents = $scope.user.patents;
                url = CONSTANTS.SERVICES.MENTORS;
            } else if ($scope.type === SIGNUPTYPE.STUDENT)
            {
                if ($scope.domainType === 'IT') {
                    $user.domainInterest = $scope.itDomain;
                    $user.domainType = 'itDomain';
                } else  {
                    $user.domainInterest = $scope.nonItDomain;
                    $user.domainType = 'nonItDomain';
                }
                $addressDetails.addressLine1 = $scope.addressLine1;
                $addressDetails.addressLine2 = $scope.addressLine2;
                $addressDetails.country = $scope.country;
                $addressDetails.state = $scope.state;
                $addressDetails.city = $scope.city;
                $addressDetails.pincode = $scope.pincode;
                //var addressDetails = $addressDetails;
                $user.addressDetails = $addressDetails;
                $user.emailId = $scope.user.username;
                $user.password = $scope.pw1;
                $user.firstName = $scope.user.Fname;
                $user.lastName = $scope.user.Lname;
                $user.gender = $scope.user.gender;
                $user.skypeId = $scope.user.skypeid;
                $user.contactNumber1 = $scope.user.contactnumber1;
                if ($scope.user.contactNumber2 !== '')
                    $user.contactNumber2 = $scope.user.contactnumber2;
                //$user.domainInterest = $user.domainInterest;
                $user.skills = $scope.keySkills;
                $user.functionInterest = $scope.functionalInterest;
                $user.preferLocation = $scope.prefLocation;

                $user.eduDetails = $scope.eduDetails;

                $user.experienceDetails = $scope.employmentDetails;
                $user.projSummary = $scope.user.projSummary;
                $user.jobInterest = $scope.selection;
                $user.jeeMain = $scope.user.jeeMain;
                $user.jeeAdv = $scope.user.jeeAdv;
                $user.pprPubli = $scope.user.publication;
                url = CONSTANTS.SERVICES.STUDENTS;
            } else if ($scope.type === SIGNUPTYPE.INSTITUTE) {
                $addressDetails.addressLine1 = $scope.addressLine1;
                $addressDetails.addressLine2 = $scope.addressLine2;
                $addressDetails.country = $scope.country;
                $addressDetails.state = $scope.state;
                $addressDetails.city = $scope.city;
                $addressDetails.pincode = $scope.pincode;
                //var addressDetails = $addressDetails;
                $user.addressDetails = $addressDetails;
                $user.password = $scope.pwInst1;
                //$user.type = $scope.user.type;
                $user.name = $scope.user.name;
                $user.type = $scope.user.type;
                $user.website = $scope.user.website;
                $user.streams = $scope.stream;
                $user.interest = $scope.selection;
                $user.emailId = $scope.user.email;
                $user.contactPerson = $scope.user.contactPerson;
                $user.contactNumber = $scope.user.contactNumber;
                url = CONSTANTS.SERVICES.COLLEGES;
            }


            //$http 'Post' service to post an data to backend
            //CONSTANTS.SERVICES.STUDENTS( Constant URL) is an API set as constant (not vary anywhere in application).
            //Declaration of this constant is inside the 'htmlFolder/js/util/constant.js
            //$user with constant URL is the object, posting to backend
            //$user inside the function() is a response coming from backend (here it is also an object)

            $http.post(url, $user).success(function (sign) {
                //Object is successfully posted to backend
                //storing reponse from backedn into the cookie
                //If user will refresh a web page even though data wouldn't lost it comes from cookie we are stoing here.
//                $cookieStore.put("futuremaker", sign.token);
//                //adding a response from backend to Local service named 'userService'
                userService.addUser($user);

                //display message on screen of user to check email and verify  given Email Id
                alert('Please check your e-mail');
                if ($scope.type === SIGNUPTYPE.MENTOR)
                {
                    $location.path('/home/mentor-signup-form/upload-resume');
                } else if ($scope.type === SIGNUPTYPE.STUDENT)
                {
                    $location.path('/home/student-signup-form/upload-resume');
                } else
                {
                    $location.path('/home');
                }
            }).error(function (error) {
                //If error comes from backend, posting an object may get any error (exe:validation error, internal server errors, not availability of server)
                //to display a message according to status of error you can use 'status' keyword inside function() like here i used 'error' inside function()
                //bind an error inside an object name errors to display on screen of user
                $scope.errors = error.error;
                alert($scope.errors);

            });
        } else
        {
            alert($scope.errorMessage);
        }
    };


});


login.controller('UpdateOrgProfileController', function ($scope, $location, $resource, $window, $http, $cookieStore, CONSTANTS, userService, userContactService) {

    $scope.user = userService.getUser();

    $authdata = utilities.Base64.encode((($scope.user.orgId) || ($scope.user.username)) + ':' + $scope.user.password);

    //$http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

    $http.get(CONSTANTS.SERVICES.ORGANIZATIONS, $scope.user).success(function ($user) {
        //$cookieStore.put("futuremaker", $user);
        $scope.selectedDomains = $user.domain;
        $scope.selection = $user.interest;
        $scope.user.country = $user.country;
        $scope.user.state = $user.state;
        $scope.user.city = $user.city;
        userService.addUser($user);
        $scope.user = userService.getUser();

    });


    //domains
    $scope.domains = [
        {"id": "1", "name": "Accounting/Taxation"},
        {"id": "2", "name": "Advertising"},
        {"id": "3", "name": "Agriculture Technology"},
        {"id": "4", "name": "Animation/Gaming"},
        {"id": "5", "name": "Architectural Services"},
        {"id": "6", "name": "Automobile Industry"},
        {"id": "7", "name": "Automation Industry"},
        {"id": "8", "name": "Chemical Industry"},
        {"id": "9", "name": "Clinical Research"},
        {"id": "10", "name": "Consulting Services"},
        {"id": "11", "name": "Construction"},
        {"id": "12", "name": "Computer Networking"},
        {"id": "13", "name": "Education/Training"},
        {"id": "14", "name": "Electrical Industry"},
        {"id": "15", "name": "Event management"},
        {"id": "16", "name": "Entertainment/Media"},
        {"id": "17", "name": "Electronic Industry"},
        {"id": "18", "name": "Engg. Service Provider"},
        {"id": "19", "name": "Financial Services"},
        {"id": "20", "name": "Government/Defence"},
        {"id": "21", "name": "Healthcare Services"},
        {"id": "22", "name": "IT Enabled Services"},
        {"id": "23", "name": "Insurance"},
        {"id": "24", "name": "Law/Legal Firms"},
        {"id": "25", "name": "Machinery Products"},
        {"id": "26", "name": "Petroleum Industry"},
        {"id": "27", "name": "Power Industry"},
        {"id": "28", "name": "Research Foundation"},
        {"id": "29", "name": "Real Estate"},
        {"id": "30", "name": "Software Industry"},
        {"id": "31", "name": "Telecom/ISP"}
    ];

    //to bind a multiple checkbox

    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(itemName) {
        var idx = $scope.selection.indexOf(itemName);
        //is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }
        //is newly selected
        else {
            $scope.selection.push(itemName);
        }
    };

    $scope.interests = [
        {
            "id": "1",
            "data": "Campus Recruitment"
        },
        {
            "id": "2",
            "data": "Internship"
        },
        {
            "id": "3",
            "data": "Research Project"
        },
        {
            "id": "4",
            "data": "Mentorship"
        },
        {
            "id": "5",
            "data": "Sponsoring an event"
        },
        {
            "id": "6",
            "data": "Branding"
        }
    ];


//autofill country state and city
    $scope.user = {
        country: '',
        state: '',
        city: ''
    };
    $scope.countries = userContactService.getCountry();

    $scope.getCountryStates = function () {
        $scope.states = userContactService.getCountryState($scope.user.country);
        $scope.cities = [];
    };

    $scope.getStateCities = function () {
        $scope.cities = userContactService.getStateCity($scope.user.state);
    };

    $scope.submitOrganizationForm = function (isValid) {

        if ($scope.user.password === $scope.pw2)
        {
            $scope.user.password = $scope.pw4;
        }

        // check to make sure the form is completely valid
        if (isValid) {
            $user = {};

            $user.orgId = $scope.user.orgId;
            $user.password = $scope.user.password;
            $user.name = $scope.user.name;
            $user.type = $scope.user.type;
            $user.domain = $scope.selectedDomains;
            $user.website = $scope.user.website;
            $user.numberOfEmployees = $scope.user.numberOfEmployees;
            $user.interest = $scope.selection; //["campus recruitment"];//multiple
            $user.email = $scope.user.email;
            $user.addr1 = $scope.user.addr1;
            $user.addr2 = $scope.user.addr2;
            $user.country = $scope.user.country;
            $user.state = $scope.user.state;
            $user.city = $scope.user.city;
            $user.pincode = $scope.user.pincode;
            $user.contactPerson = $scope.user.contactPerson;
            $user.contactNumber = $scope.user.contactNumber;



            //	$authdata = utilities.Base64.encode($scope.user.orgId + ':' + $scope.user.password);
            $authdata = utilities.Base64.encode($scope.user.orgId + ':' + (($scope.pw2) || ($scope.user.password)));

            // $http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

            $http.put(CONSTANTS.SERVICES.ORGANIZATIONS, $user).success(function ($user) {

                $cookieStore.put("futuremaker", $user);

                userService.addUser($user);
                $scope.user = userService.getUser();
                alert('Your information has been updated successfully!');
                $location.path("/home");
            });
        }

    };







});

login.controller('UpdateMentorProfileController', function ($scope, $location, $resource, $window, $http, $cookieStore, CONSTANTS, userService) {

    $scope.user = userService.getUser();

    $authdata = utilities.Base64.encode(($scope.user.emailId) || ($scope.user.username) + ':' + $scope.user.password);

    // $http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    $http.get(CONSTANTS.SERVICES.MENTORS, $scope.user).success(function ($user) {
        $cookieStore.put("futuremaker", $user);
        userService.addUser($user);
        $scope.user = userService.getUser();
        $rootScope.$broadcast('showUserName', {
            menu: 'Profile'
        });
    });

    $scope.submitMentorForm = function (isValid) {

        if ($scope.user.password === $scope.pw2)
        {
            $scope.user.password = $scope.pw4;
        }

        // check to make sure the form is completely valid
        if (isValid) {
            $user = {};

            $user.emailId = $scope.user.emailId;
            $user.password = $scope.user.password;
            //$user.type = $scope.user.type;
            $user.firstName = $scope.user.firstName;
            $user.lastName = $scope.user.lastName;
            $user.gender = $scope.user.gender;
            $user.orgName = $scope.user.orgName;
            $user.orgEmail = $scope.user.orgEmail;
            $user.phone = $scope.user.phone;
            $user.skype = $scope.user.skype;
            $user.addr1 = $scope.user.addr1;
            $user.addr2 = $scope.user.addr2;
            $user.country = $scope.user.country;
            $user.state = $scope.user.state;
            $user.city = $scope.user.city;
            $user.pin = $scope.user.pin;
            $user.areaOfExpertise = $scope.user.areaOfExpertise;
            $user.domain = $scope.user.domain;
            $user.yearsOfExperience = $scope.user.yearsOfExperience;
            $user.interest = ["campus recruitment"];
            $user.qualification = $scope.user.qualification;
            $user.certificates = $scope.user.certificates;
            $user.patents = $scope.user.patents;
            $user.resume = $scope.user.resume;

            //	$authdata = utilities.Base64.encode($scope.user.emailId + ':' + $scope.user.password);
            $authdata = utilities.Base64.encode($scope.user.emailId + ':' + (($scope.pw2) || ($scope.user.password)));
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

            $http.put(CONSTANTS.SERVICES.MENTORS, $user).success(function ($user) {

                $cookieStore.put("futuremaker", $user);

                userService.addUser($user);
                $scope.user = userService.getUser();
                alert('Your information has been updated successfully!');
                $location.path("/home");
            });
        }
    };


    /*$http.get(CONSTANTS.SERVICES.MENTORS, $user).success(function($stud) {
     userService.addUser($stud);	
     $scope.user = userService.getUser();
     })*/

});

login.controller('UpdateIndProfileController', function ($scope, $location, $resource, $window, $http, $cookieStore, CONSTANTS, userService, userContactService) {

    $scope.user = userService.getUser();

    $authdata = utilities.Base64.encode(($scope.user.emailId) || ($scope.user.username) + ':' + $scope.user.password);

    // $http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    $http.get(CONSTANTS.SERVICES.STUDENTS, $scope.user).success(function ($user) {
        //$cookieStore.put("futuremaker", $user);
        $scope.selection = $user.interest;
        $scope.user.country = $user.country;
        $scope.user.state = $user.state;
        $scope.user.city = $user.city;
        userService.addUser($user);
        $scope.user = userService.getUser();
    });

    $('.flexdatalist').flexdatalist({
        selectionRequired: 1,
        minLength: 1,
        searchContain: true
    });

    //to bind a multiple checkbox

    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(itemName) {
        var idx = $scope.selection.indexOf(itemName);
        //is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }
        //is newly selected
        else {
            $scope.selection.push(itemName);
        }
    };

    $scope.studInterests = [
        {
            "id": "1",
            "data": "Campus Recruitment"
        },
        {
            "id": "2",
            "data": "Internship"
        },
        {
            "id": "3",
            "data": "Research Project"
        },
        {
            "id": "4",
            "data": "Career Opportunity"
        },
    ];

    //autofill country state and city
    $scope.user = {
        country: '',
        state: '',
        city: ''
    };
    $scope.countries = userContactService.getCountry();

    $scope.getCountryStates = function () {
        $scope.states = userContactService.getCountryState($scope.user.country);
        $scope.cities = [];
    };

    $scope.getStateCities = function () {
        $scope.cities = userContactService.getStateCity($scope.user.state);
    };



    $scope.submitForm = function (isValid) {

        if ($scope.user.password === $scope.pw2)
        {
            $scope.user.password = $scope.pw4;
        }

        // check to make sure the form is completely valid
        if (isValid) {
            $user = {};

            $user.emailId = $scope.user.emailId;
            $user.password = $scope.user.password;
            $user.firstName = $scope.user.firstName;
            $user.lastName = $scope.user.lastName;
            $user.gender = $scope.user.gender;
            $user.skypeId = $scope.user.skypeId;
            $user.addr1 = $scope.user.addr1;
            $user.addr2 = $scope.user.addr2;
            $user.country = $scope.user.country;
            $user.state = $scope.user.state;
            $user.city = $scope.user.city;
            $user.pincode = $scope.user.pincode;
            $user.contactNumber1 = $scope.user.contactNumber1;
            $user.contactNumber2 = $scope.user.contactNumber2;
            $user.ProjSummary = $scope.user.ProjSummary;
            $user.skills = $scope.user.skills;
            $user.interest = $scope.selection;
            $user.allIndiaRank = $scope.user.allIndiaRank;
            $user.ugQual = $scope.user.ugQual;
            $user.ugStream = $scope.user.ugStream;
            $user.ugInstitute = $scope.user.ugInstitute;
            $user.ugYop = $scope.user.ugYop;
            $user.pgQual = $scope.user.pgQual;
            $user.pgStream = $scope.user.pgStream;
            $user.pgInstitute = $scope.user.pgInstitute;
            $user.pgYop = $scope.user.pgYop;
            $user.addiQual = $scope.user.addiQual;
            $user.pprPubli = $scope.user.pprPubli;
            //$user.resume = $scope.user.resume;


            //	$authdata = utilities.Base64.encode($scope.user.emailId + ':' + $scope.user.password);
            $authdata = utilities.Base64.encode($scope.user.emailId + ':' + (($scope.pw2) || ($scope.user.password)));

            //  $http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

            $http.put(CONSTANTS.SERVICES.STUDENTS, $user).success(function ($user) {

                $cookieStore.put("futuremaker", $user);

                userService.addUser($user);
                $scope.user = userService.getUser();
                alert('Your information has been updated successfully!');
                $location.path("/home");
            });
        }

    };

});

login.controller('UpdateInstProfileController', function ($scope, $location, $resource, $window, $http, $cookieStore, CONSTANTS, userService) {

    $scope.user = userService.getUser();

    $authdata = utilities.Base64.encode(($scope.user.collegeId) || ($scope.user.username) + ':' + $scope.user.password);


    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

    $http.get(CONSTANTS.SERVICES.COLLEGES, $scope.user).success(function ($user) {
        $cookieStore.put("futuremaker", $user);
        userService.addUser($user);
        $scope.user = userService.getUser();
        $rootScope.$broadcast('showUserName', {
            menu: 'Profile'
        });
    });

    $scope.submitInstituteForm = function (isValid) {

        if ($scope.user.password === $scope.pw2)
        {
            $scope.user.password = $scope.pw4;
        }

        // check to make sure the form is completely valid
        if (isValid) {
            $user = {};

            $user.collegeId = $scope.user.collegeId;
            $user.password = $scope.user.password;
            //$user.type = $scope.user.type;
            $user.name = $scope.user.name;
            $user.type = $scope.user.type;
            $user.website = $scope.user.website;
            $user.streams = ["Computer Science"];//multiple
            $user.interest = ["campus recruitment"];//multiple
            $user.email = $scope.user.email;
            $user.addr1 = $scope.user.addr1;
            $user.addr2 = $scope.user.addr2;
            $user.country = $scope.user.country;
            $user.state = $scope.user.state;
            $user.city = $scope.user.city;
            $user.pin = $scope.user.pin;
            $user.contactPerson = $scope.user.contactPerson;
            $user.contactNumber = $scope.user.contactNumber;

            //$authdata = utilities.Base64.encode($scope.user.collegeId + ':' + $scope.user.password);
            $authdata = utilities.Base64.encode($scope.user.collegeId + ':' + (($scope.pw2) || ($scope.user.password)));
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

            $http.put(CONSTANTS.SERVICES.COLLEGES, $user).success(function ($user) {

                $cookieStore.put("futuremaker", $user);

                userService.addUser($user);
                $scope.user = userService.getUser();
                alert('Your information has been updated successfully!');
                $location.path("/home");
            });
        }

    };


    /*	$http.get(CONSTANTS.SERVICES.COLLEGES, $user).success(function($stud) {
     userService.addUser($stud);	
     $scope.user = userService.getUser();
     })*/


});

login.controller('visibilityController', function ($scope, $location) {
    $scope.menthide = false;
    $scope.studhide = true;
    $scope.insthide = true;
    $scope.orghide = true;

    $scope.toggle = function () {
        switch ($location.path()) {
            case '/home/student-signup-form':
                $scope.studhide = false;
                $scope.menthide = true;
                $scope.orghide = true;
                $scope.insthide = true;

                break;
            case '/home/mentor-signup-form':
                $scope.studhide = true;
                $scope.menthide = false;
                $scope.orghide = true;
                $scope.insthide = true;
                break;
            case '/home/organisation-signup-form':
                $scope.studhide = true;
                $scope.menthide = true;
                $scope.orghide = false;
                $scope.insthide = true;
                break;
            case '/home/institute-signup-form':
                $scope.studhide = true;
                $scope.menthide = true;
                $scope.orghide = true;
                $scope.insthide = false;
                break;
            default:

        }

    };


    $scope.hideStud = function () {
        // replace "myBoolean" with the logic that checks the path
        return $scope.studhide;
    };
    $scope.hideOrg = function () {
        // replace "myBoolean" with the logic that checks the path
        return $scope.orghide;
    };
    $scope.hideInst = function () {
        // replace "myBoolean" with the logic that checks the path
        return $scope.insthide;
    };
    $scope.hideMent = function () {
        // replace "myBoolean" with the logic that checks the path
        return $scope.menthide;
    };
});
login.controller('forgetpassController', function ($scope, $http, CONSTANTS, $location, $window) {
    $scope.forgetpassword = function () {
        $http.get(CONSTANTS.SERVICES.FORGETPASS + $scope.email + '/' + $scope.type).success(function ($user) {
            $window.alert("Check Your Mails!");
            $location.path('/home');
        }).error(function (error) {
            $window.alert(error);
            $location.path("/login");
        });
    };
});
login.controller('resetpassController', function ($scope, $http, CONSTANTS, $location, $window, userService) {
    $scope.resetPass = function () {
        if ($scope.pw1 !== undefined) {
            if ($scope.pw1 === $scope.pw2)
            {
                $http.get(CONSTANTS.SERVICES.RESETPASS + $location.search().email + '/' + $scope.pw1 + '/' + $location.search().type).success(function ($user) {
                    $window.alert("Password Reset Success!");
                    $location.path('/home');
                }).error(function (error) {
                    $window.alert('Something Went Wrong');
                    $location.path("/login");
                });
            } else
            {
                $window.alert("Password Doesn't Match");
            }

        } else
        {
            $window.alert("Password Should Not Be Empty\nPassword Should be atleast 8 charecters \nPassword must contain atleast one number, one uppercase letter and one lowercase letter.");
        }

    };
    $scope.changePass = function () {
        $scope.user = userService.getUser();
        if ($scope.user.password === $scope.pw)
        {
            if ($scope.pw1 !== undefined) {
                if ($scope.pw1 === $scope.pw2)
                {
                    $scope.uname = $scope.user.username;
                    if ($scope.user.emailId !== "N/A")
                        $scope.uname = $scope.user.emailId;

                    $http.get(CONSTANTS.SERVICES.RESETPASS + $scope.uname + '/' + $scope.pw1 + '/' + $scope.user.userType).success(function ($user) {
                        $window.alert("Password Reset Success!");
                        $location.path('/home');
                    }).error(function (error) {
                        $window.alert('Something Went Wrong');
                        $location.path("/login");
                    });
                } else
                {
                    $window.alert("Password Doesn't Match");
                }

            } else
            {
                $window.alert("Password Should Not Be Empty\nPassword Should be atleast 8 charecters \nPassword must contain atleast one number, one uppercase letter and one lowercase letter.");
            }
        } else
        {
            $window.alert("Existing password not match");
        }

    };
});
login.controller('verifyAccountController', function ($scope, $http, CONSTANTS, $location, $window) {
    $scope.verifyAcc = function () {
        if ($location.search().token !== undefined) {
            $http.get(CONSTANTS.SERVICES.VERACC + $location.search().token).success(function ($user) {
                $window.alert("Account Verified Successfully!");
                $location.path('/login');
            }).error(function (error) {
                $window.alert("Something Went Wrong");
                $location.path("/login");
            });
        }
    };
});

login.controller('getProfileController', function ($scope, $http, CONSTANTS, $location, searchService, $window) {
    $scope.getProfile = function () {
        if ($location.search().userId !== undefined) {
            $http.get(CONSTANTS.SERVICES.GETPROFILE + $location.search().userId + "/" + $location.search().userType).success(function (data) {
                $scope.results = data;

                searchService.addSearch($scope.results);
                $location.url("/viewProfile");

            }).error(function (error) {
                $window.alert("Something Went Wrong");
                $location.path("/login");
            });
        }
    };
});



futureMakerApp.controller('BaseController', function ($scope) {
    $scope.toggle1 = false;
    $scope.toggle2 = false;
    $scope.toggle3 = false;
    $scope.filter1 = false;
    $scope.filter2 = false;
    $scope.filter3 = false;
    $scope.togglefilter = function (index) {
        switch (index)
        {
            case 1:
                $scope.filter1 = $scope.filter1 === true ? false : true;
                break;
            case 2:
                $scope.filter2 = $scope.filter2 === true ? false : true;
                break;
            case 3:
                $scope.filter3 = $scope.filter3 === true ? false : true;
                break;
            default:
        }
    };
    $scope.$watch('toggle1', function () {
        $scope.toggleText1 = $scope.toggle1 ? 'Read Less' : 'Read More';

    });
    $scope.$watch('toggle2', function () {

        $scope.toggleText2 = $scope.toggle2 ? 'Read Less' : 'Read More';

    });
    $scope.$watch('toggle3', function () {

        $scope.toggleText3 = $scope.toggle3 ? 'Read Less' : 'Read More';
    });
});

futureMakerApp.controller('MenuController', function ($scope, searchService, $http, $location, userService, CONSTANTS) {
    $scope.user = userService.getUser();
    $authdata = utilities.Base64.encode($scope.user.username + ':' + $scope.user.password);
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

    //This is http request for geeting user object with API and user object as parameters
    $http.get(CONSTANTS.SERVICES.USERS, $scope.user).success(function ($user) {
        $scope.user = $user;
    });

    $scope.getFolders = function () {
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));

        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $http.get(CONSTANTS.SERVICES.FOLDERS).success(function ($resultArray) {
            $scope.abc = $resultArray;
        }).error(function (error)
        {
            alert(error || error.error);
        });
    };
    $scope.getProfile = function () {
        switch ($scope.user.userType)
        {
            case 'organisation':
                $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));

                $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                $http.get(CONSTANTS.SERVICES.ORGANIZATIONS).success(function (data) {
                    $scope.results = data;

                    searchService.addSearch($scope.results);
                    $location.url("/viewProfile");
                }).error(function (error)
                {
                    alert(error || error.error);
                });
                break;
            case 'mentor':
                $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));

                $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                $http.get(CONSTANTS.SERVICES.MENTORS).success(function (data) {
                    $scope.results = data;

                    searchService.addSearch($scope.results);
                    $location.url("/viewProfile");
                }).error(function (error)
                {
                    alert(error || error.error);
                });
                break;
            case 'student':
                $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));

                $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                $http.get(CONSTANTS.SERVICES.STUDENTS).success(function (data) {
                    $scope.results = data;

                    searchService.addSearch($scope.results);
                    $location.url("/viewProfile");
                }).error(function (error)
                {
                    alert(error || error.error);
                });
                break;
            case 'institute':
                $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));

                $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                $http.get(CONSTANTS.SERVICES.COLLEGES).success(function (data) {
                    $scope.results = data;

                    searchService.addSearch($scope.results);
                    $location.url("/viewProfile");
                }).error(function (error)
                {
                    alert(error || error.error);
                });
                break;
        }

    };
    $scope.changeClass = function () {
        switch ($scope.selected)
        {
            case 'admin':
                $scope.AdminSelected = 'selected';
                $scope.ProfilesSelected = '';
                $scope.PersonalFolderSelected = '';
                $scope.ReportSelected = '';
                $scope.ResponseSelected = '';
                break;
            case 'profile':
                $scope.AdminSelected = '';
                $scope.ProfilesSelected = 'selected';
                $scope.PersonalFolderSelected = '';
                $scope.ReportSelected = '';
                $scope.ResponseSelected = '';

                break;
            case 'pf':
                $scope.AdminSelected = '';
                $scope.ProfilesSelected = '';
                $scope.PersonalFolderSelected = 'selected';
                $scope.ReportSelected = '';
                $scope.ResponseSelected = '';

                break;
            case 'report':
                $scope.AdminSelected = '';
                $scope.ProfilesSelected = '';
                $scope.PersonalFolderSelected = '';
                $scope.ReportSelected = 'selected';
                $scope.ResponseSelected = '';

                break;
            case 'response':
                $scope.AdminSelected = '';
                $scope.ProfilesSelected = '';
                $scope.PersonalFolderSelected = '';
                $scope.ReportSelected = '';
                $scope.ResponseSelected = 'selected';

                break;
        }

    };

});


futureMakerApp.controller('DashboardController', function ($scope, $timeout, userService) {
    $scope.user = userService.getUser();
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40, 50]
    ];
    $scope.options = {legend: {display: true, position: 'right'}};
    $scope.datasetOverride = [
        {
            fill: true,
            hoverBorderColor: ['#205081', '#205081', '#205081', '#205081', '#205081', '#205081', '#205081', '#205081'],
            borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
            backgroundColor: [
                "#FFCE56",
                "#36A2EB",
                "#f35325",
                "#FFCE56",
                "#36A2EB",
                "#f35325",
                "#FFCE56",
                "#36A2EB"
            ]
        }];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    // Simulate async data update
    $timeout(function () {
        $scope.data = [
            [28, 48, 40, 19, 86, 27, 90, 40]
        ];
    }, 3000);
});
//This is controller for saving email templates and getting them back
futureMakerApp.controller('EmailTemplateController', function ($scope, $window, $location, $http, $cookieStore, CONSTANTS, opportunityService, userService, emailTemplateService) {

    //This gets user object from userService
    $scope.user = userService.getUser();
    //$scope.template = emailTemplateService.getTemplate();
    $scope.editTemplate;
    //This authenticates user for permissions
    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    //This gets the object from opportunity service
    $scope.opp = userService.getUser();
    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    //This is http get request to get all saved email templates with API and user credentials object as parameters
    $http.get(CONSTANTS.SERVICES.TEMPLATES, $scope.user).success(function ($template) {
        $scope.templates = $template;
    });
    $scope.editTemplate = emailTemplateService.getTemplate();
    /*$scope.displayTemp =function(template){
     var a = template;
     emailTemplateService.addTemplate(a);
     };*/

    $scope.clicked = function () {
        switch ($scope.user.userType) {
            case 'organisation':
                $location.path("/home/org-post/org-posted");
                break;
            case 'student':
                $location.path("/home/stud-posted");
                break;
            case 'institute':
                $location.path("/home/inst-posted");
                break;
            case 'mentor':
                $location.path("/home/mentor-posted");
                break;
            default:
                $location.path("#");
        }
    };
    //*********************Save template in DB function*******************************

    //This function is used to save templates
    $scope.saveTemplate = function () {

        $template = {};
        //This assigns object data to "$template" object
        $template.positionName = $scope.editTemplate.positionName;
        $template.senderEmail = $scope.editTemplate.senderEmail;
        $template.subject = $scope.editTemplate.subject;
        $template.jobDescription = $scope.editTemplate.jobDescription;
        $template.jobDescription = $template.jobDescription.replace(/\n/g, "%0A%0A");
        $template.signature = $scope.editTemplate.signature;
        $template.signature = $template.signature.replace(/\n/g, "%0A%0A");
        //$scope.date = new Date();	
        //$template.date = $scope.date;

        //This send a http post request to save template in database
        if ($scope.editTemplate.id === undefined) {
            $http.post(CONSTANTS.SERVICES.TEMPLATES, $template).success(function ($template) {
                $scope.editTemplate = {};
                alert("Template Saved Successfully");
                $location.path("/home/email-template");
            }).error(function (error) {
                alert(error.error || error);
                $location.path("/home/email-template");
            });
        } else
        {
            $http.put(CONSTANTS.SERVICES.TEMPLATES + '/' + $scope.editTemplate.id, $template).success(function ($template) {
                $scope.editTemplate = {};
                alert("Template Updated Successfully");
                $location.path("/home/email-template");
            }).error(function (error) {
                alert(error.error || error);
                $location.path("/home/email-template");
            });
        }
        //$scope.temps = emailTemplateService.addTemplate($template);
        //$scope.temp = emailTemplateService.getTemplate();

        //This redirects to email template table

    };
    $scope.editEmail = function (template) {


        template.signature = template.signature.replace(/%0A%0A/g, "\n");
        template.jobDescription = template.jobDescription.replace(/%0A%0A/g, "\n");
        emailTemplateService.addTemplate(template);
        $location.path("/home/email-template/write-template");
    };
    $scope.removeTemplate = function ($templateId) {



        $http.delete(CONSTANTS.SERVICES.TEMPLATES + '/' + $templateId).success(function (response) {
            alert("Template Deleted Successfully");
            $window.location.reload();
        }).error(function (error) {
            alert(error.error || error);
            $window.location.reload();
        });
    };
    //This function is used to get required date format
    $scope.getDateFormat = function (timestamp) {
        return new Date(timestamp);
    };
    setTimeout(function () {
        $('#bootstrap-table').DataTable(
                // {
                // "order": [[ 2, "desc" ]]
                //}
                );
    }, 300);
//*************************Add row function*********************************
    /*$scope.addRow = function(){	
     $scope.date = new Date();	
     $scope.template.push({ 'name':$scope.template.templateName, 'Dates': $scope.date });
     //$scope.no='';
     //$location.path("/home/email-template");
     //$scope.name='';
     //$scope.Dates='';
     };*/





//*************************Alert Function*****************************
    $scope.selectionAlert = function () {
        alert("Please select templates to send...");
    };
    /*$scope.removeRow = function(name){	
     //var index = $scope.templates.indexOf(name);			
     var index = -1;		
     var comArr = eval( $scope.templates );
     for( var i = 0; i < comArr.length; i++ ) {
     if( comArr[i].name === name ) {
     index = i;
     break;
     }
     }
     if( index === -1 ) {
     index = index + 1;
     //alert( "Something went wrong!!!" );
     
     }
     $scope.templates.splice( index, 1 );		
     }; */

//Open send email window
    $scope.sendMail = function (emailId, subject, message) {
        $window.open("mailto:" + emailId + "?subject=" + subject + "&body=" + message, "_self");
    };
//Email Module

    /* $scope.isPopupVisible = false;
     $scope.isComposePopupVisible = false;
     $scope.composeEmail = {};
     $scope.activeTab = "inbox";
     $scope.sentEmails = [];
     
     $scope.sendEmail = function() {
     $scope.isComposePopupVisible = false;
     $scope.composeEmail.from = "me";
     $scope.composeEmail.date = new Date();        
     $scope.sentEmails.push($scope.composeEmail);
     };
     
     $scope.showComposePopup = function() {
     $scope.composeEmail = {};
     $scope.isComposePopupVisible = true;
     };
     
     $scope.closeComposePopup = function() {
     $scope.isComposePopupVisible = false;
     };
     
     $scope.showPopup = function(email) {
     $scope.isPopupVisible = true;
     $scope.selectedEmail = email;
     };
     
     $scope.closePopup = function() {
     $scope.isPopupVisible = false;
     };
     
     $scope.emails = [
     { 
     from: 'John',
     to: 'me',
     subject: 'I love angular', 
     date: 'Jan 1', 
     body: 'hello world!' 
     },
     { 
     from: 'Jack', 
     to: 'me',
     subject: 'Angular and I are just friends', 
     date: 'Feb 15', 
     body: 'just kidding' 
     },
     { 
     from: 'Ember', 
     to: 'me',
     subject: 'I hate you Angular!', 
     date: 'Dec 8', 
     body: 'wassup dude' 
     }
     ];*/








});
/*futureMakerApp.controller('EmailTemplateController', function( $scope, $location, $http, $cookieStore, CONSTANTS)
 {
 
 $scope.showModal = false;
 $scope.searchResult = function(){
 if ( !$cookieStore.get("futuremaker") ) {
 $scope.showModal = true;
 
 }
 else {
 $location.path("/email-template");
 }
 
 };
 
 //controller for search page(campus recruitment,internship,research page)
 
 
 
 
 });
 */
/**
 * Author: Rushikesh Nere
 * (c) Midasfusion.com
 * License: MidasBlue
 */

/** @description
 *This controller provides a utility for posting opportunities for different types like invite mentor,
 *event initation, guest speaker invitation and student availability for Institutes.
 *This module includes logic for posting and editing different opportunities.
 */

//This is controller for opportunity post feature for Institute type
futureMakerApp.controller('InstPostController', function ($scope, $filter, $location, $resource, $http, $cookieStore, dropdownOptionsService, KEYSKILLS, LOCATIONS, ITDOMAINS, NONITDOMAINS, MAJORS, COURSES, FUNCTIONALINTEREST, STREAMS, CONSTANTS, opportunityService, userService) {

    //clear all function
    $scope.clearAll = function () {
        $scope.keySkills = [];
        $scope.major = [];
        $scope.stream = [];
        $scope.course = [];
        $scope.qualification = [];
        $scope.itDomain = [];
        $scope.nonItDomain = [];
        $scope.functionalInterest = [];
        $scope.domains = [];
        $scope.jobLocation = [];
        $scope.startDate = undefined;
        $scope.endDate = undefined;
        $scope.lastDateToApply = undefined;
        $scope.$setPristine(true);
    };

    //Statements below imports user object and opportunity object from angular services respectively	
    $scope.user = userService.getUser();
    $scope.opp = opportunityService.getOpportunity();
    //This gives current day,month and year which is used below for validation purpose
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var month = currentTime.getMonth();
    var day = currentTime.getDate();
    //This loads keyskills options for dropdown menu from dropdownOptionsService

    //This loads ITDomain options for dropdown menu from dropdownOptionsService
    $scope.itDomain = [];
    $scope.itDomainOptions = [ITDOMAINS.count - 1];
    $scope.itDomainOptions = ITDOMAINS.ITDomains;
    $scope.itDomainsConfig = dropdownOptionsService.getITDomainConfig();
    //This loads KeySkills options for dropdown menu from dropdownOptionsService
    $scope.keySkills = [];
    $scope.skillOptions = [KEYSKILLS.count - 1];
    $scope.skillOptions = KEYSKILLS.keyskills;
    $scope.skillConfig = dropdownOptionsService.getSkillsConfig();
    //This loads Non-ITDomain options for dropdown menu from dropdownOptionsService
    $scope.nonItDomain = [];
    $scope.nonItDomainOptions = [NONITDOMAINS.count - 1];
    $scope.nonItDomainOptions = NONITDOMAINS.NonITDomains;
    $scope.nonItDomainsConfig = dropdownOptionsService.getNonITDomainConfig();
    //This loads Major options for dropdown menu from dropdownOptionsService
    $scope.$parent.major = [];
    $scope.majorOptions = [MAJORS.count - 1];
    $scope.majorOptions = MAJORS.majors;
    $scope.majorConfig = dropdownOptionsService.getMajorConfig();
    //This loads Course options for dropdown menu from dropdownOptionsService
    $scope.$parent.course = [];
    $scope.courseOptions = [COURSES.count - 1];
    $scope.courseOptions = COURSES.courses;
    $scope.courseConfig = dropdownOptionsService.getCourseConfig();
    //This loads Stream options for dropdown menu from dropdownOptionsService
    $scope.$parent.stream = [];
    $scope.streamOptions = [STREAMS.count - 1];
    $scope.streamOptions = STREAMS.streams;
    $scope.streamConfig = dropdownOptionsService.getStreamConfig();
    //This loads Year of Passing options for dropdown menu
    //$scope.$parent.yop = [];
    //$scope.yopOptions = [YOPASSING.count - 1];
    //$scope.yopOptions = YOPASSING.yop;
    //$scope.yopConfig = dropdownOptionsService.getYopConfig();

    //This loads FunctionalInterest options for dropdown menu from dropdownOptionsService
    $scope.functionalInterest = [];
    $scope.functionalInterestOptions = [FUNCTIONALINTEREST.count - 1];
    $scope.functionalInterestOptions = FUNCTIONALINTEREST.functionalInterest;
    $scope.functionalInterestConfig = dropdownOptionsService.getFunctionalInterestConfig();
    $scope.offers = [];
    $scope.offers = [
        {name: 'Money', selected: false},
        {name: 'Certificate', selected: false},
        {name: 'Momento', selected: false}
    ];
    // selected fruits
    $scope.selection = [];
    // helper method to get selected fruits
    $scope.selectedOffers = function selectedOffers() {
        return filterFilter($scope.offers, {selected: true});
    };
    // watch fruits for changes
    $scope.$watch('offers|filter:{selected:true}', function (nv) {
        $scope.selection = nv.map(function (offer) {
            return offer.name;
        });
    }, true);
    //    --------------------------date picker configuration functions --------------
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();
    $scope.clear = function () {
        $scope.dt = null;
    };
    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    $scope.minDate = new Date();
    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
                mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6) || (date < new Date());
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };
    $scope.toggleMin();
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };
    $scope.open3 = function () {
        $scope.popup3.opened = true;
    };
    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };
    $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.popup3 = {
        opened: false
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];
    function getDayClass(data) {
        var date = data.date,
                mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
//    --------------------------date picker configuration functions --------------


    $scope.isValid = true;
    $scope.eduDetails = [];
    $scope.addMentorEduDetails = function () {
        //This sets validation for selection of year of passing input in html form
        if (($scope.yop > (year + 4))) {
            alert("Year of Passing value should be upto current year + 4");
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.showBlock || $scope.showBlock1 || $scope.showBlock2 || $scope.showBlock3 || $scope.showBlock4)
        {
            $scope.isValid = true;
            if ($scope.showBlock)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major.length !== 0)
                {
                    $scope.details.major = $scope.major;
                    $scope.majorMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course.length !== 0) {
                    $scope.details.qualification = $scope.course;
                    $scope.courseMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream.length !== 0) {
                    $scope.details.streams = $scope.stream;
                    $scope.streamMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop;
                $scope.details.cgpaMin = $scope.cgpaMin;
                $scope.details.percentageMin = $scope.percentageMin;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }

            if ($scope.showBlock1)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major1.length !== 0)
                {
                    $scope.details.major = $scope.major1;
                    $scope.majorMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage1 = 'Select Major';
                    $scope.isValid = false;
                }
                if ($scope.course1.length !== 0) {
                    $scope.details.qualification = $scope.course1;
                    $scope.courseMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage1 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream1.length !== 0) {
                    $scope.details.streams = $scope.stream1;
                    $scope.streamMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage1 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop1;
                $scope.details.cgpaMin = $scope.cgpaMin1;
                $scope.details.percentageMin = $scope.percentageMin1;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock2)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major2.length !== 0)
                {
                    $scope.details.major = $scope.major2;
                    $scope.majorMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage2 = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course2.length !== 0) {
                    $scope.details.qualification = $scope.course2;
                    $scope.courseMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage2 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream2.length !== 0) {
                    $scope.details.streams = $scope.stream2;
                    $scope.streamMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage2 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop2;
                $scope.details.cgpaMin = $scope.cgpaMin2;
                $scope.details.percentageMin = $scope.percentageMin2;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock3)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major3.length !== 0)
                {
                    $scope.details.major = $scope.major3;
                    $scope.majorMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage3 = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course3.length !== 0) {
                    $scope.details.qualification = $scope.course3;
                    $scope.courseMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage3 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream3.length !== 0) {
                    $scope.details.streams = $scope.stream3;
                    $scope.streamMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage3 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop3;
                $scope.details.cgpaMin = $scope.cgpaMin3;
                $scope.details.percentageMin = $scope.percentageMin3;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock4)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major4.length !== 0)
                {
                    $scope.details.major = $scope.major4;
                    $scope.majorMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage4 = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course4.length !== 0) {
                    $scope.details.qualification = $scope.course4;
                    $scope.courseMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage4 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream4.length !== 0) {
                    $scope.details.streams = $scope.stream4;
                    $scope.streamMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage4 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop4;
                $scope.details.cgpaMin = $scope.cgpaMin4;
                $scope.details.percentageMin = $scope.percentageMin4;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
        } else
        {
            $scope.isValid = false;
            alert("Please Add Eligibility Criteria");
            $scope.eduDetails = [];
        }
    };
    //This function copies html form data to "mentorTypeFields" object and then to "opportunity" object	
    $scope.copyMentorOpportunity = function () {

        //Statements below checks if "lastDateToApply" field is undefined and sets date after 1 year by default, if undefined		
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
        {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            $scope.lastDateToApplyString = (day + '-' + monthNames[(month)] + '-' + (year + 1));
            $scope.lastDateToApply = new Date($scope.lastDateToApplyString);
        } else
        {
            $scope.lastDateToApplyString = $filter('date')($scope.lastDateToApply, "dd-MMM-yyyy");
        }
        $opportunity = {};
        $mentorTypeFields = {};
        $mentorTypeFields.mentorOpportunityDescription = $scope.opportunityDescription;
        $mentorTypeFields.mentorSummary = $scope.summary;
        if ($scope.keySkills.length !== 0)
        {
            $mentorTypeFields.mentorKeySkills = $scope.keySkills;
            $scope.isValid = $scope.isValid && true;
            $scope.skillMessage = undefined;
        } else
        {
            $scope.skillMessage = 'Select Key Skills';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.itDomain.length !== 0 || $scope.nonItDomain.length !== 0)
        {
            if ($scope.itDomain.length !== 0) {
                $mentorTypeFields.mentorItDomain = $scope.itDomain;
            }
            if ($scope.nonItDomain.length !== 0)
                $mentorTypeFields.mentorNonItDomain = $scope.nonItDomain;
            $scope.isValid = $scope.isValid && true;
            $scope.domainMessage = undefined;
        } else
        {
            $scope.domainMessage = 'Select Domains (IT/NON-IT)';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.functionalInterest.length !== 0)
        {
            $mentorTypeFields.mentorFunction = $scope.functionalInterest;
            $scope.isValid = $scope.isValid && true;
            $scope.interestMessage = undefined;
        } else
        {
            $scope.interestMessage = 'Select Functional Interest';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        $mentorTypeFields.mentorEduDetails = $scope.eduDetails;
        $mentorTypeFields.mentorMinExp = $scope.minExperience;
        $mentorTypeFields.mentorMaxExp = $scope.maxExperience;
        var mentorTypeFields = $mentorTypeFields;
                $opportunity = {mentorTypeFields};
        $opportunity.type = $scope.type;
        $opportunity.lastDateToApply = $scope.lastDateToApplyString;
    };
    //This function copies html form data to "eventFields" object and then to "opportunity" object	
    $scope.copyEventOpportunity = function () {
        // check to make sure the form is completely valid
        //if (isValid) { 
        $scope.isValid = true;
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
        {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            $scope.lastDateToApplyString = (day + '-' + monthNames[(month)] + '-' + (year + 1));
            $scope.lastDateToApply = new Date($scope.lastDateToApplyString);
        } else
        {
            $scope.lastDateToApplyString = $filter('date')($scope.lastDateToApply, "dd-MMM-yyyy");
        }

        $opportunity = {};
        $eventFields = {};
        $eventFields.eventSummary = $scope.summary;
        if ($scope.eventDate !== undefined) {
            var dateAsString = $filter('date')($scope.eventDate, "dd-MMM-yyyy");
            $eventFields.eventDate = dateAsString;
            $scope.isValid = $scope.isValid && true;
            $scope.eventDateMessage = undefined;
        } else
        {
            $scope.eventDateMessage = 'Please Select Event Date';
            $scope.isValid = false;
        }
        if ($scope.itDomain.length !== 0 || $scope.nonItDomain.length !== 0)
        {
            if ($scope.itDomain.length !== 0) {
                $eventFields.eventItDomainDetails = $scope.itDomain;
            }
            if ($scope.nonItDomain.length !== 0)
                $eventFields.eventNonItDomainDetails = $scope.nonItDomain;
            $scope.isValid = $scope.isValid && true;
            $scope.domainMessage = undefined;
        } else
        {
            $scope.domainMessage = 'Select Domains (IT/NON-IT)';
            $scope.isValid = false;
        }
        if ($scope.functionalInterest.length !== 0)
        {
            $eventFields.eventFunctionDetails = $scope.functionalInterest;
            $scope.isValid = $scope.isValid && true;
            $scope.interestMessage = undefined;
        } else
        {
            $scope.interestMessage = 'Select Functional Interest';
            $scope.isValid = false;
        }



        $eventFields.eventPaidOrFree = $scope.pf;
        $eventFields.eventOfferings = $scope.selection;
        var eventFields = $eventFields;
                $opportunity = {eventFields};
        $opportunity.type = $scope.type;
        $opportunity.lastDateToApply = $scope.lastDateToApplyString;
        //}	
    };
    //This function copies html form data to "guestFields" object and then to "opportunity" object	
    $scope.copyGuestOpportunity = function () {

        // check to make sure the form is completely valid
        //if (isValid) { 
        $scope.isValid = true;
        //Statements below checks if "lastDateToApply" field is undefined and sets date after 1 year by default, if undefined
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
        {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            $scope.lastDateToApplyString = (day + '-' + monthNames[(month)] + '-' + (year + 1));
            $scope.lastDateToApply = new Date($scope.lastDateToApplyString);
        } else
        {
            $scope.lastDateToApplyString = $filter('date')($scope.lastDateToApply, "dd-MMM-yyyy");
        }
        $scope.offers = [];
        $opportunity = {};
        $guestFields = {};
        $guestFields.guestTopic = $scope.topic;
        if ($scope.eventDate !== undefined) {
            var dateAsString = $filter('date')($scope.eventDate, "dd-MMM-yyyy");
            $guestFields.guestInviteDate = dateAsString;
            $scope.isValid = $scope.isValid && true;
            $scope.eventDateMessage = undefined;
        } else
        {
            $scope.eventDateMessage = 'Please Select Event Date';
            $scope.isValid = false;
        }

        $guestFields.guestMinExp = $scope.minExp;
        $guestFields.guestMaxExp = $scope.maxExp;
        if ($scope.keySkills.length !== 0)
        {
            $guestFields.guestKeySkills = $scope.keySkills;
            $scope.isValid = $scope.isValid && true;
            $scope.skillMessage = undefined;
        } else
        {
            $scope.skillMessage = 'Select Key Skills Required';
            $scope.isValid = false;
        }

        if ($scope.itDomain.length !== 0 || $scope.nonItDomain.length !== 0)
        {
            if ($scope.itDomain.length !== 0) {
                $guestFields.guestItDomain = $scope.itDomain;
            }
            if ($scope.nonItDomain.length !== 0)
                $guestFields.guestNonItDomain = $scope.nonItDomain;
            $scope.isValid = $scope.isValid && true;
            $scope.domainMessage = undefined;
        } else
        {
            $scope.domainMessage = 'Select Domains (IT/NON-IT)';
            $scope.isValid = false;
        }
        if ($scope.functionalInterest.length !== 0)
        {
            $guestFields.guestFunction = $scope.functionalInterest;
            $scope.isValid = $scope.isValid && true;
            $scope.interestMessage = undefined;
        } else
        {
            $scope.interestMessage = 'Select Functional Interest';
            $scope.isValid = false;
        }

        $guestFields.guestPaidOrFree = $scope.pf;
        if ($scope.selection.length !== 0)
            $guestFields.guestOfferings = $scope.selection;
        var guestFields = $guestFields;
                $opportunity = {guestFields};
        $opportunity.type = $scope.type;
        $opportunity.lastDateToApply = $scope.lastDateToApplyString;
    };
    //This function send http post request with API and opportunity object as parameters to post data to database
    $scope.postEventOpportunity = function () {

        //This authenticate user for permissions					
        if ($scope.isValid) {
            $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.collegeId) || ($scope.user.orgId)) + ':' + ($scope.user.password));
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.post(CONSTANTS.SERVICES.OPPORTUNITIES1, $opportunity).success(function ($opportunity) {
                alert('Opportunity posted successfully!!!');
                //Statement below redirects to posted opportunity page
                $location.path("/home/inst-posted");
            }).error(function (error)
            {
                alert(error.error);
            });
        }
    };
    //This function is used to edit mentorship opportunity
    $scope.editMentorOpportunity = function () {

        //Statements below checks if "lastDateToApply" field is undefined and sets date after 1 year by default, if undefined
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
        {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            $scope.lastDateToApplyString = (day + '-' + monthNames[(month)] + '-' + (year + 1));
            $scope.lastDateToApply = new Date($scope.lastDateToApplyString);
        } else
        {
            $scope.lastDateToApplyString = $filter('date')($scope.lastDateToApply, "dd-MMM-yyyy");
        }
        $opportunity = {};
        $mentorTypeFields = {};
        //This copies data from selected opportunity to "$mentorTypeFields" object	
        $mentorTypeFields = $scope.opp.mentorTypeFields;
        var mentorTypeFields = $mentorTypeFields;
        $opportunity = mentorTypeFields;
        $opportunity.type = $scope.opp.type;
        $opportunity.lastDateToApply = $scope.opp.lastDateToApply;
        //This authenticate user for permissions		
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        //This sends http put request(for overwriting existing data) with API and opportunity object as a parameter
        $http.put(CONSTANTS.SERVICES.OPPORTUNITIES1 + '/' + $scope.opp.id, $opportunity).success(function ($opportunity) {
            alert('Opportunity posted successfully!!!');
            //Statement below redirects to posted opportunity page
            $location.path("/home/inst-posted");
        });
    };
    //This function is used to edit event invitation opportunity
    $scope.editEventOpportunity = function () {

        //Statements below checks if "lastDateToApply" field is undefined and sets date after 1 year by default, if undefined	
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
            $scope.lastDateToApply = (day + '-' + (month) + '-' + (year + 1));
        $scope.opp.eventFields.eventFunctionDetails = [];
        $opportunity = {};
        $eventFields = {};
        //This copies data from selected opportunity to "eventFields" object and then to "opportunity" object
        $eventFields = $scope.opp.eventFields;
        var eventFields = $eventFields;
        $opportunity = eventFields;
        $opportunity.type = $scope.opp.type;
        $opportunity.lastDateToApply = $scope.opp.lastDateToApply;
        //This authenticate user for permissions			
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        //This sends http put request(for overwriting existing data) with API and opportunity object as a parameter
        $http.put(CONSTANTS.SERVICES.OPPORTUNITIES1 + '/' + $scope.opp.id, $opportunity).success(function ($opportunity) {
            alert('Opportunity posted successfully!!!');
            //Statement below redirects to posted opportunity page
            $location.path("/home/inst-posted");
        });
    };
});
/**
 * Author: Rushikesh Nere
 * (c) Midasfusion.com
 * License: MidasBlue
 */

/** @description
 *This controller provides a utility for getting and deleting opportunities for different types like invite mentor,
 *event initation, guest speaker invitation and student availability for Organizations.
 *This module includes logic for getting and deleting different posted opportunities.
 */
//This is controller for getting and deleting opportunities posted by Institute type
futureMakerApp.controller('InstPostGetController', function ($scope, emailTemplateService, $location, $window, $http, $cookieStore, CONSTANTS, opportunityService, userService) {

    //This gets user object and opportunity object from respective services
    $scope.user = userService.getUser();
    $scope.opp = opportunityService.getOpportunity();
    //This authenticates user for permissions
    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.collegeId) || ($scope.user.orgId)) + ':' + ($scope.user.password));
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    //This send http get request to server with API and user object as parameters
    $http.get(CONSTANTS.SERVICES.OPPORTUNITIES1, $scope.user).success(function ($opportunity) {
        $scope.opportunities = $opportunity;
    });
    //This function copies specific opportunity for editing or copying
    $scope.copyOpp = function (opportunity, action) {
        var a = opportunity;
        a.action = action;
        opportunityService.addOpportunity(a);
        switch (opportunity.type) {
            case 'mentorship':
                $location.path("/home/mentor-for-inst-edit");
                break;
            case 'event':
                $location.path("/home/event-for-inst-edit");
                break;
            case 'guest':
                $location.path("/home/speaker-for-inst-edit");
                break;
            default:
                break;
        }
    };
    $scope.saveAsEmail = function (opportunity) {
        switch (opportunity.type) {
            case 'mentorship':
                angular.forEach(opportunity.mentorTypeFields.mentorKeySkills, function (item, index) {

                    if (index === 0)
                    {
                        $skills = item;
                    } else
                    {
                        $skills = $skills + ',' + item;
                    }
                });
                $subject = "Shortlisted for " + opportunity.mentorTypeFields.mentorSummary;
                $body = "Greetings From Midas Fusion\n\nCongratulations You Are Shortlisted for a opportunity \n\nJob Description:\n" + opportunity.mentorTypeFields.mentorOpportunityDescription;
                $body = $body + "\n\nExperirence Required: " + opportunity.mentorTypeFields.mentorMinExp + ' to ' + opportunity.mentorTypeFields.mentorMaxExp + ' year(s)';
                $body = $body + "\n\nSkills Required: " + $skills;
                $signature = "Thanks and Regards\n" + opportunity.ownerFields.name;
                $template = {
                    jobDescription: $body,
                    positionName: opportunity.mentorTypeFields.mentorSummary,
                    senderEmail: opportunity.ownerFields.emailId,
                    signature: $signature,
                    subject: $subject
                };
                break;
            case 'guest':
                angular.forEach(opportunity.guestFields.guestKeySkills, function (item, index) {

                    if (index === 0)
                    {
                        $skills = item;
                    } else
                    {
                        $skills = $skills + ',' + item;
                    }
                });
                $subject = "Invitation As Guest Speaker";
                $body = "Greetings From Midas Fusion\n\nWe Are Glad To Invite You As A Guest Speaker \n\nDescription:\nTopic: " + opportunity.guestFields.guestTopic + "\nDate: " + opportunity.guestFields.guestInviteDate;
                $body = $body + "\n\nExperirence Required: " + opportunity.guestFields.guestMinExp + ' to ' + opportunity.guestFields.guestMaxExp + ' year(s)';
                $body = $body + "\n\nSkills Required: " + $skills;
                $signature = "Thanks and Regards\n" + opportunity.ownerFields.name;
                $template = {
                    jobDescription: $body,
                    positionName: opportunity.guestFields.guestTopic,
                    senderEmail: opportunity.ownerFields.emailId,
                    signature: $signature,
                    subject: $subject
                };
                break;
            case 'event':
                angular.forEach(opportunity.eventFields.eventOfferings, function (item, index) {

                    if (index === 0)
                    {
                        $skills = item;
                    } else
                    {
                        $skills = $skills + ',' + item;
                    }
                });
                $subject = "Invitation For Event";
                $body = "Greetings From Midas Fusion\n\nWe Are Glad To Invite You To The Following Event \n\nDescription:\nName: " + opportunity.eventFields.eventSummary + "\nDate: " + opportunity.eventFields.eventDate;
                $body = $body + "\n\nEvent Offerings: " + $skills;
                $body = $body + "\n\nEvent Paid Or Free: " + opportunity.eventFields.eventPaidOrFree;
                $signature = "Thanks and Regards\n" + opportunity.ownerFields.name;
                $template = {
                    jobDescription: $body,
                    positionName: opportunity.eventFields.eventSummary,
                    senderEmail: opportunity.ownerFields.emailId,
                    signature: $signature,
                    subject: $subject
                };
                break;
        }

        emailTemplateService.addTemplate($template);
    };
    //This function is used to delete specific opportunity
    $scope.postDeleteOpportunity = function (opportunity) {

        var a = opportunity;
        opportunityService.addOpportunity(a);
        $scope.opp = opportunityService.getOpportunity();
        //This authenticates user for performing delete operation
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        //This confirms deletion operation with popup for confirmation		
        var deleteOpp = $window.confirm('Are you sure you want to permanently delete the opportunity?');
        if (deleteOpp) {

            $http.delete(CONSTANTS.SERVICES.OPPORTUNITIES1 + '/' + $scope.opp.id, $scope.opp).success(function ($opportunity) {
                alert('Opportunity deleted successfully!');
                //$location.path("/home/org-post/org-posted");
                $window.location.reload();
            });
        }
    };
    //This is used for required date format
    $scope.getDateFormat = function (timestamp) {
        return new Date(timestamp);
    };
    //This function is used for showing datatable

    // var table = $('#bootstrap-table').DataTable();
    //table.destroy();
    setTimeout(function () {

        //table = 
        $('#bootstrap-table').DataTable(
                // {

                //"order": [[ 3, "desc" ]]
                //}
                );
    }, 300);
});
futureMakerApp.controller('MentSearchController', function ($scope, $location, $resource, $window, $http, $cookieStore, searchURLService, dropdownOptionsService, KEYSKILLS, LOCATIONS, ITDOMAINS, NONITDOMAINS, MAJORS, COURSES, FUNCTIONALINTEREST, STREAMS, CONSTANTS, searchService, userService) {
    $scope.user = userService.getUser();
    $scope.keySkills;
    $scope.skillOptions = [KEYSKILLS.count - 1];
    $scope.skillOptions = KEYSKILLS.keyskills;
    $scope.skillConfig = dropdownOptionsService.getSkillsConfig();
    //This loads ITDomain options for dropdown menu from dropdownOptionsService
    $scope.itDomain;
    $scope.itDomainOptions = [ITDOMAINS.count - 1];
    $scope.itDomainOptions = ITDOMAINS.ITDomains;
    $scope.itDomainsConfig = dropdownOptionsService.getITDomainConfig();
    //This loads NonITDomain options for dropdown menu from dropdownOptionsService
    $scope.nonItDomain;
    $scope.nonItDomainOptions = [NONITDOMAINS.count - 1];
    $scope.nonItDomainOptions = NONITDOMAINS.NonITDomains;
    $scope.nonItDomainsConfig = dropdownOptionsService.getNonITDomainConfig();
    //This loads Major options for dropdown menu from dropdownOptionsService
    $scope.$parent.major;
    $scope.majorOptions = [MAJORS.count - 1];
    $scope.majorOptions = MAJORS.majors;
    $scope.majorConfig = dropdownOptionsService.getMajorConfig();
    //This loads Location options for dropdown menu from dropdownOptionsService
    $scope.jobLocation;
    $scope.locationOptions = [LOCATIONS.count - 1];
    $scope.locationOptions = LOCATIONS.location;
    $scope.locationConfig = dropdownOptionsService.getLocationConfig();
    //This loads Course options for dropdown menu from dropdownOptionsService
    $scope.$parent.course;
    $scope.courseOptions = [COURSES.count - 1];
    $scope.courseOptions = COURSES.courses;
    $scope.courseConfig = dropdownOptionsService.getCourseConfig();
    //This loads Year of Passing options for dropdown menu from dropdownOptionsService
    //$scope.$parent.yop = [];
    //$scope.yopOptions = [YOPASSING.count - 1];
    //$scope.yopOptions = YOPASSING.yop;
    //$scope.yopConfig = dropdownOptionsService.getYopConfig();

    //This loads FunctionalInterest options for dropdown menu from dropdownOptionsService
    $scope.functionalInterest;
    $scope.functionalInterestOptions = [FUNCTIONALINTEREST.count - 1];
    $scope.functionalInterestOptions = FUNCTIONALINTEREST.functionalInterest;
    $scope.functionalInterestConfig = dropdownOptionsService.getFunctionalInterestConfig();
    //This loads Stream options for dropdown menu from dropdownOptionsService
    $scope.$parent.stream;
    $scope.streamOptions = [STREAMS.count - 1];
    $scope.streamOptions = STREAMS.streams;
    $scope.streamConfig = dropdownOptionsService.getStreamConfig();
    $scope.sendJobData = function () {

        if ($scope.major === undefined && $scope.course === undefined && $scope.stream === undefined && $scope.title === undefined && $scope.jobLocation === undefined && $scope.areaOfExpertise === undefined && $scope.maxExp === undefined && $scope.minExp === undefined && $scope.cgpa === undefined && $scope.percentage === undefined)
        {
            alert('Please Enter Atleast One Field');
        } else {


            //angular.isUndefined($scope.gradeMax);
            if ($scope.cgpa === undefined)
                $scope.cgpa = 'null';
            //angular.isUndefined($scope.gradeMin);
            if ($scope.percentage === undefined)
                $scope.percentage = 'null';
            if ($scope.minExp === undefined)
                $scope.minExp = 'null';
            //angular.isUndefined($scope.gradeMin);
            if ($scope.maxExp === undefined)
                $scope.maxExp = 'null';
            // use $.param jQuery function to serialize data from JSON 
            $scope.jobLocationString = '';
            angular.forEach($scope.jobLocation, function (item, index) {
                if (index !== 0)
                    $scope.jobLocationString = $scope.jobLocationString + ',' + item;
                else
                    $scope.jobLocationString = item;
            });
            $scope.keySkillsString = '';
            angular.forEach($scope.areaOfExpertise, function (item, index) {
                if (index !== 0)
                    $scope.keySkillsString = $scope.keySkillsString + ',' + item;
                else
                    $scope.keySkillsString = item;
            });
            $scope.streamString = '';
            angular.forEach($scope.stream, function (item, index) {
                if (index !== 0)
                    $scope.streamString = $scope.streamString + ',' + item;
                else
                    $scope.streamString = item;
            });
            $scope.qualificationString = '';
            angular.forEach($scope.course, function (item, index) {
                if (index !== 0)
                    $scope.qualificationString = $scope.qualificationString + ',' + item;
                else
                    $scope.qualificationString = item;
            });
            $scope.majorString = '';
            angular.forEach($scope.major, function (item, index) {
                if (index !== 0)
                    $scope.majorString = $scope.majorString + ',' + item;
                else
                    $scope.majorString = item;
            });
            var data = $.param({
                jobTitle: $scope.title,
                skillsRequire: $scope.keySkillsString,
                jobLocation: $scope.jobLocationString,
                minExp: $scope.minExp,
                maxExp: $scope.maxExp,
                cgpa: $scope.cgpa,
                percentage: $scope.percentage,
                major: $scope.majorString,
                qualification: $scope.qualificationString,
                stream: $scope.streamString,
                type: $scope.type
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            $authdata = utilities.Base64.encode($scope.user.username + ':' + $scope.user.password);
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

            var address = $location.url(CONSTANTS.SERVICES.JOBSEARCH).search(data);
            var newAddress = address.$$url;
            $scope.Add = newAddress.slice(1);
            $http.get($scope.Add, data, config).success(function (data, status, headers, config) {
                $scope.results = data;
                $scope.res = $scope.results.hits.hits;
                $scope.res.total = $scope.results.hits.total; //[0]._source;
                searchURLService.addURL($scope.Add);
                searchService.addSearch($scope.res);
                $location.path("/org-search-result");
            });
        }
    };
    $scope.sendMentorShipData = function () {
        if ($scope.major === undefined && $scope.course === undefined && $scope.stream === undefined && $scope.title === undefined && $scope.functionalInterest === undefined && $scope.keySkills === undefined && $scope.itDomain === undefined && $scope.nonItDomain === undefined)
        {
            alert('Please Enter Atleast One Field');
        } else {
            //angular.isUndefined($scope.yopMin);



            //angular.isUndefined($scope.gradeMax);
            if ($scope.expMin === undefined)
                $scope.expMin = 'null';
            //angular.isUndefined($scope.gradeMin);
            if ($scope.expMax === undefined)
                $scope.expMax = 'null';
            // use $.param jQuery function to serialize data from JSON 
            $scope.itDomainString = '';
            angular.forEach($scope.itDomain, function (item, index) {

                if (index !== 0)
                    $scope.itDomainString = $scope.itDomainString + ',' + item;
                else
                    $scope.itDomainString = item;
            });
            $scope.nonItDomainString = '';
            angular.forEach($scope.nonItDomain, function (item, index) {

                if (index !== 0)
                    $scope.nonItDomainString = $scope.nonItDomainString + ',' + item;
                else
                    $scope.nonItDomainString = item;
            });
            $scope.functionalInterestString = '';
            angular.forEach($scope.functionalInterest, function (item, index) {
                if (index !== 0)
                    $scope.functionalInterestString = $scope.functionalInterestString + ',' + item;
                else
                    $scope.functionalInterestString = item;
            });
            $scope.keySkillsString = '';
            angular.forEach($scope.keySkills, function (item, index) {
                if (index !== 0)
                    $scope.keySkillsString = $scope.keySkillsString + ',' + item;
                else
                    $scope.keySkillsString = item;
            });
            $scope.streamString = '';
            angular.forEach($scope.stream, function (item, index) {
                if (index !== 0)
                    $scope.streamString = $scope.streamString + ',' + item;
                else
                    $scope.streamString = item;
            });
            $scope.qualificationString = '';
            angular.forEach($scope.course, function (item, index) {
                if (index !== 0)
                    $scope.qualificationString = $scope.qualificationString + ',' + item;
                else
                    $scope.qualificationString = item;
            });
            $scope.majorString = '';
            angular.forEach($scope.major, function (item, index) {
                if (index !== 0)
                    $scope.majorString = $scope.majorString + ',' + item;
                else
                    $scope.majorString = item;
            });
            var data = $.param({
                mentorTitle: $scope.title,
                mentorKeySkills: $scope.keySkillsString,
                mentorItDomain: $scope.itDomainString,
                mentorNonItDomain: $scope.nonItDomainString,
                mentorfunction: $scope.functionalInterestString,
                stream: $scope.streamString,
                qualification: $scope.qualificationString,
                major: $scope.majorString

            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            $authdata = utilities.Base64.encode($scope.user.username + ':' + $scope.user.password);
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

            var address = $location.url(CONSTANTS.SERVICES.MENTORSHIPSEARCH).search(data);
            var newAddress = address.$$url;
            $scope.Add = newAddress.slice(1);
            $http.get($scope.Add, data, config).success(function (data, status, headers, config) {
                $scope.results = data;
                $scope.res = $scope.results.hits.hits;
                $scope.res.total = $scope.results.hits.total; //[0]._source;
                searchURLService.addURL($scope.Add);
                searchService.addSearch($scope.res);
                $location.path("/org-search-result");
            });
        }

    };
    $scope.sendMenteeShipData = function () {

        if ($scope.cgpaMin === undefined && $scope.percentageMin === undefined && $scope.major === undefined && $scope.course === undefined && $scope.stream === undefined && $scope.title === undefined && $scope.yopMin === undefined && $scope.yopMax === undefined && $scope.menteeMinExp === undefined && $scope.menteeMaxExp === undefined)
        {
            alert('Please Enter Atleast One Field');
        } else {
            //angular.isUndefined($scope.yopMin);

            //angular.isUndefined($scope.jeeMainMin);
            if ($scope.yopMin === undefined)
                $scope.yopMin = 'null';
            //angular.isUndefined($scope.gradeMax);
            if ($scope.yopMax === undefined)
                $scope.yopMax = 'null';
            //angular.isUndefined($scope.gradeMin);
            if ($scope.menteeMinExp === undefined)
                $scope.menteeMinExp = 'null';
            if ($scope.menteeMaxExp === undefined)
                $scope.menteeMaxExp = 'null';
            if ($scope.cgpaMin === undefined)
                $scope.cgpaMin = 'null';
            if ($scope.percentageMin === undefined)
                $scope.percentageMin = 'null';
            $scope.streamString = '';
            angular.forEach($scope.stream, function (item, index) {
                if (index !== 0)
                    $scope.streamString = $scope.streamString + ',' + item;
                else
                    $scope.streamString = item;
            });
            $scope.qualificationString = '';
            angular.forEach($scope.course, function (item, index) {
                if (index !== 0)
                    $scope.qualificationString = $scope.qualificationString + ',' + item;
                else
                    $scope.qualificationString = item;
            });
            $scope.majorString = '';
            angular.forEach($scope.major, function (item, index) {
                if (index !== 0)
                    $scope.majorString = $scope.majorString + ',' + item;
                else
                    $scope.majorString = item;
            });
            // use $.param jQuery function to serialize data from JSON 
            var data = $.param({
                major: $scope.majorString,
                title: $scope.title,
                qualification: $scope.qualificationString,
                stream: $scope.streamString,
                yopMax: $scope.yopMax,
                yopMin: $scope.yopMin,
                menteeMinExp: $scope.menteeMinExp,
                menteeMaxExp: $scope.menteeMaxExp,
                cgpaMin: $scope.cgpaMin,
                percentageMin: $scope.percentageMin,
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var address = $location.url(CONSTANTS.SERVICES.MENTEESHIPSEARCH).search(data);
            var newAddress = address.$$url;
            $scope.Add = newAddress.slice(1);
            $authdata = utilities.Base64.encode($scope.user.username + ':' + $scope.user.password);
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

            $http.get($scope.Add, data, config).success(function (data, status, headers, config) {
                $scope.results = data;
                $scope.res = $scope.results.hits.hits;
                $scope.res.total = $scope.results.hits.total; //[0]._source;
                searchURLService.addURL($scope.Add);
                searchService.addSearch($scope.res);
                $location.path("/org-search-result");
            });
        }

    };
    $scope.sendData1 = function () {

        //angular.isUndefined($scope.yopMin);
        if ($scope.yopMin === undefined)
            $scope.yopMin = 'null';
        //angular.isUndefined($scope.yopMax);
        if ($scope.yopMax === undefined)
            $scope.yopMax = 'null';
        //angular.isUndefined($scope.jeeMainMin);
        if ($scope.jeeMainMin === undefined)
            $scope.jeeMainMin = 'null';
        //angular.isUndefined($scope.jeeMainMax);
        if ($scope.jeeMainMax === undefined)
            $scope.jeeMainMax = 'null';
        //angular.isUndefined($scope.jeeAdvMin);
        if ($scope.jeeAdvMin === undefined)
            $scope.jeeAdvMin = 'null';
        //angular.isUndefined($scope.jeeAdvMax);
        if ($scope.jeeAdvMax === undefined)
            $scope.jeeAdvMax = 'null';
        //angular.isUndefined($scope.gradeMax);
        if ($scope.gradeMax === undefined)
            $scope.gradeMax = 'null';
        //angular.isUndefined($scope.gradeMin);
        if ($scope.gradeMin === undefined)
            $scope.gradeMin = 'null';
        //angular.isUndefined($scope.minExp);
        if ($scope.minExp === undefined)
            $scope.minExp = 'null';
        //angular.isUndefined($scope.maxExp);
        if ($scope.maxExp === undefined)
            $scope.maxExp = 'null';
        // use $.param jQuery function to serialize data from JSON 
        var data1 = $.param({
            interest: $scope.jobInterest,
            anyKeyword: $scope.anyKeyword,
            allKeyword: $scope.allKeyword,
            exKeyword: $scope.exKeyword,
            itDomain: $scope.itDomain,
            nonItDomain: $scope.nonItDomain,
            fieldOfStudy: $scope.stream,
            currentLocation: $scope.jobLocation,
            functionInterest: $scope.functionalInterest,
            jobTitle: $scope.title,
            areaOfExpertise: $scope.areaOfExpertise,
            minExp: $scope.minExp,
            maxExp: $scope.maxExp
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        var address = $location.url(CONSTANTS.SERVICES.SEARCHES1).search(data1);
        var newAddress = address.$$url;
        $scope.Add = newAddress.slice(1);
        $authdata = utilities.Base64.encode($scope.user.username + ':' + $scope.user.password);
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

        $http.get($scope.Add, data1, config).success(function (data, status, headers, config) {
            $scope.results = data;
            $scope.res = $scope.results.hits.hits;
            $scope.res.total = $scope.results.hits.total; //[0]._source;
            searchURLService.addURL($scope.Add);
            searchService.addSearch($scope.res);
            $location.path("/org-search-result");
        });
    };
    $scope.sendData2 = function () {

        // use $.param jQuery function to serialize data from JSON 
        var data2 = $.param({
            collegeType: $scope.instType,
            streams: $scope.stream,
            location: $scope.jobLocation,
            interest: $scope.jobInterest
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        var address = $location.url(CONSTANTS.SERVICES.SEARCHES2).search(data2);
        var newAddress = address.$$url;
        $scope.Add = newAddress.slice(1);
        $authdata = utilities.Base64.encode($scope.user.username + ':' + $scope.user.password);
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

        $http.get($scope.Add, data2, config).success(function (data, status, headers, config) {
            $scope.results = data;
            $scope.res = $scope.results.hits.hits;
            $scope.res.total = $scope.results.hits.total; //[0]._source;
            searchService.addSearch($scope.res);
            searchURLService.addURL($scope.Add);
            $location.path("/org-search-result");
        });
    };
    $scope.sendData3 = function () {

        // use $.param jQuery function to serialize data from JSON 
        var data3 = $.param({
            eventSummary: $scope.title,
            eventItDomainDetails: $scope.itDomain,
            eventNonItDomainDetails: $scope.nonItDomain,
            eventFunctionDetails: $scope.functionalInterest,
            eventPaidOrFree: $scope.paidOrFree
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        var address = $location.url(CONSTANTS.SERVICES.SEARCHES3).search(data3);
        var newAddress = address.$$url;
        $scope.Add = newAddress.slice(1);
        $authdata = utilities.Base64.encode($scope.user.username + ':' + $scope.user.password);
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;

        $http.get($scope.Add, data3, config).success(function (data, status, headers, config) {
            $scope.results = data;
            $scope.res = $scope.results.hits.hits;
            $scope.res.total = $scope.results.hits.total; //[0]._source;
            searchURLService.addURL($scope.Add);
            searchService.addSearch($scope.res);
            $location.path("/org-search-result");
        });
    };
    $scope.showModal = false;
    $scope.searchResult = function () {
        if (!$cookieStore.get("futuremaker")) {
            $scope.showModal = true;
        } else {
            $location.path("/org-search-result");
        }
    };
});
/**
 * Author: Rushikesh Nere
 * (c) Midasfusion.com
 * License: MidasBlue
 */

/** @description
 *This controller provides a utility for posting opportunities for different types like job,
 *internship, research project and mentee search for Mentors.
 *This module includes logic for posting and editing different opportunities.
 */

//This is controller for opportunity post feature for Mentor type
futureMakerApp.controller('MentorPostController', function ($scope, $filter, $location, $resource, $http, $cookieStore, dropdownOptionsService, KEYSKILLS, LOCATIONS, ITDOMAINS, NONITDOMAINS, MAJORS, COURSES, FUNCTIONALINTEREST, STREAMS, CONSTANTS, opportunityService, userService) {

    //Statements below imports user object and opportunity object from angular services respectively
    $scope.user = userService.getUser();
    $scope.opp = opportunityService.getOpportunity();
    //This gives current day,month and year which is used below for validation purpose
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var month = currentTime.getMonth();
    var day = currentTime.getDate();
    //This loads keyskills options for dropdown menu from dropdownOptionsService
    $scope.keySkills = [];
    $scope.skillOptions = [KEYSKILLS.count - 1];
    $scope.skillOptions = KEYSKILLS.keyskills;
    $scope.skillConfig = dropdownOptionsService.getSkillsConfig();
    //This loads ITDomain options for dropdown menu from dropdownOptionsService
    $scope.itDomain = [];
    $scope.itDomainOptions = [ITDOMAINS.count - 1];
    $scope.itDomainOptions = ITDOMAINS.ITDomains;
    $scope.itDomainsConfig = dropdownOptionsService.getITDomainConfig();
    //This loads Non-ITDomain options for dropdown menu from dropdownOptionsService
    $scope.nonItDomain = [];
    $scope.nonItDomainOptions = [NONITDOMAINS.count - 1];
    $scope.nonItDomainOptions = NONITDOMAINS.NonITDomains;
    $scope.nonItDomainsConfig = dropdownOptionsService.getNonITDomainConfig();
    //This loads Major options for dropdown menu from dropdownOptionsService
    $scope.$parent.major = [];
    $scope.majorOptions = [MAJORS.count - 1];
    $scope.majorOptions = MAJORS.majors;
    $scope.majorConfig = dropdownOptionsService.getMajorConfig();
    //This loads Location options for dropdown menu from dropdownOptionsService
    $scope.jobLocation = [];
    $scope.locationOptions = [LOCATIONS.count - 1];
    $scope.locationOptions = LOCATIONS.location;
    $scope.locationConfig = dropdownOptionsService.getLocationConfig();
    //This loads Course options for dropdown menu from dropdownOptionsService
    $scope.$parent.course = [];
    $scope.courseOptions = [COURSES.count - 1];
    $scope.courseOptions = COURSES.courses;
    $scope.courseConfig = dropdownOptionsService.getCourseConfig();
    //This loads Year of Passing options for dropdown menu from dropdownOptionsService
    //$scope.$parent.yop = [];
    //$scope.yopOptions = [YOPASSING.count - 1];
    //$scope.yopOptions = YOPASSING.yop;
    //$scope.yopConfig = dropdownOptionsService.getYopConfig();

    //This loads FunctionlInterest options for dropdown menu from dropdownOptionsService	
    $scope.functionalInterest = [];
    $scope.functionalInterestOptions = [FUNCTIONALINTEREST.count - 1];
    $scope.functionalInterestOptions = FUNCTIONALINTEREST.functionalInterest;
    $scope.functionalInterestConfig = dropdownOptionsService.getFunctionalInterestConfig();
    //This loads Stream options for dropdown menu from dropdownOptionsService
    $scope.$parent.stream = [];
    $scope.streamOptions = [STREAMS.count - 1];
    $scope.streamOptions = STREAMS.streams;
    $scope.streamConfig = dropdownOptionsService.getStreamConfig();
    $scope.types = []
    $scope.types = [
        {name: 'IITs', selected: false},
        {name: 'NITs', selected: false},
        {name: 'Deemed Universities', selected: false},
        {name: 'Autonomous', selected: false},
        {name: 'Others', selected: false}
    ];
    // selected fruits
    $scope.selection = [];
    // helper method to get selected fruits
    $scope.selectedTypes = function selectedTypes() {
        return filterFilter($scope.types, {selected: true});
    };
    //clear all function
    $scope.clearAll = function () {
        $scope.keySkills = [];
        $scope.major = [];
        $scope.stream = [];
        $scope.course = [];
        $scope.qualification = [];
        $scope.itDomain = [];
        $scope.nonItDomain = [];
        $scope.functionalInterest = [];
        $scope.domains = [];
        $scope.jobLocation = [];
        $scope.startDate = undefined;
        $scope.endDate = undefined;
        $scope.lastDateToApply = undefined;
        $scope.$setPristine(true);
    };

    // watch fruits for changes
    $scope.$watch('types|filter:{selected:true}', function (nv) {
        $scope.selection = nv.map(function (type) {
            return type.name;
        });
    }, true);
    //This stores Educational Details data in an array	
    $scope.eduDetails = [];
    $scope.isValid = true;
    $scope.addEduDetails = function () {

        //This sets validation for selection of year of passing input in html form
        if (($scope.yop > (year + 4))) {
            alert("Year of Passing value should be upto current year + 4");
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.showBlock || $scope.showBlock1 || $scope.showBlock2 || $scope.showBlock3 || $scope.showBlock4)
        {
            $scope.isValid = true;
            if ($scope.showBlock)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major.length !== 0)
                {
                    $scope.details.major = $scope.major;
                    $scope.majorMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course.length !== 0) {
                    $scope.details.qualification = $scope.course;
                    $scope.courseMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream.length !== 0) {
                    $scope.details.streams = $scope.stream;
                    $scope.streamMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop;
                $scope.details.cgpaMin = $scope.cgpaMin;
                $scope.details.percentageMin = $scope.percentageMin;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }

            if ($scope.showBlock1)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major1.length !== 0)
                {
                    $scope.details.major = $scope.major1;
                    $scope.majorMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage1 = 'Select Major';
                    $scope.isValid = false;
                }
                if ($scope.course1.length !== 0) {
                    $scope.details.qualification = $scope.course1;
                    $scope.courseMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage1 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream1.length !== 0) {
                    $scope.details.streams = $scope.stream1;
                    $scope.streamMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage1 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop1;
                $scope.details.cgpaMin = $scope.cgpaMin1;
                $scope.details.percentageMin = $scope.percentageMin1;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock2)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major2.length !== 0)
                {
                    $scope.details.major = $scope.major2;
                    $scope.majorMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage2 = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course2.length !== 0) {
                    $scope.details.qualification = $scope.course2;
                    $scope.courseMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage2 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream2.length !== 0) {
                    $scope.details.streams = $scope.stream2;
                    $scope.streamMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage2 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop2;
                $scope.details.cgpaMin = $scope.cgpaMin2;
                $scope.details.percentageMin = $scope.percentageMin2;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock3)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major3.length !== 0)
                {
                    $scope.details.major = $scope.major3;
                    $scope.majorMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage3 = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course3.length !== 0) {
                    $scope.details.qualification = $scope.course3;
                    $scope.courseMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage3 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream3.length !== 0) {
                    $scope.details.streams = $scope.stream3;
                    $scope.streamMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage3 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop3;
                $scope.details.cgpaMin = $scope.cgpaMin3;
                $scope.details.percentageMin = $scope.percentageMin3;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock4)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major4.length !== 0)
                {
                    $scope.details.major = $scope.major4;
                    $scope.majorMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage4 = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course4.length !== 0) {
                    $scope.details.qualification = $scope.course4;
                    $scope.courseMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage4 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream4.length !== 0) {
                    $scope.details.streams = $scope.stream4;
                    $scope.streamMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage4 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop4;
                $scope.details.cgpaMin = $scope.cgpaMin4;
                $scope.details.percentageMin = $scope.percentageMin4;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
        } else
        {
            $scope.isValid = false;
            alert("Please Add Eligibility Criteria");
            $scope.eduDetails = [];
        }
    };
    /*function($scope) {
     $scope.childmethod = function() {
     $rootScope.$emit("CallParentMethod", {});
     }
     };*/
//    --------------------------date picker configuration functions --------------
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();
    $scope.clear = function () {
        $scope.dt = null;
    };
    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
                mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6) || (date < new Date());
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };
    $scope.toggleMin();
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };
    $scope.open3 = function () {
        $scope.popup3.opened = true;
    };
    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };
    $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.popup3 = {
        opened: false
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];
    function getDayClass(data) {
        var date = data.date,
                mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
//    --------------------------date picker configuration functions --------------


    //This parent function copies html form data to "generalOpportunityFields" object and then to "opportunity" object
    var copyFields = function () {

        $opportunity = {};
        $scope.generalOpportunityFields = {};
        $scope.generalOpportunityFields.summary = $scope.summary;
        $scope.generalOpportunityFields.noOfPositions = $scope.noOfPositions;
        $scope.generalOpportunityFields.budget = $scope.budget;
        $scope.generalOpportunityFields.currency = $scope.currency;
        if ($scope.keySkills.length !== 0)
        {
            $scope.generalOpportunityFields.skillsRequire = $scope.keySkills;
            $scope.isValid = $scope.isValid && true;
            $scope.skillMessage = undefined;
        } else
        {
            $scope.skillMessage = 'Select Key Skills';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.jobLocation.length !== 0)
        {
            $scope.generalOpportunityFields.opportunityLocation = $scope.jobLocation;
            $scope.isValid = $scope.isValid && true;
            $scope.locationMessage = undefined;
        } else
        {
            $scope.locationMessage = 'Select Location';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        $scope.generalOpportunityFields.minExperience = $scope.minExperience;
        $scope.generalOpportunityFields.maxExperience = $scope.maxExperience;
        $scope.generalOpportunityFields.eduDetails = $scope.eduDetails;
        $scope.generalOpportunityFields.opportunityDescription = $scope.opportunityDescription;
        $scope.generalOpportunityFields.selectionProcess = $scope.selectionProcess;
        if ($scope.type === 'internship' || $scope.type === 'research') {
            if ($scope.startDate !== undefined) {
                var dateAsString = $filter('date')($scope.startDate, "dd-MMM-yyyy");
                $scope.generalOpportunityFields.startDate = dateAsString;
                $scope.isValid = $scope.isValid && true;
                $scope.startDateMessage = undefined;
            } else
            {
                $scope.startDateMessage = 'Please Select Start Date';
                $scope.isValid = false;
                $scope.eduDetails = [];
            }
            if ($scope.endDate !== undefined) {
                if ($scope.startDate >= $scope.endDate) {
                    $scope.endDateMessage = 'End Date Should Be Greater Than Start Date';
                    $scope.endDate = undefined;
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                } else {
                    var dateAsString = $filter('date')($scope.endDate, "dd-MMM-yyyy");
                    $scope.generalOpportunityFields.endDate = dateAsString;
                    $scope.isValid = $scope.isValid && true;
                    $scope.endDateMessage = undefined;
                }
            } else
            {
                $scope.endDateMessage = 'Please Select End Date';
                $scope.isValid = false;
                $scope.eduDetails = [];
            }
        }

        var generalOpportunityFields = $scope.generalOpportunityFields;
                $opportunity = {generalOpportunityFields};
        $opportunity.type = $scope.type;
        $opportunity.lastDateToApply = $scope.lastDateToApplyString;
    };
    //This function calls parent function "copyFields()" to copy html data from Job, Internship and Research html forms
    $scope.copyOpportunity = function () {

        //Statements below checks if "lastDateToApply" field is undefined and sets date after 1 year by default, if undefined	
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
        {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            $scope.lastDateToApplyString = (day + '-' + monthNames[(month)] + '-' + (year + 1));
            $scope.lastDateToApply = new Date($scope.lastDateToApplyString);
        } else
        {
            $scope.lastDateToApplyString = $filter('date')($scope.lastDateToApply, "dd-MMM-yyyy");
        }
        copyFields();
    };
    //This function is used to copy html data from mentorship html form
    $scope.copyMentiOpportunity = function () {

        //Statements below checks if "lastDateToApply" field is undefined and sets date after 1 year by default, if undefined	
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
        {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            $scope.lastDateToApplyString = (day + '-' + monthNames[(month)] + '-' + (year + 1));
            $scope.lastDateToApply = new Date($scope.lastDateToApplyString);
        } else
        {
            $scope.lastDateToApplyString = $filter('date')($scope.lastDateToApply, "dd-MMM-yyyy");
        }
        $scope.instituteType = [];
        $opportunity = {};
        $mentorTypeFields = {};
        //These statements actually assigns data from mentorship html form
        $mentorTypeFields.mentorOpportunityDescription = $scope.mentorOpportunityDescription;
        $mentorTypeFields.mentorSummary = $scope.mentorSummary;
        if ($scope.keySkills.length !== 0)
        {
            $mentorTypeFields.mentorKeySkills = $scope.keySkills;
            $scope.isValid = $scope.isValid && true;
            $scope.skillMessage = undefined;
        } else
        {
            $scope.skillMessage = 'Select Key Skills';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.itDomain.length !== 0 || $scope.nonItDomain.length !== 0)
        {
            if ($scope.itDomain.length !== 0) {
                $mentorTypeFields.mentorItDomain = $scope.itDomain;
            }
            if ($scope.nonItDomain.length !== 0)
                $mentorTypeFields.mentorNonItDomain = $scope.nonItDomain;
            $scope.isValid = $scope.isValid && true;
            $scope.domainMessage = undefined;
        } else
        {
            $scope.domainMessage = 'Select Domains (IT/NON-IT)';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.functionalInterest.length !== 0)
        {
            $mentorTypeFields.mentorFunction = $scope.functionalInterest;
            $scope.isValid = $scope.isValid && true;
            $scope.interestMessage = undefined;
        } else
        {
            $scope.interestMessage = 'Select Functional Interest';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        $mentorTypeFields.menteeEduDetails = $scope.eduDetails;
        if ($scope.selection.length !== 0) {
            $mentorTypeFields.menteeInstitutes = $scope.selection;
            $scope.isValid = $scope.isValid && true;
            $scope.typesMessage = undefined;
        } else
        {
            $scope.typesMessage = 'Select Institute Types';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        $mentorTypeFields.menteeMinExp = $scope.minExp;
        $mentorTypeFields.menteeMaxExp = $scope.maxExp;
        var mentorTypeFields = $mentorTypeFields;
                $opportunity = {mentorTypeFields};
        $opportunity.type = $scope.type;
        $opportunity.paidOrFreeConsult = $scope.paidOrFree;
        $opportunity.lastDateToApply = $scope.lastDateToApplyString;
    };
    //This function send http post request with API and opportunity object as parameters to post data to database
    $scope.postOpportunity = function () {
        //This authenticate user for permissions
        if ($scope.isValid) {
            $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.emailId) || ($scope.user.orgId)) + ':' + ($scope.user.password));
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.post(CONSTANTS.SERVICES.OPPORTUNITIES2, $opportunity).success(function ($opportunity) {
                alert('Opportunity posted successfully!!!');
                //Statement below redirects to posted opportunity page
                $location.path("/home/mentor-posted");
            }).error(function (error)
            {
                alert(error || error.error || error.message);
            });
        }
    };
    //This function is used to edit mentorship opportunity
    $scope.editMentorOpportunity = function () {

        //Statements below checks if "lastDateToApply" field is undefined and sets date after 1 year by default, if undefined
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
        {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            $scope.lastDateToApplyString = (day + '-' + monthNames[(month)] + '-' + (year + 1));
            $scope.lastDateToApply = new Date($scope.lastDateToApplyString);
        } else
        {
            $scope.lastDateToApplyString = $filter('date')($scope.lastDateToApply, "dd-MMM-yyyy");
        }
        $scope.instituteType = [];
        $opportunity = {};
        $mentorTypeFields = {};
        //This copies data from selected opportunity to "$mentorTypeFields" object
        $mentorTypeFields = $scope.opp.mentorTypeFields;
        var mentorTypeFields = $mentorTypeFields;
                $opportunity = {mentorTypeFields};
        $opportunity.type = $scope.opp.type;
        $opportunity.paidOrFreeConsult = $scope.opp.paidOrFree;
        $opportunity.lastDateToApply = $scope.opp.lastDateToApplyString;
        //This authenticate user for permissions	
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        //This sends http put request(for overwriting existing data) with API and opportunity object as a parameter
        $http.put(CONSTANTS.SERVICES.OPPORTUNITIES + '/' + $scope.opp.id, $opportunity).success(function ($opportunity) {
            alert('Opportunity posted successfully!!!');
            //Statement below redirects to posted opportunity page
            $location.path("/home/org-post/org-posted");
        });
    };
});
/**
 * Author: Rushikesh Nere
 * (c) Midasfusion.com
 * License: MidasBlue
 */

/** @description
 *This controller provides a utility for getting and deleting opportunities for different types like job,
 *internship, research project and mentorship for Mentors.
 *This module includes logic for getting and deleting different posted opportunities.
 */

//This is controller for getting and deleting opportunities posted by Mentor type
futureMakerApp.controller('MentorPostGetController', function ($scope, $location, $window, $http, $cookieStore, CONSTANTS, opportunityService, searchService, emailTemplateService, userService) {

    //This gets user object and opportunity object from respective services
    $scope.user = userService.getUser();
    $scope.opp = opportunityService.getOpportunity();
    //This authenticates user for permissions
    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId) || ($scope.user.emailId)) + ':' + ($scope.user.password));
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    //This send http get request to server with API and user object as parameters
    $http.get(CONSTANTS.SERVICES.OPPORTUNITIES2, $scope.user).success(function ($opportunity) {
        $scope.opportunities = $opportunity;
    });
    //This function copies specific opportunity for editing or copying
    $scope.copyOpp = function (opportunity, action) {
        var a = opportunity;
        a.action = action;
        opportunityService.addOpportunity(a);
        switch (opportunity.type) {
            case 'job':
                $location.path("/home/edit-post-job");
                break;
            case 'internship':
                $location.path("/home/edit-post-internship");
                break;
            case 'research':
                $location.path("/home/edit-post-research");
                break;
            case 'mentee':
                $location.path("/home/edit-post-menteeship");
                break;
            default:
                break;
        }
    };
    $scope.saveAsEmail = function (opportunity) {
        switch (opportunity.type) {
            case 'job':
            case 'internship':
            case 'research':
                angular.forEach(opportunity.generalOpportunityFields.opportunityLocation, function (item, index) {

                    if (index === 0)
                    {
                        $locations = item;
                    } else
                    {
                        $locations = $locations + ',' + item;
                    }
                }
                );
                angular.forEach(opportunity.generalOpportunityFields.skillsRequire, function (item, index) {

                    if (index === 0)
                    {
                        $skills = item;
                    } else
                    {
                        $skills = $skills + ',' + item;
                    }
                });
                $subject = "Shortlisted for " + opportunity.generalOpportunityFields.summary;
                $body = "Greetings From Midas Fusion\n\nCongratulations You Are Shortlisted for a opportunity \n\nJob Description:\n" + opportunity.generalOpportunityFields.opportunityDescription;
                $body = $body + "\n\nExperirence Required: " + opportunity.generalOpportunityFields.minExperience + ' to ' + opportunity.generalOpportunityFields.maxExperience + ' year(s)';
                $body = $body + "\n\nSalary: " + opportunity.generalOpportunityFields.budget + ' ' + opportunity.generalOpportunityFields.currency;
                $body = $body + "\n\nJob Location: " + $locations;
                $body = $body + "\n\nSkills Required: " + $skills;
                $body = $body + "\n\nNumber Of Positions:" + opportunity.generalOpportunityFields.noOfPositions;
                $signature = "Thanks and Regards\n" + opportunity.ownerFields.name;
                $template = {
                    jobDescription: $body,
                    positionName: opportunity.generalOpportunityFields.summary,
                    senderEmail: opportunity.ownerFields.emailId,
                    signature: $signature,
                    subject: $subject
                };
                break;
            case 'mentee':

                angular.forEach(opportunity.mentorTypeFields.mentorKeySkills, function (item, index) {

                    if (index === 0)
                    {
                        $skills = item;
                    } else
                    {
                        $skills = $skills + ',' + item;
                    }
                });
                $subject = "Shortlisted for " + opportunity.mentorTypeFields.mentorSummary;
                $body = "Greetings From Midas Fusion\n\nCongratulations You Are Shortlisted for a opportunity \n\nJob Description:\n" + opportunity.mentorTypeFields.mentorOpportunityDescription;
                $body = $body + "\n\nExperirence Required: " + opportunity.mentorTypeFields.menteeMinExp + ' to ' + opportunity.mentorTypeFields.menteeMaxExp + ' year(s)';
                $body = $body + "\n\Paid Or Free: " + opportunity.paidOrFreeConsult;
                $body = $body + "\n\nSkills I Have: " + $skills;
                $signature = "Thanks and Regards\n" + opportunity.ownerFields.name;
                $template = {
                    jobDescription: $body,
                    positionName: opportunity.mentorTypeFields.mentorSummary,
                    senderEmail: opportunity.ownerFields.emailId,
                    signature: $signature,
                    subject: $subject
                };
                break;
        }
        emailTemplateService.addTemplate($template);
        $location.path("/home/save-as-template");
    };
    //This function is used to delete specific opportunity
    $scope.postDeleteOpportunity = function (opportunity) {

        var a = opportunity;
        opportunityService.addOpportunity(a);
        $scope.opp = opportunityService.getOpportunity();
        //This authenticates user for performing delete operation
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.emailId) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        //This confirms deletion operation with popup for confirmation
        var deleteOpp = $window.confirm('Are you sure you want to permanently delete the opportunity?');
        if (deleteOpp) {
            $http.delete(CONSTANTS.SERVICES.OPPORTUNITIES2 + '/' + $scope.opp.id, $scope.opp).success(function ($opportunity) {
                alert('Opportunity deleted successfully!');
                //$location.path("/home/org-post/org-posted");
                $window.location.reload();
            });
        }
    };
    $scope.viewAppliedCandidates = function ($opportunity) {


        //This authenticates user for performing delete operation
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.emailId) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        //This confirms deletion operation with popup for confirmation

        $http.get(CONSTANTS.SERVICES.GETCANDID + $opportunity.id).success(function ($candidates) {

            if ($candidates.length === 0) {
                alert("No Applications Yet");
            } else
            {
                searchService.addSearch($candidates);
                opportunityService.addOpportunity($opportunity);
                $location.path("/home/applied-candidates");
            }

        }).error(function (error) {
            alert(error.error || error.message || error);
        });
    };
    //This is used for required date format
    $scope.getDateFormat = function (timestamp) {
        return new Date(timestamp);
    };
    //This function is used for showing datatable

    // var table = $('#bootstrap-table').DataTable();
    //table.destroy();
    setTimeout(function () {
        //table = 
        $('#bootstrap-table').DataTable(
                // {
                //"order": [[ 3, "desc" ]]
                //}
                );
    }, 300);
});
futureMakerApp.controller('SavedSearchController', function ($scope, $location, $window, $http, $cookieStore, CONSTANTS, searchURLService, searchService, userService) {

    //This gets user object and opportunity object from respective services
    $scope.user = userService.getUser();
    //This authenticates user for permissions
    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId) || ($scope.user.emailId)) + ':' + ($scope.user.password));
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    //This send http get request to server with API and user object as parameters
    $http.get(CONSTANTS.SERVICES.SAVESEARCH, $scope.user).success(function ($searches) {
        $scope.searches = $searches;
    }).error(function (error) {
        alert(error || error.error);
    });
    $scope.sendSearch = function ($searchUrl) {




        var address = $location.url($searchUrl);
        var newAddress = address.$$url;
        $scope.Add = newAddress.slice(1);
        $http.get($scope.Add).success(function (data, status, headers, config) {
            $scope.results = data;
            $scope.res = $scope.results.hits.hits;
            $scope.res.total = $scope.results.hits.total; //[0]._source;
            searchURLService.addURL($scope.Add);
            searchService.addSearch($scope.res);
            $location.path('/org-search-result');
        });
    };
    //This function copies specific opportunity for editing or copying

    //This function is used to delete specific opportunity
    $scope.deleteSearch = function ($searchId) {

        var address = $location.url(CONSTANTS.SERVICES.SAVESEARCH);
        var newAddress = address.$$url;
        $scope.Add = newAddress.slice(1);
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $http.delete($scope.Add + '/' + $searchId).success(function (response) {
            //$scope.closeModal();
            alert('Search Deleted successfully!');
            $window.location.reload();
        }).error(function (error) {
            alert(error || error.error);
            $window.location.reload();
        });
    };
    //This is used for required date format
    $scope.getDateFormat = function (timestamp) {
        return new Date(timestamp);
    };
    //This function is used for showing datatable

    // var table = $('#bootstrap-table').DataTable();
    //table.destroy();
    setTimeout(function () {
        //table = 
        $('#bootstrap-table').DataTable(
                // {
                //"order": [[ 3, "desc" ]]
                //}
                );
    }, 300);
});
futureMakerApp.controller('AppliedOpportunitiesController', function ($scope, $location, $window, $http, $cookieStore, CONSTANTS, searchURLService, searchService, userService) {

    //This gets user object and opportunity object from respective services
    $scope.user = userService.getUser();
    //This authenticates user for permissions
    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId) || ($scope.user.emailId)) + ':' + ($scope.user.password));
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    //This send http get request to server with API and user object as parameters
    $http.get(CONSTANTS.SERVICES.APPLIEDOPP, $scope.user).success(function ($opportunitues) {
        $scope.opportunitues = $opportunitues;
    }).error(function (error) {
        alert(error || error.error);
    });
    $scope.sendSearch = function ($searchUrl) {




        var address = $location.url($searchUrl);
        var newAddress = address.$$url;
        $scope.Add = newAddress.slice(1);
        $http.get($scope.Add).success(function (data, status, headers, config) {
            $scope.results = data;
            $scope.res = $scope.results.hits.hits;
            $scope.res.total = $scope.results.hits.total; //[0]._source;
            searchURLService.addURL($scope.Add);
            searchService.addSearch($scope.res);
            $location.path('/org-search-result');
        });
    };
    //This function copies specific opportunity for editing or copying

    //This function is used to delete specific opportunity
    $scope.deleteSearch = function ($searchId) {

        var address = $location.url(CONSTANTS.SERVICES.SAVESEARCH);
        var newAddress = address.$$url;
        $scope.Add = newAddress.slice(1);
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $http.delete($scope.Add + '/' + $searchId).success(function (response) {
            //$scope.closeModal();
            alert('Search Deleted successfully!');
            $window.location.reload();
        }).error(function (error) {
            alert(error || error.error);
            $window.location.reload();
        });
    };
    //This is used for required date format
    $scope.getDateFormat = function (timestamp) {
        return new Date(timestamp);
    };
    //This function is used for showing datatable

    // var table = $('#bootstrap-table').DataTable();
    //table.destroy();
    setTimeout(function () {
        //table = 
        $('#bootstrap-table').DataTable(
                // {
                //"order": [[ 3, "desc" ]]
                //}
                );
    }, 300);
});
futureMakerApp.controller('PersonalFoldersController', function ($scope, $location, $window, $http, $cookieStore, CONSTANTS, searchURLService, searchService, userService) {

//This gets user object and opportunity object from respective services
    $scope.user = userService.getUser();
    $scope.folderId;
    $scope.searches = searchService.getSearch();
    $deleteArray = [];
    //This authenticates user for permissions
    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    $http.get(CONSTANTS.SERVICES.FOLDERS).success(function ($resultArray) {
        $scope.folders = $resultArray;
    }).error(function (error)
    {
        alert(error || error.error);
    });
    $scope.showFolderData = function (candidates) {
        candidates.folderId = $scope.folderId;
        searchService.addSearch(candidates)
        $location.path("/home/folder-contents");
    };
    $scope.selectAll = function () {

        for (var i = 0; i < $scope.searches.length; i++) {
            $scope.searches[i].isChecked = $scope.allCandidatesSelected;
        }
    };
    $scope.selectChanged = function () {
        $scope.allCandidatesSelected = true;
        for (var i = 0; i < $scope.searches.length; i++) {
            if (!$scope.searches[i].isChecked)
                $scope.allCandidatesSelected = false;
        }
    }
//This function copies specific opportunity for editing or copying

//This function is used to delete specific opportunity
    $scope.deleteFolder = function ($folderId) {


//This confirms deletion operation with popup for confirmation
        var deleteOpp = $window.confirm('Are you sure you want to permanently delete the opportunity?');
        if (deleteOpp) {


            $http.delete(CONSTANTS.SERVICES.FOLDERS + '/' + $folderId).success(function ($opportunity) {
                alert('Folder deleted successfully!');
                //$location.path("/home/org-post/org-posted");
                $window.location.reload();
            });
        }
    };
    $scope.deleteContents = function () {

        $folderId = $scope.searches.folderId;
        //This confirms deletion operation with popup for confirmation
        for (var i = 0; i < $scope.searches.length; i++)
        {
            if ($scope.searches[i].isChecked === true)
            {

                $deleteArray.push($scope.searches[i].id);
            }
        }
        $data = $deleteArray;
        var deleteOpp = $window.confirm('Are you sure you want to permanently delete the contents?');
        if (deleteOpp) {

            $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.post(CONSTANTS.SERVICES.FOLDERS + '/removeObjects/' + $folderId, $data).success(function ($opportunity) {
                alert('Folder Contents successfully!');
                $location.path("/home/personal-folders");
            }
            ).error(function (error)
            {
                alert(error || error.error || error.message.toString());
            }
            );
        }
    };
    $scope.selectFolderTORename = function ($folderId)
    {
        $scope.folderId = $folderId;
    }
    $scope.renameFolder = function ($folderName) {


//This confirms deletion operation with popup for confirmation
        var deleteOpp = $window.confirm('Are you sure you want to rename this folder?');
        if (deleteOpp) {
            $http.put(CONSTANTS.SERVICES.FOLDERS + '/' + $scope.folderId + '/' + $folderName).success(function ($opportunity) {
                alert('Folder Renamed successfully!');
                //$location.path("/home/org-post/org-posted");
                $window.location.reload();
            }).error(function (error) {
                alert(error || error.error);
            });
        }
    };
//This is used for required date format
    $scope.getDateFormat = function (timestamp) {
        return new Date(timestamp);
    };
//This function is used for showing datatable

// var table = $('#bootstrap-table').DataTable();
//table.destroy();
    setTimeout(function () {
        //table = 
        $('#bootstrap-table').DataTable(
                // {
                //"order": [[ 3, "desc" ]]
                //}
                );
    }, 300);
});
//This is controller for opportunity post feature for Organization type
futureMakerApp.controller('EditOpportunityController', function ($scope, $filter, $location, $resource, $http, $cookieStore, dropdownOptionsService, KEYSKILLS, LOCATIONS, ITDOMAINS, NONITDOMAINS, MAJORS, COURSES, FUNCTIONALINTEREST, STREAMS, CONSTANTS, opportunityService, userService) {

//Statements below imports user object and opportunity object from angular services respectively	
    $scope.user = userService.getUser();
    $scope.opp = opportunityService.getOpportunity();
    //This loads KeySkills options for dropdown menu from dropdownOptionsService
    $scope.keySkills = [];
    $scope.skillOptions = [KEYSKILLS.count - 1];
    $scope.skillOptions = KEYSKILLS.keyskills;
    $scope.skillConfig = dropdownOptionsService.getSkillsConfig();
    switch ($scope.opp.type) {
        case 'mentee':
        case 'Mentorship':
        case 'mentorship':
            angular.forEach($scope.opp.mentorTypeFields.mentorKeySkills, function (addInterest) {
                var flag = true;
                angular.forEach($scope.skillOptions, function (inter) {
                    if (inter.data === addInterest)
                    {
                        flag = false;
                    }
                });
                if (flag) {
                    var skill = {
                        data: addInterest,
                        id: addInterest
                    };
                    $scope.skillOptions.push(skill);
                }
            });
            break;
        case 'job':
        case 'internship':
        case 'research':
            angular.forEach($scope.opp.generalOpportunityFields.skillsRequire, function (addInterest) {
                var flag = true;
                angular.forEach($scope.skillOptions, function (inter) {
                    if (inter.data === addInterest)
                    {
                        flag = false;
                    }
                });
                if (flag) {
                    var skill = {
                        data: addInterest,
                        id: addInterest
                    };
                    $scope.skillOptions.push(skill);
                }
            });
            $scope.opp.lastDateToApply = new Date($scope.opp.lastDateToApply);
            if ($scope.opp.type === 'internship' || $scope.opp.type === 'research') {
                $scope.opp.generalOpportunityFields.startDate = new Date($scope.opp.generalOpportunityFields.startDate);
                $scope.opp.generalOpportunityFields.endDate = new Date($scope.opp.generalOpportunityFields.endDate);
            }
            break;
        case 'event':
            $scope.opp.eventFields.eventDate = new Date($scope.opp.eventFields.eventDate);
            break;
        case 'guest':
            $scope.opp.guestFields.guestInviteDate = new Date($scope.opp.guestFields.guestInviteDate);
            break;
    }

//This loads ITDomain options for dropdown menu from dropdownOptionsService
    $scope.itDomain = [];
    $scope.itDomainOptions = [ITDOMAINS.count - 1];
    $scope.itDomainOptions = ITDOMAINS.ITDomains;
    $scope.itDomainsConfig = dropdownOptionsService.getITDomainConfig();
    //This loads NonITDomain options for dropdown menu from dropdownOptionsService
    $scope.nonItDomain = [];
    $scope.nonItDomainOptions = [NONITDOMAINS.count - 1];
    $scope.nonItDomainOptions = NONITDOMAINS.NonITDomains;
    $scope.nonItDomainsConfig = dropdownOptionsService.getNonITDomainConfig();
    //This loads Major options for dropdown menu from dropdownOptionsService
    $scope.$parent.major = [];
    $scope.majorOptions = [MAJORS.count - 1];
    $scope.majorOptions = MAJORS.majors;
    $scope.majorConfig = dropdownOptionsService.getMajorConfig();
    //This loads Location options for dropdown menu from dropdownOptionsService
    $scope.jobLocation = [];
    $scope.locationOptions = [LOCATIONS.count - 1];
    $scope.locationOptions = LOCATIONS.location;
    $scope.locationConfig = dropdownOptionsService.getLocationConfig();
    //This loads Course options for dropdown menu from dropdownOptionsService
    $scope.$parent.course = [];
    $scope.courseOptions = [COURSES.count - 1];
    $scope.courseOptions = COURSES.courses;
    $scope.courseConfig = dropdownOptionsService.getCourseConfig();
    //This loads Year of Passing options for dropdown menu from dropdownOptionsService
    //$scope.$parent.yop = [];
    //$scope.yopOptions = [YOPASSING.count - 1];
    //$scope.yopOptions = YOPASSING.yop;
    //$scope.yopConfig = dropdownOptionsService.getYopConfig();

    //This loads FunctionalInterest options for dropdown menu from dropdownOptionsService
    $scope.functionalInterest = [];
    $scope.functionalInterestOptions = [FUNCTIONALINTEREST.count - 1];
    $scope.functionalInterestOptions = FUNCTIONALINTEREST.functionalInterest;
    $scope.functionalInterestConfig = dropdownOptionsService.getFunctionalInterestConfig();
    //This loads Stream options for dropdown menu from dropdownOptionsService
    $scope.$parent.stream = [];
    $scope.streamOptions = [STREAMS.count - 1];
    $scope.streamOptions = STREAMS.streams;
    $scope.streamConfig = dropdownOptionsService.getStreamConfig();
    //This stores Educational Details data in an array
    $scope.selection = [];
    $scope.types = [];
    $scope.types = [
        {name: 'IITs', selected: false},
        {name: 'NITs', selected: false},
        {name: 'Deemed Universities', selected: false},
        {name: 'Autonomous', selected: false},
        {name: 'Others', selected: false}
    ];
    if ($scope.opp.type === 'mentee') {
        $scope.selection = $scope.opp.mentorTypeFields.menteeInstitutes;
        angular.forEach($scope.types, function (type, index) {
            angular.forEach($scope.selection, function (selected, index) {

                if (type.name === selected)
                    type.selected = true;
            });
        });
    }
// selected fruits

// helper method to get selected fruits
    $scope.selectedTypes = function selectedTypes() {
        return filterFilter($scope.types, {selected: true});
    };
    // watch fruits for changes
    $scope.$watch('types|filter:{selected:true}', function (nv) {
        $scope.selection = nv.map(function (type) {
            return type.name;
        });
    }, true);
    $scope.offers = [];
    $scope.offers = [
        {name: 'Money', selected: false},
        {name: 'Certificate', selected: false},
        {name: 'Momento', selected: false}
    ];
    if ($scope.opp.type === 'guest') {
        $scope.selection = $scope.opp.guestFields.guestOfferings;
        angular.forEach($scope.offers, function (offer, index) {
            angular.forEach($scope.selection, function (selected, index) {

                if (offer.name === selected)
                    offer.selected = true;
            });
        });
    }
    if ($scope.opp.type === 'event') {
        $scope.selection = $scope.opp.eventFields.eventOfferings;
        angular.forEach($scope.offers, function (offer, index) {
            angular.forEach($scope.selection, function (selected, index) {

                if (offer.name === selected)
                    offer.selected = true;
            });
        });
    }
// selected fruits

// helper method to get selected fruits
    $scope.selectedOffers = function selectedOffers() {
        return filterFilter($scope.offers, {selected: true});
    };
    // watch fruits for changes
    $scope.$watch('offers|filter:{selected:true}', function (nv) {
        $scope.selection = nv.map(function (offer) {
            return offer.name;
        });
    }, true);
//    --------------------------date picker configuration functions --------------
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();
    $scope.clear = function () {
        $scope.dt = null;
    };
    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
                mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6) || (date < new Date());
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };
    $scope.toggleMin();
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };
    $scope.open3 = function () {
        $scope.popup3.opened = true;
    };
    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };
    $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.popup3 = {
        opened: false
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];
    function getDayClass(data) {
        var date = data.date,
                mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
    $scope.valid = function (opp) {
        $scope.isValid = true;
        switch (opp.type)
        {
            case 'mentee':
            case 'Mentorship':
            case 'mentorship':
                if (opp.type === 'mentee') {
                    if (opp.mentorTypeFields.menteeEduDetails[0].major.length !== 0)
                    {
//                    $scope.details.major = $scope.major;
                        $scope.majorMessage = undefined;
                        $scope.isValid = $scope.isValid && true;
                    } else
                    {
                        $scope.majorMessage = 'Select Major';
                        $scope.isValid = false;
//                    $scope.eduDetails = [];
                    }
                    if (opp.mentorTypeFields.menteeEduDetails[0].qualification.length !== 0) {

                        $scope.courseMessage = undefined;
                        $scope.isValid = $scope.isValid && true;
                    } else {
                        $scope.courseMessage = 'Select Course';
                        $scope.isValid = false;
                    }
                    if (opp.mentorTypeFields.menteeEduDetails[0].streams.length !== 0) {

                        $scope.streamMessage = undefined;
                        $scope.isValid = $scope.isValid && true;
                    } else {
                        $scope.streamMessage = 'Select Stream';
                        $scope.isValid = false;
                    }
                    if ($scope.selection.length !== 0) {
//                    $mentorTypeFields.menteeInstitutes = $scope.selection;
                        $scope.isValid = $scope.isValid && true;
                        $scope.typesMessage = undefined;
                    } else
                    {
                        $scope.typesMessage = 'Select Institute Types';
                        $scope.isValid = false;
//                    $scope.eduDetails = [];
                    }
                } else
                {
                    if (opp.mentorTypeFields.mentorEduDetails[0].major.length !== 0)
                    {
//                    $scope.details.major = $scope.major;
                        $scope.majorMessage = undefined;
                        $scope.isValid = $scope.isValid && true;
                    } else
                    {
                        $scope.majorMessage = 'Select Major';
                        $scope.isValid = false;
//                    $scope.eduDetails = [];
                    }
                    if (opp.mentorTypeFields.mentorEduDetails[0].qualification.length !== 0) {

                        $scope.courseMessage = undefined;
                        $scope.isValid = $scope.isValid && true;
                    } else {
                        $scope.courseMessage = 'Select Course';
                        $scope.isValid = false;
                    }
                    if (opp.mentorTypeFields.mentorEduDetails[0].streams.length !== 0) {

                        $scope.streamMessage = undefined;
                        $scope.isValid = $scope.isValid && true;
                    } else {
                        $scope.streamMessage = 'Select Stream';
                        $scope.isValid = false;
                    }
                }
                if (opp.mentorTypeFields.mentorKeySkills.length !== 0)
                {

                    $scope.isValid = $scope.isValid && true;
                    $scope.skillMessage = undefined;
                } else
                {
                    $scope.skillMessage = 'Select Key Skills';
                    $scope.isValid = false;
//                    $scope.eduDetails = [];
                }
                if (opp.mentorTypeFields.mentorItDomain === null || opp.mentorTypeFields.mentorItDomain === undefined)
                {
                    opp.mentorTypeFields.mentorItDomain = [];
                }
                if (opp.mentorTypeFields.mentorNonItDomain === null || opp.mentorTypeFields.mentorNonItDomain === undefined)
                {
                    opp.mentorTypeFields.mentorNonItDomain = [];
                }
                if (opp.mentorTypeFields.mentorItDomain.length !== 0 || opp.mentorTypeFields.mentorNonItDomain.length !== 0)
                {
                    if (opp.mentorTypeFields.mentorItDomain.length === 0) {
                        opp.mentorTypeFields.mentorItDomain = undefined;
                    }
                    if (opp.mentorTypeFields.mentorNonItDomain.length === 0)
                        opp.mentorTypeFields.mentorNonItDomain = undefined;
                    $scope.isValid = $scope.isValid && true;
                    $scope.domainMessage = undefined;
                } else
                {
                    $scope.domainMessage = 'Select Domains (IT/NON-IT)';
                    $scope.isValid = false;
                }

                if (opp.mentorTypeFields.mentorFunction.length !== 0)
                {

                    $scope.isValid = $scope.isValid && true;
                    $scope.interestMessage = undefined;
                } else
                {
                    $scope.interestMessage = 'Select Functional Interest';
                    $scope.isValid = false;
//                    $scope.eduDetails = [];
                }
                // $scope.selection = opp.mentorTypeFields.menteeInstitutes;


                break;
            case 'job':
            case 'internship':
            case 'research':
                if (opp.generalOpportunityFields.eduDetails[0].major.length !== 0)
                {
//                    $scope.details.major = $scope.major;
                    $scope.majorMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage = 'Select Major';
                    $scope.isValid = false;
//                    $scope.eduDetails = [];
                }
                if (opp.generalOpportunityFields.eduDetails[0].qualification.length !== 0) {

                    $scope.courseMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage = 'Select Course';
                    $scope.isValid = false;
                }
                if (opp.generalOpportunityFields.eduDetails[0].streams.length !== 0) {

                    $scope.streamMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage = 'Select Stream';
                    $scope.isValid = false;
                }
                if (opp.generalOpportunityFields.skillsRequire.length !== 0)
                {

                    $scope.isValid = $scope.isValid && true;
                    $scope.skillMessage = undefined;
                } else
                {
                    $scope.skillMessage = 'Select Key Skills';
                    $scope.isValid = false;
//                    $scope.eduDetails = [];
                }
                if (opp.generalOpportunityFields.opportunityLocation.length !== 0)
                {

                    $scope.isValid = $scope.isValid && true;
                    $scope.locationMessage = undefined;
                } else
                {
                    $scope.locationMessage = 'Select Opportunity Location';
                    $scope.isValid = false;
//                    $scope.eduDetails = [];
                }
                if ($scope.opp.type === 'internship' || $scope.opp.type === 'research') {

                    if (opp.generalOpportunityFields.startDate === undefined) {
                        //         var dateAsString = $filter('date')($scope.startDate, "dd-MMM-yyyy");
                        //     $scope.generalOpportunityFields.startDate = dateAsString;
                        $scope.isValid = $scope.isValid && true;
                        $scope.startDateMessage = undefined;
                    } else
                    {
                        $scope.startDateMessage = 'Please Select Start Date';
                        $scope.isValid = false;
                        //  $scope.eduDetails = [];
                    }
                    if (opp.generalOpportunityFields.endDate !== undefined) {
                        if (opp.generalOpportunityFields.startDate >= opp.generalOpportunityFields.endDate) {
                            $scope.endDateMessage = 'End Date Should Be Greater Than Start Date';
                            $scope.endDate = undefined;
                            $scope.isValid = false;
                            // $scope.eduDetails = [];
                        } else {
                            // var dateAsString = $filter('date')($scope.endDate, "dd-MMM-yyyy");
                            //  $scope.generalOpportunityFields.endDate = dateAsString;
                            $scope.isValid = $scope.isValid && true;
                            $scope.endDateMessage = undefined;
                        }
                    } else
                    {
                        $scope.endDateMessage = 'Please Select End Date';
                        $scope.isValid = false;
                        // $scope.eduDetails = [];
                    }

                }
                break;
            case 'event':
                if (opp.eventFields.eventDate !== undefined) {
                    $scope.isValid = $scope.isValid && true;
                    $scope.eventDateMessage = undefined;
                    // $scope.eduDetails = [];
                } else {
                    // var dateAsString = $filter('date')($scope.endDate, "dd-MMM-yyyy");
                    //  $scope.generalOpportunityFields.endDate = dateAsString;
                    $scope.isValid = false;
                    $scope.eventDateMessage = ' ';
                }
                if (opp.eventFields.eventItDomainDetails === null || opp.eventFields.eventItDomainDetails === undefined)
                {
                    opp.eventFields.eventItDomainDetails = [];
                }
                if (opp.eventFields.eventNonItDomainDetails === null || opp.eventFields.eventNonItDomainDetails === undefined)
                {
                    opp.eventFields.eventNonItDomainDetails = [];
                }
                if (opp.eventFields.eventItDomainDetails.length !== 0 || opp.eventFields.eventNonItDomainDetails.length !== 0)
                {
                    if (opp.eventFields.eventItDomainDetails.length === 0) {
                        opp.eventFields.eventItDomainDetails = undefined;
                    }
                    if (opp.eventFields.eventNonItDomainDetails.length === 0)
                        opp.eventFields.eventNonItDomainDetails = undefined;
                    $scope.isValid = $scope.isValid && true;
                    $scope.domainMessage = undefined;
                } else
                {
                    $scope.domainMessage = 'Select Domains (IT/NON-IT)';
                    $scope.isValid = false;
                }

                if (opp.eventFields.eventFunctionDetails.length !== 0)
                {

                    $scope.isValid = $scope.isValid && true;
                    $scope.interestMessage = undefined;
                } else
                {
                    $scope.interestMessage = 'Select Functional Interest';
                    $scope.isValid = false;
//                    $scope.eduDetails = [];
                }
                break;
            case 'guest':
                if (opp.guestFields.guestInviteDate !== undefined) {
                    $scope.isValid = $scope.isValid && true;
                    $scope.eventDateMessage = undefined;
                    // $scope.eduDetails = [];
                } else {
                    // var dateAsString = $filter('date')($scope.endDate, "dd-MMM-yyyy");
                    //  $scope.generalOpportunityFields.endDate = dateAsString;
                    $scope.isValid = false;
                    $scope.eventDateMessage = ' ';
                }
                if (opp.guestFields.guestKeySkills.length !== 0)
                {

                    $scope.isValid = $scope.isValid && true;
                    $scope.skillMessage = undefined;
                } else
                {
                    $scope.skillMessage = 'Select Key Skills';
                    $scope.isValid = false;
//                    $scope.eduDetails = [];
                }
                if (opp.guestFields.guestItDomain === null || opp.guestFields.guestItDomain === undefined)
                {
                    opp.guestFields.guestItDomain = [];
                }
                if (opp.guestFields.guestNonItDomain === null || opp.guestFields.guestNonItDomain === undefined)
                {
                    opp.guestFields.guestNonItDomain = [];
                }
                if (opp.guestFields.guestItDomain.length !== 0 || opp.guestFields.guestNonItDomain.length !== 0)
                {
                    if (opp.guestFields.guestItDomain.length === 0) {
                        opp.guestFields.guestItDomain = undefined;
                    }
                    if (opp.guestFields.guestNonItDomain.length === 0)
                        opp.guestFields.guestNonItDomain = undefined;
                    $scope.isValid = $scope.isValid && true;
                    $scope.domainMessage = undefined;
                } else
                {
                    $scope.domainMessage = 'Select Domains (IT/NON-IT)';
                    $scope.isValid = false;
                }

                if (opp.guestFields.guestFunction.length !== 0)
                {

                    $scope.isValid = $scope.isValid && true;
                    $scope.interestMessage = undefined;
                } else
                {
                    $scope.interestMessage = 'Select Functional Interest';
                    $scope.isValid = false;
//                    $scope.eduDetails = [];
                }
                break
        }
        return $scope.isValid;
    };
    $scope.EditOpportunity = function () {
        if ($scope.valid($scope.opp)) {
            var id = $scope.opp.id;
            $scope.opp.id = undefined;
            $scope.opp.action = undefined;
            switch ($scope.opp.ownerFields.userType) {
                case 'organisation' :
                    if ($scope.opp.type === 'mentee') {
                        $scope.opp.mentorTypeFields.menteeInstitutes = $scope.selection;
                    }
                    lastDateToApplyString = $filter('date')($scope.opp.lastDateToApply, "dd-MMM-yyyy");
                    $scope.opp.lastDateToApply = lastDateToApplyString;
                    if ($scope.opp.type === 'internship' || $scope.opp.type === 'research') {
                        startDateString = $filter('date')($scope.opp.generalOpportunityFields.startDate, "dd-MMM-yyyy");
                        $scope.opp.generalOpportunityFields.startDate = startDateString;
                        endDateString = $filter('date')($scope.opp.generalOpportunityFields.endDate, "dd-MMM-yyyy");
                        $scope.opp.generalOpportunityFields.endDate = endDateString;
                    }
                    $scope.opp.ownerFields = undefined;
                    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
                    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                    $http.put(CONSTANTS.SERVICES.OPPORTUNITIES + '/' + id, $scope.opp).success(function ($opportunity) {
                        alert('Opportunity edited successfully!');
                        //Statement below redirects to posted opportunity page
                        $location.path("/home/org-post/org-posted");
                    });
                    break;
                case 'mentor':
                    if ($scope.opp.type === 'mentee') {
                        if ($scope.selection.length !== 0)
                            $scope.opp.mentorTypeFields.menteeInstitutes = $scope.selection;
                    }
                    lastDateToApplyString = $filter('date')($scope.opp.lastDateToApply, "dd-MMM-yyyy");
                    $scope.opp.lastDateToApply = lastDateToApplyString;
                    if ($scope.opp.type === 'internship' || $scope.opp.type === 'research') {
                        startDateString = $filter('date')($scope.opp.generalOpportunityFields.startDate, "dd-MMM-yyyy");
                        $scope.opp.generalOpportunityFields.startDate = startDateString;
                        endDateString = $filter('date')($scope.opp.generalOpportunityFields.endDate, "dd-MMM-yyyy");
                        $scope.opp.generalOpportunityFields.endDate = endDateString;
                    }
                    $scope.opp.ownerFields = undefined;
                    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
                    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                    $http.put(CONSTANTS.SERVICES.OPPORTUNITIES2 + '/' + id, $scope.opp).success(function ($opportunity) {
                        alert('Opportunity edited successfully!');
                        //Statement below redirects to posted opportunity page
                        $location.path("/home/mentor-posted");
                    }).error(function (error) {
                        alert(error.error || error.message || error);
                    });
                    break;
                case 'student':
                    $scope.opp.ownerFields = undefined;
                    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
                    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                    $http.put(CONSTANTS.SERVICES.OPPORTUNITIES3 + '/' + id, $scope.opp).success(function ($opportunity) {
                        alert('Opportunity edited successfully!');
                        //Statement below redirects to posted opportunity page
                        $location.path("/home/stud-posted");
                    }).error(function (error) {
                        alert(error.error || error.message || error);
                    });
                    break;
                case 'institute':
                    if ($scope.opp.type === 'guest') {
                        if ($scope.selection.length !== 0)
                            $scope.opp.guestFields.guestOfferings = $scope.selection;
                    }
                    if ($scope.opp.type === 'event') {
                        if ($scope.selection.length !== 0)
                            $scope.opp.eventFields.eventOfferings = $scope.selection;
                    }
                    $scope.opp.ownerFields = undefined;
                    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
                    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                    $http.put(CONSTANTS.SERVICES.OPPORTUNITIES1 + '/' + id, $scope.opp).success(function ($opportunity) {
                        alert('Opportunity edited successfully!');
                        //Statement below redirects to posted opportunity page
                        $location.path("/home/inst-posted");
                    }).error(function (error) {
                        alert(error.error || error.message || error);
                    });
                    break;
            }
        }
    };
    $scope.back = function () {
        var userType = $scope.user.userType;
        var pathToRedirect;
        switch (userType) {
            case 'student':
                pathToRedirect = '/home/stud-posted';
                break;
            case 'organisation':
                pathToRedirect = '/home/org-post/org-posted';
                break;
            case 'institute':
                pathToRedirect = '/home/inst-posted';
                break;
            case 'mentor':
                pathToRedirect = '/home/mentor-posted';
                break;
            default:
                pathToRedirect = "#";
                break;
        }
        $location.path(pathToRedirect);
    };
    $scope.PostNewOpportunity = function () {
        if ($scope.valid($scope.opp)) {
            var id = $scope.opp.id;
            $scope.opp.id = undefined;
            $scope.opp.action = undefined;
            $scope.opp.status = undefined;
            switch ($scope.opp.ownerFields.userType) {
                case 'organisation' :
                    if ($scope.opp.type === 'mentee') {
                        $scope.opp.mentorTypeFields.menteeInstitutes = $scope.selection;
                    }
                    lastDateToApplyString = $filter('date')($scope.opp.lastDateToApply, "dd-MMM-yyyy");
                    $scope.opp.lastDateToApply = lastDateToApplyString;
                    if ($scope.opp.type === 'internship' || $scope.opp.type === 'research') {
                        startDateString = $filter('date')($scope.opp.generalOpportunityFields.startDate, "dd-MMM-yyyy");
                        $scope.opp.generalOpportunityFields.startDate = startDateString;
                        endDateString = $filter('date')($scope.opp.generalOpportunityFields.endDate, "dd-MMM-yyyy");
                        $scope.opp.generalOpportunityFields.endDate = endDateString;
                    }
                    $scope.opp.ownerFields = undefined;
                    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
                    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                    $http.post(CONSTANTS.SERVICES.OPPORTUNITIES, $scope.opp).success(function ($opportunity) {
                        alert('Opportunity Posted successfully!');
                        //Statement below redirects to posted opportunity page
                        $location.path("/home/org-post/org-posted");
                    });
                    break;
                case 'mentor':
                    if ($scope.opp.type === 'mentee') {
                        if ($scope.selection.length !== 0)
                            $scope.opp.mentorTypeFields.menteeInstitutes = $scope.selection;
                    }
                    lastDateToApplyString = $filter('date')($scope.opp.lastDateToApply, "dd-MMM-yyyy");
                    $scope.opp.lastDateToApply = lastDateToApplyString;
                    if ($scope.opp.type === 'internship' || $scope.opp.type === 'research') {
                        startDateString = $filter('date')($scope.opp.generalOpportunityFields.startDate, "dd-MMM-yyyy");
                        $scope.opp.generalOpportunityFields.startDate = startDateString;
                        endDateString = $filter('date')($scope.opp.generalOpportunityFields.endDate, "dd-MMM-yyyy");
                        $scope.opp.generalOpportunityFields.endDate = endDateString;
                    }
                    $scope.opp.ownerFields = undefined;
                    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
                    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                    $http.post(CONSTANTS.SERVICES.OPPORTUNITIES2, $scope.opp).success(function ($opportunity) {
                        alert('Opportunity Posted successfully!');
                        //Statement below redirects to posted opportunity page
                        $location.path("/home/mentor-posted");
                    }).error(function (error) {
                        alert(error.error || error.message || error);
                    });
                    break;
                case 'student':
                    $scope.opp.ownerFields = undefined;
                    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
                    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                    $http.post(CONSTANTS.SERVICES.OPPORTUNITIES3, $scope.opp).success(function ($opportunity) {
                        alert('Opportunity Posted successfully!');
                        //Statement below redirects to posted opportunity page
                        $location.path("/home/stud-posted");
                    }).error(function (error) {
                        alert(error.error || error.message || error);
                    });
                    break;
                case 'institute':
                    if ($scope.opp.type === 'guest') {
                        if ($scope.selection.length !== 0)
                            $scope.opp.guestFields.guestOfferings = $scope.selection;
                    }
                    if ($scope.opp.type === 'event') {
                        if ($scope.selection.length !== 0)
                            $scope.opp.eventFields.eventOfferings = $scope.selection;
                    }
                    $scope.opp.ownerFields = undefined;
                    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
                    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
                    $http.post(CONSTANTS.SERVICES.OPPORTUNITIES1, $scope.opp).success(function ($opportunity) {
                        alert('Opportunity Posted successfully!');
                        //Statement below redirects to posted opportunity page
                        $location.path("/home/inst-posted");
                    }).error(function (error) {
                        alert(error.error || error.message || error);
                    });
                    break;
            }
        }
    }
    ;
}
);
//This is controller for opportunity post feature for Organization type
futureMakerApp.controller('orgPostController', function ($scope, $filter, $location, $resource, $http, $cookieStore, dropdownOptionsService, KEYSKILLS, LOCATIONS, ITDOMAINS, NONITDOMAINS, MAJORS, COURSES, FUNCTIONALINTEREST, STREAMS, CONSTANTS, opportunityService, userService) {

//Statements below imports user object and opportunity object from angular services respectively	
    $scope.user = userService.getUser();
    $scope.opp = opportunityService.getOpportunity();
    //This gives current day,month and year which is used below for validation purpose
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var month = currentTime.getMonth();
    var day = currentTime.getDate();
    //This loads KeySkills options for dropdown menu from dropdownOptionsService
    $scope.keySkills = [];
    $scope.skillOptions = [KEYSKILLS.count - 1];
    $scope.skillOptions = KEYSKILLS.keyskills;
    $scope.skillConfig = dropdownOptionsService.getSkillsConfig();
    //This loads ITDomain options for dropdown menu from dropdownOptionsService
    $scope.itDomain = [];
    $scope.itDomainOptions = [ITDOMAINS.count - 1];
    $scope.itDomainOptions = ITDOMAINS.ITDomains;
    $scope.itDomainsConfig = dropdownOptionsService.getITDomainConfig();
    //This loads NonITDomain options for dropdown menu from dropdownOptionsService
    $scope.nonItDomain = [];
    $scope.nonItDomainOptions = [NONITDOMAINS.count - 1];
    $scope.nonItDomainOptions = NONITDOMAINS.NonITDomains;
    $scope.nonItDomainsConfig = dropdownOptionsService.getNonITDomainConfig();
    //This loads Major options for dropdown menu from dropdownOptionsService
    $scope.$parent.major = [];
    $scope.majorOptions = [MAJORS.count - 1];
    $scope.majorOptions = MAJORS.majors;
    $scope.majorConfig = dropdownOptionsService.getMajorConfig();
    //This loads Location options for dropdown menu from dropdownOptionsService
    $scope.jobLocation = [];
    $scope.locationOptions = [LOCATIONS.count - 1];
    $scope.locationOptions = LOCATIONS.location;
    $scope.locationConfig = dropdownOptionsService.getLocationConfig();
    //This loads Course options for dropdown menu from dropdownOptionsService
    $scope.$parent.course = [];
    $scope.courseOptions = [COURSES.count - 1];
    $scope.courseOptions = COURSES.courses;
    $scope.courseConfig = dropdownOptionsService.getCourseConfig();
    //This loads Year of Passing options for dropdown menu from dropdownOptionsService
    //$scope.$parent.yop = [];
    //$scope.yopOptions = [YOPASSING.count - 1];
    //$scope.yopOptions = YOPASSING.yop;
    //$scope.yopConfig = dropdownOptionsService.getYopConfig();

    //This loads FunctionalInterest options for dropdown menu from dropdownOptionsService
    $scope.functionalInterest = [];
    $scope.functionalInterestOptions = [FUNCTIONALINTEREST.count - 1];
    $scope.functionalInterestOptions = FUNCTIONALINTEREST.functionalInterest;
    $scope.functionalInterestConfig = dropdownOptionsService.getFunctionalInterestConfig();
    //This loads Stream options for dropdown menu from dropdownOptionsService
    $scope.$parent.stream = [];
    $scope.streamOptions = [STREAMS.count - 1];
    $scope.streamOptions = STREAMS.streams;
    $scope.streamConfig = dropdownOptionsService.getStreamConfig();
    //This stores Educational Details data in an array
    $scope.types = [];
    $scope.types = [
        {name: 'IITs', selected: false},
        {name: 'NITs', selected: false},
        {name: 'Deemed Universities', selected: false},
        {name: 'Autonomous', selected: false},
        {name: 'Others', selected: false}
    ];
    $scope.clearAll = function () {
        $scope.keySkills = [];
        $scope.stream = [];
        $scope.course = [];
        $scope.major = [];
        $scope.itDomain = [];
        $scope.nonItDomain = [];
        $scope.functionalInterest = [];
        $scope.domains = [];
        $scope.offers = [];
        $scope.jobLocation = [];
        $scope.startDate = undefined;
        $scope.endDate = undefined;
        $scope.lastDateToApply = undefined;
        $scope.$setPristine(true);
    };
    // selected fruits
    $scope.selection = [];
    // helper method to get selected fruits
    $scope.selectedTypes = function selectedTypes() {
        return filterFilter($scope.types, {selected: true});
    };
    // watch fruits for changes
    $scope.$watch('types|filter:{selected:true}', function (nv) {
        $scope.selection = nv.map(function (type) {
            return type.name;
        });
    }, true);
//    --------------------------date picker configuration functions --------------
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();
    $scope.clear = function () {
        $scope.dt = null;
    };
    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };
    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    $scope.minDate = new Date();
    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
                mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6) || (date < new Date());
    }



    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };
    $scope.toggleMin();
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };
    $scope.open3 = function () {
        $scope.popup3.opened = true;
    };
    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };
    $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.popup3 = {
        opened: false
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];
    function getDayClass(data) {
        var date = data.date,
                mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
//    --------------------------date picker configuration functions --------------
    $scope.isValid = true;
    $scope.eduDetails = [];
    $scope.addEduDetails = function () {

        //This sets validation for selection of year of passing input in html form
        if (($scope.yop > (year + 4))) {
            alert("Year of Passing value should be upto current year + 4");
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.showBlock || $scope.showBlock1 || $scope.showBlock2 || $scope.showBlock3 || $scope.showBlock4)
        {
            $scope.isValid = true;
            if ($scope.showBlock)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major.length !== 0)
                {
                    $scope.details.major = $scope.major;
                    $scope.majorMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage = 'Select Major';
                    $scope.isValid = false;
                }
                if ($scope.course.length !== 0) {
                    $scope.details.qualification = $scope.course;
                    $scope.courseMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage = 'Select Course';
                    $scope.isValid = false
                }
                if ($scope.stream.length !== 0) {
                    $scope.details.streams = $scope.stream;
                    $scope.streamMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage = 'Select Stream';
                    $scope.isValid = false
                }

                $scope.details.yop = $scope.yop;
                $scope.details.cgpaMin = $scope.cgpaMin;
                $scope.details.percentageMin = $scope.percentageMin;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }

            if ($scope.showBlock1)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major1.length !== 0)
                {
                    $scope.details.major = $scope.major1;
                    $scope.majorMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage1 = 'Select Major';
                    $scope.isValid = false;
                }
                if ($scope.course1.length !== 0) {
                    $scope.details.qualification = $scope.course1;
                    $scope.courseMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage1 = 'Select Course';
                    $scope.isValid = false
                }
                if ($scope.stream1.length !== 0) {
                    $scope.details.streams = $scope.stream1;
                    $scope.streamMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage1 = 'Select Stream';
                    $scope.isValid = false
                }

                $scope.details.yop = $scope.yop1;
                $scope.details.cgpaMin = $scope.cgpaMin1;
                $scope.details.percentageMin = $scope.percentageMin1;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock2)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major2.length !== 0)
                {
                    $scope.details.major = $scope.major2;
                    $scope.majorMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage2 = 'Select Major';
                    $scope.isValid = false;
                }
                if ($scope.course2.length !== 0) {
                    $scope.details.qualification = $scope.course2;
                    $scope.courseMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage2 = 'Select Course';
                    $scope.isValid = false
                }
                if ($scope.stream2.length !== 0) {
                    $scope.details.streams = $scope.stream2;
                    $scope.streamMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage2 = 'Select Stream';
                    $scope.isValid = false
                }

                $scope.details.yop = $scope.yop2;
                $scope.details.cgpaMin = $scope.cgpaMin2;
                $scope.details.percentageMin = $scope.percentageMin2;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock3)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major3.length !== 0)
                {
                    $scope.details.major = $scope.major3;
                    $scope.majorMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage3 = 'Select Major';
                    $scope.isValid = false;
                }
                if ($scope.course3.length !== 0) {
                    $scope.details.qualification = $scope.course3;
                    $scope.courseMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage3 = 'Select Course';
                    $scope.isValid = false
                }
                if ($scope.stream3.length !== 0) {
                    $scope.details.streams = $scope.stream3;
                    $scope.streamMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage3 = 'Select Stream';
                    $scope.isValid = false
                }

                $scope.details.yop = $scope.yop3;
                $scope.details.cgpaMin = $scope.cgpaMin3;
                $scope.details.percentageMin = $scope.percentageMin3;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock4)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major4.length !== 0)
                {
                    $scope.details.major = $scope.major4;
                    $scope.majorMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage4 = 'Select Major';
                    $scope.isValid = false;
                }
                if ($scope.course4.length !== 0) {
                    $scope.details.qualification = $scope.course4;
                    $scope.courseMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage4 = 'Select Course';
                    $scope.isValid = false
                }
                if ($scope.stream4.length !== 0) {
                    $scope.details.streams = $scope.stream4;
                    $scope.streamMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage4 = 'Select Stream';
                    $scope.isValid = false
                }

                $scope.details.yop = $scope.yop4;
                $scope.details.cgpaMin = $scope.cgpaMin4;
                $scope.details.percentageMin = $scope.percentageMin4;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
        } else
        {
            $scope.isValid = false;
            alert("Please Add Eligibility Criteria");
        }
    };
//
//    function($scope) {
//     $rootScope.$on("CallParentMethod", function(){
//     copyFields();
//     });
//     };

    //This parent function copies html form data to "generalOpportunityFields" object and then to "opportunity" object	
    var copyFields = function () {
        $opportunity = {};
        $scope.generalOpportunityFields = {};
        $scope.generalOpportunityFields.summary = $scope.summary;
        $scope.generalOpportunityFields.noOfPositions = $scope.noOfPositions;
        $scope.generalOpportunityFields.budget = $scope.budget;
        $scope.generalOpportunityFields.currency = $scope.currency;
        if ($scope.keySkills.length !== 0)
        {
            $scope.generalOpportunityFields.skillsRequire = $scope.keySkills;
            $scope.isValid = $scope.isValid && true;
            $scope.skillMessage = undefined;
        } else
        {
            $scope.skillMessage = 'Select Key Skills';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.jobLocation.length !== 0)
        {
            $scope.generalOpportunityFields.opportunityLocation = $scope.jobLocation;
            $scope.isValid = $scope.isValid && true;
            $scope.locationMessage = undefined;
        } else
        {
            $scope.locationMessage = 'Select Location';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        $scope.generalOpportunityFields.minExperience = $scope.minExperience;
        $scope.generalOpportunityFields.maxExperience = $scope.maxExperience;
        $scope.generalOpportunityFields.eduDetails = $scope.eduDetails;
        $scope.generalOpportunityFields.opportunityDescription = $scope.opportunityDescription;
        $scope.generalOpportunityFields.selectionProcess = $scope.selectionProcess;
        if ($scope.type === 'internship' || $scope.type == 'research') {
            if ($scope.startDate !== undefined) {
                var dateAsString = $filter('date')($scope.startDate, "dd-MMM-yyyy");
                $scope.generalOpportunityFields.startDate = dateAsString;
                $scope.isValid = $scope.isValid && true;
                $scope.startDateMessage = undefined;
            } else
            {
                $scope.startDateMessage = 'Please Select Start Date';
                $scope.isValid = false;
                $scope.eduDetails = [];
            }
            if ($scope.endDate !== undefined) {
                if ($scope.startDate >= $scope.endDate) {
                    $scope.endDateMessage = 'End Date Should Be Greater Than Start Date';
                    $scope.endDate = undefined;
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                } else {
                    var dateAsString = $filter('date')($scope.endDate, "dd-MMM-yyyy");
                    $scope.generalOpportunityFields.endDate = dateAsString;
                    $scope.isValid = $scope.isValid && true;
                    $scope.endDateMessage = undefined;
                }
            } else
            {
                $scope.endDateMessage = 'Please Select End Date';
                $scope.isValid = false;
                $scope.eduDetails = [];
            }
        }
        var generalOpportunityFields = $scope.generalOpportunityFields;
                $opportunity = {generalOpportunityFields};
        $opportunity.type = $scope.type;
        $opportunity.lastDateToApply = $scope.lastDateToApplyString;
    };
    //This function calls parent function "copyFields()" to copy html data from Job, Internship and Research html forms	
    $scope.copyPlacementOpportunity = function () {
        //Statements below checks if "lastDateToApply" field is undefined and sets date after 1 year by default, if undefined	
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
        {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            $scope.lastDateToApplyString = (day + '-' + monthNames[(month)] + '-' + (year + 1));
            $scope.lastDateToApply = new Date($scope.lastDateToApplyString);
        } else
        {
            $scope.lastDateToApplyString = $filter('date')($scope.lastDateToApply, "dd-MMM-yyyy");
        }
        copyFields();
    };
    //This function is used to copy html data from mentorship html form
    $scope.copyMentiOpportunity = function () {

        //Statements below checks if "lastDateToApply" field is undefined and sets date after 1 year by default, if undefined	
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
        {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            $scope.lastDateToApplyString = (day + '-' + monthNames[(month)] + '-' + (year + 1));
            $scope.lastDateToApply = new Date($scope.lastDateToApplyString);
        } else
        {
            $scope.lastDateToApplyString = $filter('date')($scope.lastDateToApply, "dd-MMM-yyyy");
        }
        $scope.instituteType = [];
        $opportunity = {};
        $mentorTypeFields = {};
        //These statements actually assigns data from mentorship html form
        $mentorTypeFields.mentorOpportunityDescription = $scope.mentorOpportunityDescription;
        $mentorTypeFields.mentorSummary = $scope.mentorSummary;
        if ($scope.keySkills.length !== 0)
        {
            $mentorTypeFields.mentorKeySkills = $scope.keySkills;
            $scope.isValid = $scope.isValid && true;
            $scope.skillMessage = undefined;
        } else
        {
            $scope.skillMessage = 'Select Key Skills';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.itDomain.length !== 0 || $scope.nonItDomain.length !== 0)
        {
            if ($scope.itDomain.length !== 0) {
                $mentorTypeFields.mentorItDomain = $scope.itDomain;
            }
            if ($scope.nonItDomain.length !== 0)
                $mentorTypeFields.mentorNonItDomain = $scope.nonItDomain;
            $scope.isValid = $scope.isValid && true;
            $scope.domainMessage = undefined;
        } else
        {
            $scope.domainMessage = 'Select Domains (IT/NON-IT)';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.functionalInterest.length !== 0)
        {
            $mentorTypeFields.mentorFunction = $scope.functionalInterest;
            $scope.isValid = $scope.isValid && true;
            $scope.interestMessage = undefined;
        } else
        {
            $scope.interestMessage = 'Select Functional Interest';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        $mentorTypeFields.menteeEduDetails = $scope.eduDetails;
        if ($scope.selection.length !== 0) {
            $mentorTypeFields.menteeInstitutes = $scope.selection;
            $scope.isValid = $scope.isValid && true;
            $scope.typesMessage = undefined;
        } else
        {
            $scope.typesMessage = 'Select Institute Types';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        $mentorTypeFields.menteeMinExp = $scope.minExp;
        $mentorTypeFields.menteeMaxExp = $scope.maxExp;
        var mentorTypeFields = $mentorTypeFields;
                $opportunity = {mentorTypeFields};
        $opportunity.type = $scope.type;
        $opportunity.paidOrFreeConsult = $scope.paidOrFree;
        $opportunity.lastDateToApply = $scope.lastDateToApplyString;
    };
    //This function send http post request with API and opportunity object as parameters to post data to database	
    $scope.postOpportunity = function () {

        //This authenticate user for permissions
        if ($scope.isValid) {
            $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.post(CONSTANTS.SERVICES.OPPORTUNITIES, $opportunity).success(function ($opportunity) {
                alert('Opportunity posted successfully!!!');
                //Statement below redirects to posted opportunity page
                $location.path("/home/org-post/org-posted");
            });
        }
    };
    //This function is used to edit opportunity for Job, Internship and Research
    $scope.postEditOpportunity = function () {


        $opportunity = {};
        $scope.generalOpportunityFields = {};
        $scope.generalOpportunityFields = $scope.opp.generalOpportunityFields;
        var generalOpportunityFields = $scope.generalOpportunityFields;
        $opportunity = generalOpportunityFields;
        $opportunity.type = $scope.opp.type;
        $opportunity.lastDateToApply = $scope.opp.lastDateToApply;
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $http.put(CONSTANTS.SERVICES.OPPORTUNITIES + '/' + $scope.opp.id, $opportunity).success(function ($opportunity) {
            alert('Opportunity edited successfully!');
            //Statement below redirects to posted opportunity page
            $location.path("/home/org-post/org-posted");
        });
    };
    //This function is used to edit mentorship opportunity
    $scope.editMentorOpportunity = function () {

        //Statements below checks if "lastDateToApply" field is undefined and sets date after 1 year by default, if undefined
        angular.isUndefined($scope.lastDateToApply);
        if ($scope.lastDateToApply === undefined)
            $scope.lastDateToApply = (day + '-' + (month) + '-' + (year + 1));
        $opportunity = {};
        $mentorTypeFields = {};
        //This copies data from selected opportunity to "$mentorTypeFields" object
        $mentorTypeFields = $scope.opp.mentorTypeFields;
        var mentorTypeFields = $mentorTypeFields;
        $opportunity = mentorTypeFields;
        $opportunity.type = $scope.opp.type;
        $opportunity.paidOrFreeConsult = $scope.opp.paidOrFree;
        $opportunity.lastDateToApply = $scope.opp.lastDateToApply;
        //This authenticate user for permissions
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        //This sends http put request(for overwriting existing data) with API and opportunity object as a parameter
        $http.put(CONSTANTS.SERVICES.OPPORTUNITIES + '/' + $scope.opp.id, $opportunity).success(function ($opportunity) {
            alert('Opportunity posted successfully!!!');
            //Statement below redirects to posted opportunity page
            $location.path("/home/org-post/org-posted");
        });
    };
});
/**
 * Author: Rushikesh Nere
 * (c) Midasfusion.com
 * License: MidasBlue
 */

/** @description
 *This controller provides a utility for getting and deleting opportunities for different types like job,
 *internship, research project and mentorship for Organizations.
 *This module includes logic for getting and deleting different posted opportunities.
 */

//This is controller for getting and deleting opportunities posted by Organization type
futureMakerApp.controller('OrgPostGetController', function ($scope, $location, $window, $http, $cookieStore, CONSTANTS, emailTemplateService, opportunityService, userService) {

    //This gets user object and opportunity object from respective services
    $scope.user = userService.getUser();
    $scope.opp = opportunityService.getOpportunity();
    //This authenticates user for permissions
    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    //This send http get request to server with API and user object as parameters
    $http.get(CONSTANTS.SERVICES.OPPORTUNITIES, $scope.user).success(function ($opportunity) {
        $scope.opportunities = $opportunity;
    });
    //This function copies specific opportunity for editing or copying
    $scope.copyOpp = function (opportunity, action) {
        var a = opportunity;
        a.action = action;
        opportunityService.addOpportunity(a);
        switch (opportunity.type) {
            case 'job':
                $location.path("/home/edit-post-job");
                break;
            case 'internship':
                $location.path("/home/edit-post-internship");
                break;
            case 'research':
                $location.path("/home/edit-post-research");
                break;
            case 'mentee':
                $location.path("/home/edit-post-menteeship");
                break;
            default:
                break;
        }
    };
    //This function is used to delete specific opportunity
    $scope.postDeleteOpportunity = function (opportunity) {

        var a = opportunity;
        opportunityService.addOpportunity(a);
        $scope.opp = opportunityService.getOpportunity();
        //This authenticates user for performing delete operation	
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        //This confirms deletion operation with popup for confirmation
        var deleteOpp = $window.confirm('Are you sure you want to permanently delete the opportunity?');
        if (deleteOpp) {

            $http.delete(CONSTANTS.SERVICES.OPPORTUNITIES + '/' + $scope.opp.id, $scope.opp).success(function ($opportunity) {
                alert('Opportunity deleted successfully!');
                $window.location.reload();
            });
        }
    };
    $scope.viewAppliedCandidates = function ($opportunityId) {


        //This authenticates user for performing delete operation
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.emailId) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        //This confirms deletion operation with popup for confirmation

        $http.get(CONSTANTS.SERVICES.GETCANDID + $opportunityId).success(function ($candidates) {

            if ($candidates.length === 0) {
                alert("No Applications Yet");
            } else
                searchService.addSearch($candidates);
            //$location.path("/home/org-post/org-posted");

        }).error(function (error) {
            alert(error.error || error.message || error);
        });
    };
    $scope.saveAsEmail = function (opportunity) {
        switch (opportunity.type) {
            case 'job':
            case 'internship':
            case 'research':
                angular.forEach(opportunity.generalOpportunityFields.opportunityLocation, function (item, index) {

                    if (index === 0)
                    {
                        $locations = item;
                    } else
                    {
                        $locations = $locations + ',' + item;
                    }
                }
                );
                angular.forEach(opportunity.generalOpportunityFields.skillsRequire, function (item, index) {

                    if (index === 0)
                    {
                        $skills = item;
                    } else
                    {
                        $skills = $skills + ',' + item;
                    }
                });
                $subject = "Shortlisted for " + opportunity.generalOpportunityFields.summary;
                $body = "Greetings From Midas Fusion\n\nCongratulations You Are Shortlisted for a opportunity \n\nJob Description:\n" + opportunity.generalOpportunityFields.opportunityDescription;
                $body = $body + "\n\nExperirence Required: " + opportunity.generalOpportunityFields.minExperience + ' to ' + opportunity.generalOpportunityFields.maxExperience + ' year(s)';
                $body = $body + "\n\nSalary: " + opportunity.generalOpportunityFields.budget + ' ' + opportunity.generalOpportunityFields.currency;
                $body = $body + "\n\nJob Location: " + $locations;
                $body = $body + "\n\nSkills Required: " + $skills;
                $body = $body + "\n\nNumber Of Positions:" + opportunity.generalOpportunityFields.noOfPositions;
                $signature = "Thanks and Regards\n" + opportunity.ownerFields.name;
                $template = {
                    jobDescription: $body,
                    positionName: opportunity.generalOpportunityFields.summary,
                    senderEmail: opportunity.ownerFields.emailId,
                    signature: $signature,
                    subject: $subject
                };
                break;
            case 'mentee':

                angular.forEach(opportunity.mentorTypeFields.mentorKeySkills, function (item, index) {

                    if (index === 0)
                    {
                        $skills = item;
                    } else
                    {
                        $skills = $skills + ',' + item;
                    }
                });
                $subject = "Shortlisted for " + opportunity.mentorTypeFields.mentorSummary;
                $body = "Greetings From Midas Fusion\n\nCongratulations You Are Shortlisted for a opportunity \n\nJob Description:\n" + opportunity.mentorTypeFields.mentorOpportunityDescription;
                $body = $body + "\n\nExperirence Required: " + opportunity.mentorTypeFields.menteeMinExp + ' to ' + opportunity.mentorTypeFields.menteeMaxExp + ' year(s)';
                $body = $body + "\n\Paid Or Free: " + opportunity.paidOrFreeConsult;
                $body = $body + "\n\nSkills I Have: " + $skills;
                $signature = "Thanks and Regards\n" + opportunity.ownerFields.name;
                $template = {
                    jobDescription: $body,
                    positionName: opportunity.mentorTypeFields.mentorSummary,
                    senderEmail: opportunity.ownerFields.emailId,
                    signature: $signature,
                    subject: $subject
                };
                break;
        }
        emailTemplateService.addTemplate($template);
        $location.path("/home/save-as-template");
    };
    //This is used for required date format
    $scope.getDateFormat = function (timestamp) {
        return new Date(timestamp);
    };
    //This function is used for showing datatable

    // var table = $('#bootstrap-table').DataTable();
    //table.destroy();
    setTimeout(function () {
        //table = 
        $('#bootstrap-table').DataTable(
                // {
                //"order": [[ 3, "desc" ]]
                //}
                );
    }, 300);
});
futureMakerApp.controller('OrgSearchController', function ($scope, $location, $resource, $window, $http, $cookieStore, dropdownOptionsService, KEYSKILLS, LOCATIONS, ITDOMAINS, NONITDOMAINS, MAJORS, COURSES, FUNCTIONALINTEREST, STREAMS, CONSTANTS, searchURLService, searchService, userService) {
    $scope.user = userService.getUser();
    $scope.keySkills = [];
    $scope.skillOptions = [KEYSKILLS.count - 1];
    $scope.skillOptions = KEYSKILLS.keyskills;
    $scope.skillConfig = dropdownOptionsService.getSkillsConfig();
    //This loads ITDomain options for dropdown menu from dropdownOptionsService
    $scope.itDomain;
    $scope.itDomainOptions = [ITDOMAINS.count - 1];
    $scope.itDomainOptions = ITDOMAINS.ITDomains;
    $scope.itDomainsConfig = dropdownOptionsService.getITDomainConfig();
    //This loads NonITDomain options for dropdown menu from dropdownOptionsService
    $scope.nonItDomain;
    $scope.nonItDomainOptions = [NONITDOMAINS.count - 1];
    $scope.nonItDomainOptions = NONITDOMAINS.NonITDomains;
    $scope.nonItDomainsConfig = dropdownOptionsService.getNonITDomainConfig();
    //This loads Major options for dropdown menu from dropdownOptionsService
    $scope.$parent.major = [];
    $scope.majorOptions = [MAJORS.count - 1];
    $scope.majorOptions = MAJORS.majors;
    $scope.majorConfig = dropdownOptionsService.getMajorConfig();
    //This loads Location options for dropdown menu from dropdownOptionsService
    $scope.jobLocation;
    $scope.locationOptions = [LOCATIONS.count - 1];
    $scope.locationOptions = LOCATIONS.location;
    $scope.locationConfig = dropdownOptionsService.getLocationConfig();
    //This loads Course options for dropdown menu from dropdownOptionsService
    $scope.$parent.course;
    $scope.courseOptions = [COURSES.count - 1];
    $scope.courseOptions = COURSES.courses;
    $scope.courseConfig = dropdownOptionsService.getCourseConfig();
    //This loads Year of Passing options for dropdown menu from dropdownOptionsService
    //$scope.$parent.yop = [];
    //$scope.yopOptions = [YOPASSING.count - 1];
    //$scope.yopOptions = YOPASSING.yop;
    //$scope.yopConfig = dropdownOptionsService.getYopConfig();

    //This loads FunctionalInterest options for dropdown menu from dropdownOptionsService
    $scope.functionalInterest;
    $scope.functionalInterestOptions = [FUNCTIONALINTEREST.count - 1];
    $scope.functionalInterestOptions = FUNCTIONALINTEREST.functionalInterest;
    $scope.functionalInterestConfig = dropdownOptionsService.getFunctionalInterestConfig();
    //This loads Stream options for dropdown menu from dropdownOptionsService
    $scope.$parent.stream;
    $scope.streamOptions = [STREAMS.count - 1];
    $scope.streamOptions = STREAMS.streams;
    $scope.streamConfig = dropdownOptionsService.getStreamConfig();
    $scope.types = []
    $scope.types = [
        {name: 'IITs', selected: false},
        {name: 'NITs', selected: false},
        {name: 'Deemed Universities', selected: false},
        {name: 'Autonomous', selected: false},
        {name: 'Others', selected: false}
    ];
    // selected fruits
    $scope.selection = [];
    // helper method to get selected fruits
    $scope.selectedTypes = function selectedTypes() {
        return filterFilter($scope.types, {selected: true});
    };
    $scope.interests = []
    $scope.interests = [
        {name: 'Placement', selected: false},
        {name: 'Internship', selected: false},
        {name: 'Research Project', selected: false},
        {name: 'Event Sponsorship', selected: false},
        {name: 'Guest Speaker', selected: false},
        {name: 'Mentorship', selected: false},
        {name: 'Innovation Sponsorshp', selected: false},
        {name: 'SME Consultation', selected: false}
    ];
    // selected fruits
    $scope.interestselection = [];
    // helper method to get selected fruits
    $scope.selectedInterests = function selectedInterests() {
        return filterFilter($scope.interests, {selected: true});
    };
    // watch fruits for changes
    $scope.$watch('interests|filter:{selected:true}', function (nv) {
        $scope.interestselection = nv.map(function (type) {
            return type.name;
        });
    }, true);
    $scope.sendData = function () {
        if ($scope.gradeMin === undefined && $scope.gradeMax === undefined && $scope.jeeAdvMax === undefined && $scope.jeeAdvMin === undefined && $scope.jeeMainMax === undefined && $scope.jeeMainMin === undefined && $scope.jobInterest === undefined && $scope.anyKeyword === undefined && $scope.allKeyword === undefined && $scope.exKeyword === undefined && $scope.itDomain === undefined && $scope.nonItDomain === undefined && $scope.yopMax === undefined && $scope.stream === undefined && $scope.jobLocation === undefined && $scope.currLocation === undefined && $scope.course === undefined && $scope.yopMin === undefined)
        {
            alert('Please Enter Atleast One Field');
        } else {
            //angular.isUndefined($scope.yopMin);
            if ($scope.yopMin === undefined)
                $scope.yopMin = 'null';
            //angular.isUndefined($scope.yopMax);
            if ($scope.yopMax === undefined)
                $scope.yopMax = 'null';
            //angular.isUndefined($scope.jeeMainMin);
            if ($scope.jeeMainMin === undefined)
                $scope.jeeMainMin = 'null';
            //angular.isUndefined($scope.jeeMainMax);
            if ($scope.jeeMainMax === undefined)
                $scope.jeeMainMax = 'null';
            //angular.isUndefined($scope.jeeAdvMin);
            if ($scope.jeeAdvMin === undefined)
                $scope.jeeAdvMin = 'null';
            //angular.isUndefined($scope.jeeAdvMax);
            if ($scope.jeeAdvMax === undefined)
                $scope.jeeAdvMax = 'null';
            //angular.isUndefined($scope.gradeMax);
            if ($scope.gradeMax === undefined)
                $scope.gradeMax = 'null';
            //angular.isUndefined($scope.gradeMin);
            if ($scope.gradeMin === undefined)
                $scope.gradeMin = 'null';
            // use $.param jQuery function to serialize data from JSON 
            $scope.itDomainString = '';
            angular.forEach($scope.itDomain, function (item, index) {

                if (index !== 0)
                    $scope.itDomainString = $scope.itDomainString + ',' + item;
                else
                    $scope.itDomainString = item;
            });
            $scope.nonItDomainString = '';
            angular.forEach($scope.nonItDomain, function (item, index) {

                if (index !== 0)
                    $scope.nonItDomainString = $scope.nonItDomainString + ',' + item;
                else
                    $scope.nonItDomainString = item;
            });
            $scope.jobLocationString = '';
            angular.forEach($scope.jobLocation, function (item, index) {
                if (index !== 0)
                    $scope.jobLocationString = $scope.jobLocationString + ',' + item;
                else
                    $scope.jobLocationString = item;
            });
            $scope.currLocationString = '';
            angular.forEach($scope.currLocation, function (item, index) {
                if (index !== 0)
                    $scope.currLocationString = $scope.currLocationString + ',' + item;
                else
                    $scope.currLocationString = item;
            });
            $scope.streamString = '';
            angular.forEach($scope.stream, function (item, index) {
                if (index !== 0)
                    $scope.streamString = $scope.streamString + ',' + item;
                else
                    $scope.streamString = item;
            });
            $scope.courseString = '';
            angular.forEach($scope.course, function (item, index) {
                if (index !== 0)
                    $scope.courseString = $scope.courseString + ',' + item;
                else
                    $scope.courseString = item;
            });
            var data = $.param({
                jobInterest: $scope.jobInterest,
                anyKeyword: $scope.anyKeyword,
                allKeyword: $scope.allKeyword,
                exKeyword: $scope.exKeyword,
                itDomainInterest: $scope.itDomainString,
                nonItDomainInterest: $scope.nonItDomainString,
                fieldOfStudy: $scope.streamString,
                currentLocation: $scope.currLocationString,
                preferLocation: $scope.jobLocationString,
                degree: $scope.courseString,
                yopMin: $scope.yopMin,
                yopMax: $scope.yopMax,
                jeeMainMin: $scope.jeeMainMin,
                jeeMainMax: $scope.jeeMainMax,
                jeeAdvMin: $scope.jeeAdvMin,
                jeeAdvMax: $scope.jeeAdvMax,
                gradeMin: $scope.gradeMin,
                gradeMax: $scope.gradeMax
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var address = $location.url(CONSTANTS.SERVICES.SEARCHES).search(data);
            var newAddress = address.$$url;
            $scope.Add = newAddress.slice(1);
            $authdata = utilities.Base64.encode($scope.user.username + ':' + $scope.user.password);
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.get($scope.Add, data).success(function (data, status, headers, config) {
                $scope.results = data;
                $scope.res = $scope.results.hits.hits; //[0]._source;
                $scope.res.total = $scope.results.hits.total;
                searchService.addSearch($scope.res);
                searchURLService.addURL($scope.Add);
                $location.path("/org-search-result");
            });
        }
    };
    $scope.sendORGData = function () {

        if ($scope.itDomain === undefined && $scope.jobInterest === undefined && $scope.nonItDomain === undefined && $scope.jobLocation === undefined && $scope.interestselection.length === 0)
        {
            alert('Please Enter Atleast One Field');
        } else {
            // use $.param jQuery function to serialize data from JSON 
            $scope.itDomainString = '';
            angular.forEach($scope.itDomain, function (item, index) {

                if (index !== 0)
                    $scope.itDomainString = $scope.itDomainString + ',' + item;
                else
                    $scope.itDomainString = item;
            });
            $scope.nonItDomainString = '';
            angular.forEach($scope.nonItDomain, function (item, index) {

                if (index !== 0)
                    $scope.nonItDomainString = $scope.nonItDomainString + ',' + item;
                else
                    $scope.nonItDomainString = item;
            });
            $scope.jobLocationString = '';
            angular.forEach($scope.jobLocation, function (item, index) {
                if (index !== 0)
                    $scope.jobLocationString = $scope.jobLocationString + ',' + item;
                else
                    $scope.jobLocationString = item;
            });
            $scope.interestString = '';
            angular.forEach($scope.interestselection, function (item, index) {
                if (index !== 0)
                    $scope.interestString = $scope.interestString + ',' + item;
                else
                    $scope.interestString = item;
            });
            var data = $.param({
                interest: $scope.interestString,
                location: $scope.jobLocationString,
                itDomain: $scope.itDomainString,
                nonItDomain: $scope.nonItDomainString,
                orgType: $scope.orgType,
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var address = $location.url(CONSTANTS.SERVICES.SEARCHESORG).search(data);
            var newAddress = address.$$url;
            $scope.Add = newAddress.slice(1);
            $authdata = utilities.Base64.encode(($scope.user.username || $scope.user.emailId) + ':' + $scope.user.password);
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.get($scope.Add, data, config).success(function (data, status, headers, config) {
                $scope.results = data;
                $scope.res = $scope.results.hits.hits;
                $scope.res.total = $scope.results.hits.total; //[0]._source;
                searchService.addSearch($scope.res);
                searchURLService.addURL($scope.Add);
                $location.path("/org-search-result");
            });
        }
    };
    $scope.sendGUESTData = function () {

        if ($scope.itDomain === undefined && $scope.title === undefined && $scope.nonItDomain === undefined && $scope.keySkills.length === 0 && $scope.functionalInterest === undefined && $scope.paidOrFree === undefined)
        {
            alert('Please Enter Atleast One Field');
        } else {
            $scope.itDomainString = '';
            angular.forEach($scope.itDomain, function (item, index) {

                if (index !== 0)
                    $scope.itDomainString = $scope.itDomainString + ',' + item;
                else
                    $scope.itDomainString = item;
            });
            $scope.nonItDomainString = '';
            angular.forEach($scope.nonItDomain, function (item, index) {

                if (index !== 0)
                    $scope.nonItDomainString = $scope.nonItDomainString + ',' + item;
                else
                    $scope.nonItDomainString = item;
            });
            $scope.keySkillsString = '';
            angular.forEach($scope.keySkills, function (item, index) {
                if (index !== 0)
                    $scope.keySkillsString = $scope.keySkillsString + ',' + item;
                else
                    $scope.keySkillsString = item;
            });
            $scope.functionalInterestString = '';
            angular.forEach($scope.functionalInterest, function (item, index) {
                if (index !== 0)
                    $scope.functionalInterestString = $scope.functionalInterestString + ',' + item;
                else
                    $scope.functionalInterestString = item;
            });
            // use $.param jQuery function to serialize data from JSON 
            var data = $.param({
                title: $scope.title,
                keySkills: $scope.keySkillsString,
                itDomain: $scope.itDomainString,
                nonItDomain: $scope.nonItDomainString,
                functionalInterest: $scope.functionalInterestString,
                paidOrFree: $scope.paidOrFree

            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var address = $location.url(CONSTANTS.SERVICES.GUESTSEARCH).search(data);
            var newAddress = address.$$url;
            $scope.Add = newAddress.slice(1);
            $authdata = utilities.Base64.encode(($scope.user.username || $scope.user.emailId) + ':' + $scope.user.password);
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.get($scope.Add, data, config).success(function (data, status, headers, config) {
                $scope.results = data;
                $scope.res = $scope.results.hits.hits;
                $scope.res.total = $scope.results.hits.total; //[0]._source;
                searchService.addSearch($scope.res);
                searchURLService.addURL($scope.Add);
                $location.path("/org-search-result");
            });
        }
    };
    $scope.sendData1 = function () {
        if ($scope.minExp === undefined && $scope.maxExp === undefined && $scope.jobInterest === undefined && $scope.anyKeyword === undefined && $scope.allKeyword === undefined && $scope.exKeyword === undefined && $scope.itDomain === undefined && $scope.nonItDomain === undefined && $scope.title === undefined && $scope.stream === undefined && $scope.jobLocation === undefined && $scope.functionalInterest === undefined && $scope.areaOfExpertise === undefined)
        {
            alert('Please Enter Atleast One Field');
        } else
        {

            if ($scope.minExp === undefined)
                $scope.minExp = 'null';
            //angular.isUndefined($scope.maxExp);
            if ($scope.maxExp === undefined)
                $scope.maxExp = 'null';
            // use $.param jQuery function to serialize data from JSON 
            $scope.itDomainString = '';
            angular.forEach($scope.itDomain, function (item, index) {

                if (index !== 0)
                    $scope.itDomainString = $scope.itDomainString + ',' + item;
                else
                    $scope.itDomainString = item;
            });
            $scope.nonItDomainString = '';
            angular.forEach($scope.nonItDomain, function (item, index) {

                if (index !== 0)
                    $scope.nonItDomainString = $scope.nonItDomainString + ',' + item;
                else
                    $scope.nonItDomainString = item;
            });
            $scope.jobLocationString = '';
            angular.forEach($scope.jobLocation, function (item, index) {
                if (index !== 0)
                    $scope.jobLocationString = $scope.jobLocationString + ',' + item;
                else
                    $scope.jobLocationString = item;
            });
            $scope.functionalInterestString = '';
            angular.forEach($scope.functionalInterest, function (item, index) {
                if (index !== 0)
                    $scope.functionalInterestString = $scope.functionalInterestString + ',' + item;
                else
                    $scope.functionalInterestString = item;
            });
            $scope.streamString = '';
            angular.forEach($scope.stream, function (item, index) {
                if (index !== 0)
                    $scope.streamString = $scope.streamString + ',' + item;
                else
                    $scope.streamString = item;
            });
            var data1 = $.param({
                interest: $scope.jobInterest,
                anyKeyword: $scope.anyKeyword,
                allKeyword: $scope.allKeyword,
                exKeyword: $scope.exKeyword,
                itDomain: $scope.itDomainString,
                nonItDomain: $scope.nonItDomainString,
                fieldOfStudy: $scope.streamString,
                currentLocation: $scope.jobLocationString,
                functionInterest: $scope.functionalInterestString,
                jobTitle: $scope.title,
                areaOfExpertise: $scope.areaOfExpertise,
                minExp: $scope.minExp,
                maxExp: $scope.maxExp
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var address = $location.url(CONSTANTS.SERVICES.SEARCHES1).search(data1);
            var newAddress = address.$$url;
            $scope.Add = newAddress.slice(1);
            $authdata = utilities.Base64.encode(($scope.user.username || $scope.user.emailId) + ':' + $scope.user.password);
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.get($scope.Add, data1, config).success(function (data, status, headers, config) {
                $scope.results = data;
                $scope.res = $scope.results.hits.hits;
                $scope.res.total = $scope.results.hits.total; //[0]._source;
                searchService.addSearch($scope.res);
                searchURLService.addURL($scope.Add);
                $location.path("/org-search-result");
            });
        }
    };
    $scope.sendData2 = function () {

        // use $.param jQuery function to serialize data from JSON 
        if ($scope.selection.length === 0 && $scope.stream === undefined && $scope.jobLocation === undefined && $scope.jobInterest === undefined)
        {
            alert('Please Enter Atleast One Field');
        } else {
            $scope.typeString = '';
            angular.forEach($scope.selection, function (item, index) {
                if (index !== 0)
                    $scope.typeString = $scope.typeString + ',' + item;
                else
                    $scope.typeString = item;
            });
            $scope.streamString = '';
            angular.forEach($scope.stream, function (item, index) {
                if (index !== 0)
                    $scope.streamString = $scope.streamString + ',' + item;
                else
                    $scope.streamString = item;
            });
            $scope.jobLocationString = '';
            angular.forEach($scope.jobLocation, function (item, index) {
                if (index !== 0)
                    $scope.jobLocationString = $scope.jobLocationString + ',' + item;
                else
                    $scope.jobLocationString = item;
            });
            var data2 = $.param({
                collegeType: $scope.typeString,
                streams: $scope.streamString,
                location: $scope.jobLocationString,
                interest: $scope.jobInterest
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var address = $location.url(CONSTANTS.SERVICES.SEARCHES2).search(data2);
            var newAddress = address.$$url;
            $scope.Add = newAddress.slice(1);
            $authdata = utilities.Base64.encode(($scope.user.username || $scope.user.emailId) + ':' + $scope.user.password);
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.get($scope.Add, data2, config).success(function (data, status, headers, config) {
                $scope.results = data;
                $scope.res = $scope.results.hits.hits;
                $scope.res.total = $scope.results.hits.total; //[0]._source;
                searchService.addSearch($scope.res);
                searchURLService.addURL($scope.Add);
                $location.path("/org-search-result");
            });
        }
    };
    $scope.sendData3 = function () {

        // use $.param jQuery function to serialize data from JSON 
        if ($scope.itDomain === undefined && $scope.title === undefined && $scope.nonItDomain === undefined && $scope.functionalInterest === undefined && $scope.paidOrFree === undefined)
        {
            alert('Please Enter Atleast One Field');
        } else {
            $scope.itDomainString = '';
            angular.forEach($scope.itDomain, function (item, index) {

                if (index !== 0)
                    $scope.itDomainString = $scope.itDomainString + ',' + item;
                else
                    $scope.itDomainString = item;
            });
            $scope.nonItDomainString = '';
            angular.forEach($scope.nonItDomain, function (item, index) {

                if (index !== 0)
                    $scope.nonItDomainString = $scope.nonItDomainString + ',' + item;
                else
                    $scope.nonItDomainString = item;
            });
            $scope.functionalInterestString = '';
            angular.forEach($scope.functionalInterest, function (item, index) {
                if (index !== 0)
                    $scope.functionalInterestString = $scope.functionalInterestString + ',' + item;
                else
                    $scope.functionalInterestString = item;
            });
            var data3 = $.param({
                eventSummary: $scope.title,
                eventItDomainDetails: $scope.itDomainString,
                eventNonItDomainDetails: $scope.nonItDomainString,
                eventFunctionDetails: $scope.functionalInterestString,
                eventPaidOrFree: $scope.paidOrFree
            });
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var address = $location.url(CONSTANTS.SERVICES.SEARCHES3).search(data3);
            var newAddress = address.$$url;
            $scope.Add = newAddress.slice(1);
            $authdata = utilities.Base64.encode(($scope.user.username || $scope.user.emailId) + ':' + $scope.user.password);
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.get($scope.Add, data3, config).success(function (data, status, headers, config) {
                $scope.results = data;
                $scope.res = $scope.results.hits.hits;
                $scope.res.total = $scope.results.hits.total; //[0]._source;
                searchService.addSearch($scope.res);
                searchURLService.addURL($scope.Add);
                $location.path("/org-search-result");
            });
        }
    };
    $scope.showModal = false;
    $scope.searchResult = function () {
        if (!$cookieStore.get("futuremaker")) {
            $scope.showModal = true;
        } else {
            $location.path("/org-search-result");
        }
    };
});
futureMakerApp.controller('AppliedCandidatesController', function ($scope, $location, searchURLService, $resource, $window, $http, $cookieStore, opportunityService, CONSTANTS, userService, searchService) {

    $scope.user = userService.getUser();
    $scope.opportunity = opportunityService.getOpportunity();
    $scope.searches = searchService.getSearch();
    $scope.clicked = function () {
        switch ($scope.user.userType) {
            case 'organisation':
                $location.path("/home/org-post/org-posted");
                break;
            case 'student':
                $location.path("/home/stud-posted");
                break;
            case 'institute':
                $location.path("/home/inst-posted");
                break;
            case 'mentor':
                $location.path("/home/mentor-posted");
                break;
            default:
                $location.path("#");
        }
    };
    $scope.getDateFormat = function (timestamp) {
        return new Date(timestamp);
    };
    $dummyArray = [];
    $scope.respond = function ($action, $id, $email) {

        /*for(var k = 0; k < $scope.abc.length; k++){
         $scope.name = $scope.abc[k].folderName;
         }*/


        angular.forEach($scope.opportunity.generalOpportunityFields.opportunityLocation, function (item, index) {

            if (index === 0)
            {
                $locations = item;
            } else
            {
                $locations = $locations + ',' + item;
            }
        });
        angular.forEach($scope.opportunity.generalOpportunityFields.skillsRequire, function (item, index) {

            if (index === 0)
            {
                $skills = item;
            } else
            {
                $skills = $skills + ',' + item;
            }
        });
        $subject = "Shortlisted for " + $scope.opportunity.generalOpportunityFields.summary.replace(/\n/g, "%0A");
        $body = "Greetings From Midas Fusion%0A%0ACongratulations You Are Shortlisted for a opportunity %0A%0AJob Description:%0A" + $scope.opportunity.generalOpportunityFields.opportunityDescription.replace(/\n/g, "%0A");
        $body = $body + "%0A%0ASalary: " + $scope.opportunity.generalOpportunityFields.budget.replace(/\n/g, "%0A") + ' ' + $scope.opportunity.generalOpportunityFields.currency.replace(/\n/g, "%0A");
        $body = $body + "%0A%0AJob Location: " + $locations;
        $body = $body + "%0A%0ASkills Required: " + $skills;
        $body = $body + "%0A%0ANumber Of Positions:" + $scope.opportunity.generalOpportunityFields.noOfPositions;
        $body = $body + "%0A%0AThanks and Regards%0A" + $scope.opportunity.ownerFields.name;
        $body = $body + "%0A%0ASent From Midas Fusion";
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $dummyArray.push($id);
        if ($dummyArray.length !== 0) {
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $scope.saveApi = CONSTANTS.SERVICES.JOBAPPLY + $scope.opportunity.id + '/' + $action;
            $http.put($scope.saveApi, $dummyArray).success(function ($dummyArray) {
                //$scope.closeModal();
                alert('Response registered successfully!');
                if ($action === 'shortlisted')
                {

                    var url = 'mailto:' + $email + '?Subject=' + $subject + '&body=' + $body;
                    $window.location.href = url;
                }
                //$window.location.reload();
                //$location.path("/home/org-post/org-posted");
            }).error(function (error) {

                alert(error.error || error);
            });
        } else
        {
            alert('Please Select Atleast One Candidate');
        }
    };
    $scope.selectChanged = function () {
        $scope.allCandidatesSelected = true;
        for (var i = 0; i < $scope.searches.length; i++) {
            if (!$scope.searches[i].isChecked)
                $scope.allCandidatesSelected = false;
        }
    }
    $scope.selectAll = function () {

        for (var i = 0; i < $scope.searches.length; i++) {
            $scope.searches[i].isChecked = $scope.allCandidatesSelected;
        }
    };
});
futureMakerApp.controller('OrgSearchResultController', function ($scope, $location, searchURLService, $resource, $window, $http, $cookieStore, CONSTANTS, userService, searchService) {

    $scope.user = userService.getUser();
    $scope.searchURL = searchURLService.getURL();
    $scope.searches = searchService.getSearch();
    if ($scope.searches.total % 10 === 0)
        $scope.lastPage = $scope.searches.total / 10;
    else
        $scope.lastPage = ($scope.searches.total - $scope.searches.total % 10) / 10 + 1;
    $scope.currentPage = 1;
    $scope.changePage = function (action) {
        if (action === '+')
            $scope.currentPage = $scope.currentPage + 1;
        else
            $scope.currentPage = $scope.currentPage - 1;
        var from = (($scope.currentPage - 1) * 10);
        console.log('Page changed to: ' + $scope.currentPage);
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId) || ($scope.user.collegeId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $http.get($scope.searchURL + '&from=' + from).success(function ($resultArray) {
            $scope.searches = $resultArray.hits.hits;
            $scope.searches.total = $resultArray.hits.total;
            searchURLService.addURL($scope.searchURL);
            $('html, body').animate({
                scrollTop: $('#content').offset().top
            }, 'slow');
        });
    };
//  $scope.$watch('currentPage + numPerPage', function() {
////    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
////    , end = begin + $scope.numPerPage;
////    
//      $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)||($scope.user.collegeId)) + ':' + ($scope.user.password));
//        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
//        $http.get($scope.searchURL+'&from='+$scope.currentPage).success(function ($resultArray) {
//            $scope.searches = $resultArray.hits.hits;
//            $scope.searches.total=$resultArray.hits.total;
//            searchURLService.addURL($scope.searchURL);
//        });  
////    $scope.filteredTodos = $scope.todos.slice(begin, end);
//  });
    $scope.clicked = function () {
        switch ($scope.user.userType) {
            case 'organisation':
                $location.path("/home/organisation");
                break;
            case 'student':
                $location.path("/home/student");
                break;
            case 'institute':
                $location.path("/home/inst-search-post-selection");
                break;
            case 'mentor':
                $location.path("/home/mentor-search-options");
                break;
            default:
                $location.path("#");
        }



    };
    $scope.exit = function () {
        $location.path("/home");
    };
    // This property will be bound when click on all candidate selected
    $scope.allCandidatesSelected = false;
    $scope.trial = [];
    $dummyArray = [];
    $scope.applyToJob = function ($oid, $ownid, $ownemail, $opptitle, $ownerType)
    {
        var data = {
            opportunityId: $oid,
            opportunityName: $opptitle,
            ownerId: $ownid,
            ownerEmail: $ownemail,
            userType: $ownerType
        };
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.emailId) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $http.post(CONSTANTS.SERVICES.JOBAPPLY, data).success(function ($dummyArray) {
            //$scope.closeModal();
            alert($dummyArray.success);
            $scope.clicked();
            //$location.path("/home/org-post/org-posted");
        }).error(function (error) {
            alert(error.error || error);
            // $location.path("/login");
        });
    };
    // This executes when all candidate is checked
    $scope.selectAll = function () {

        for (var i = 0; i < $scope.searches.length; i++) {
            $scope.searches[i].isChecked = $scope.allCandidatesSelected;
        }
    };
    $scope.addToFolder = function ($folderName, $folderId) {
        $('[visible="showFolderModal"]').modal('hide');
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        for (var i = 0; i < $scope.searches.length; i++)
        {
            if ($scope.searches[i].isChecked === true)
            {
                $scope.searches[i]._source.id = $scope.searches[i]._id;
                $dummyArray.push($scope.searches[i]._source);
            }
        }


        var addOpp = $window.confirm('Are you sure you want to add data to the folder ' + $folderName + '?');
        if (addOpp)
        {

            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $scope.saveApi = CONSTANTS.SERVICES.FOLDERS + '/' + $folderId;
            $http.put($scope.saveApi, $dummyArray).success(function ($dummyArray) {
                //$scope.closeModal();
                alert('Results Added successfully!');
                //$window.location.reload();
                //$location.path("/home/org-post/org-posted");
            }).error(function (error) {

                alert(error || error.error);
            });
        }


    };
    $scope.saveSearch = function () {

        /*for(var k = 0; k < $scope.abc.length; k++){
         $scope.name = $scope.abc[k].folderName;
         }*/
        $('[visible="showFolderModal"]').modal('hide');
        $folder = ($scope.result.folderName) || ($scope.name);
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        for (var i = 0; i < $scope.searches.length; i++)
        {
            if ($scope.searches[i].isChecked === true)
            {
                $scope.searches[i]._source.id = $scope.searches[i]._id;
                $dummyArray.push($scope.searches[i]._source);
            }
        }
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $scope.saveApi = CONSTANTS.SERVICES.FOLDERS + '/' + $scope.user.id + '/' + $folder;
        $http.post($scope.saveApi, $dummyArray).success(function ($dummyArray) {
            //$scope.closeModal();
            alert('Results saved successfully!');
            //$window.location.reload();
            //$location.path("/home/org-post/org-posted");
        }).error(function (error) {

            alert(error || error.error);
        });
    };
    $scope.saveSearchURL = function () {

        /*for(var k = 0; k < $scope.abc.length; k++){
         $scope.name = $scope.abc[k].folderName;
         }*/


        $searchdata = {};
        $searchdata.searchName = $scope.searchName;
        $searchdata.searchUrl = $scope.searchURL;
        $('[visible="showSearchModal"]').modal('hide');
        var address = $location.url(CONSTANTS.SERVICES.SAVESEARCH);
        var newAddress = address.$$url;
        $scope.Add = newAddress.slice(1);
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $http.post($scope.Add, $searchdata).success(function (response) {
            //$scope.closeModal();
            alert('Search Saved successfully!');
        }).error(function (error) {
            alert(error || error.error);
        });
    };
    $scope.getFolders = function () {
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $http.get(CONSTANTS.SERVICES.FOLDERS).success(function ($resultArray) {
            $scope.abc = $resultArray;
        });
    };
    $scope.showResults = function () {
        $savedResults = $scope.abc[0].students[0];
    };
});
futureMakerApp.controller('ProfileResultController', function ($scope, $location, $resource, $window, $http, $cookieStore, $templateCache, CONSTANTS, userService, searchService) {

    $scope.user = userService.getUser();
    $scope.searches = searchService.getSearch();
    $scope.clicked = function () {
        switch ($scope.user.userType) {
            case 'organisation':
                $location.path("/home/organisation");
                break;
            case 'student':
                $location.path("/home/student");
                break;
            case 'institute':
                $location.path("/home/inst-search-post-selection");
                break;
            case 'mentor':
                $location.path("/home/mentor-search-options");
                break;
            default:
                $location.path("#");
        }

    };
    $scope.exit = function () {
        $location.path("/home");
    };
});
futureMakerApp.controller('ResumeController', function ($scope, fileUpload, $sce, CONSTANTS, userService, $http) {
    $scope.user = userService.getUser();

    $scope.$watch('myFile', function (newFileObj) {
        if (newFileObj)
            $scope.filename = newFileObj.name;
    });

    $scope.uploadFile = function () {
        var file = $scope.myFile;
        console.log('file is ');
        console.dir(file);
        console.log('size of file is ' + file.size);
        if (file.size <= 500000) {
            $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.emailId)) + ':' + ($scope.user.password));
            var uploadUrl = CONSTANTS.SERVICES.UPLOADRESUME;
            fileUpload.uploadFileToUrl(file, uploadUrl, $authdata);
        } else
        {
            alert("File Size Should Be less than 500kb");
        }
    };
    $scope.getResume = function () {
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $http.get(CONSTANTS.SERVICES.UPLOADRESUME + '/file', {responseType: 'arraybuffer'}).success(function (response) {
//                $scope.abc = $resultArray;
            var file = new Blob([response], {type: 'application/pdf'});
            $scope.fileURL = (window.URL || window.webkitURL).createObjectURL(file);
            $sce.trustAsUrl(fileURL);
//            $window.location.href = fileURL;

        });
    };

});
/**
 * Author: Rushikesh Nere
 * (c) Midasfusion.com
 * License: MidasBlue
 */

/** @description
 *This controller provides a utility for posting opportunity for inviting mentor for Students.
 *This module includes logic for posting and editing different opportunities.
 */

//This is controller for opportunity post feature for Student type
futureMakerApp.controller('StudPostController', function ($scope, $location, $resource, $http, $cookieStore, dropdownOptionsService, KEYSKILLS, LOCATIONS, ITDOMAINS, NONITDOMAINS, MAJORS, COURSES, FUNCTIONALINTEREST, STREAMS, CONSTANTS, opportunityService, userService) {

    //clear all function
    $scope.clearAll = function () {
        $scope.keySkills = [];
        $scope.major = [];
        $scope.stream = [];
        $scope.course = [];
        $scope.qualification = [];
        $scope.itDomain = [];
        $scope.nonItDomain = [];
        $scope.functionalInterest = [];
        $scope.domains = [];
        $scope.jobLocation = [];
        $scope.lastDateToApply = undefined;
        $scope.$setPristine(true);
    };
    //Statements below imports user object and opportunity object from angular services respectively	
    $scope.user = userService.getUser();
    $scope.opp = opportunityService.getOpportunity();
    $scope.isValid = true;
    //This gives current day,month and year which is used below for validation purpose
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var month = currentTime.getMonth();
    var day = currentTime.getDate();
    //This loads keyskills options for dropdown menu from dropdownOptionsService
    $scope.keySkills = [];
    $scope.skillOptions = [KEYSKILLS.count - 1];
    $scope.skillOptions = KEYSKILLS.keyskills;
    $scope.skillConfig = dropdownOptionsService.getSkillsConfig();
    //This loads ITDomain options for dropdown menu from dropdownOptionsService
    $scope.itDomain = [];
    $scope.itDomainOptions = [ITDOMAINS.count - 1];
    $scope.itDomainOptions = ITDOMAINS.ITDomains;
    $scope.itDomainsConfig = dropdownOptionsService.getITDomainConfig();
    //This loads Non-ITDomain options for dropdown menu from dropdownOptionsService
    $scope.nonItDomain = [];
    $scope.nonItDomainOptions = [NONITDOMAINS.count - 1];
    $scope.nonItDomainOptions = NONITDOMAINS.NonITDomains;
    $scope.nonItDomainsConfig = dropdownOptionsService.getNonITDomainConfig();
    //This loads Location options for dropdown menu from dropdownOptionsService
    $scope.jobLocation = [];
    $scope.locationOptions = [LOCATIONS.count - 1];
    $scope.locationOptions = LOCATIONS.location;
    $scope.locationConfig = dropdownOptionsService.getLocationConfig();
    //This loads Year of Passing options for dropdown menu from dropdownOptionsService
    //$scope.$parent.yop = [];
    //$scope.yopOptions = [YOPASSING.count - 1];
    //$scope.yopOptions = YOPASSING.yop;
    //$scope.yopConfig = dropdownOptionsService.getYopConfig();

    //This loads FunctionalInterest options for dropdown menu from dropdownOptionsService
    $scope.functionalInterest = [];
    $scope.functionalInterestOptions = [FUNCTIONALINTEREST.count - 1];
    $scope.functionalInterestOptions = FUNCTIONALINTEREST.functionalInterest;
    $scope.functionalInterestConfig = dropdownOptionsService.getFunctionalInterestConfig();
    //This loads Major options for dropdown menu from dropdownOptionsService
    $scope.$parent.major = [];
    $scope.majorOptions = [MAJORS.count - 1];
    $scope.majorOptions = MAJORS.majors;
    $scope.majorConfig = dropdownOptionsService.getMajorConfig();
    //This loads Course options for dropdown menu from dropdownOptionsService
    $scope.$parent.course = [];
    $scope.courseOptions = [COURSES.count - 1];
    $scope.courseOptions = COURSES.courses;
    $scope.courseConfig = dropdownOptionsService.getCourseConfig();
    //This loads Stream options for dropdown menu from dropdownOptionsService
    $scope.$parent.stream = [];
    $scope.streamOptions = [STREAMS.count - 1];
    $scope.streamOptions = STREAMS.streams;
    $scope.streamConfig = dropdownOptionsService.getStreamConfig();
    //This stores Educational Details data in an array
    $scope.eduDetails = [];
    $scope.addEduDetails = function () {
        //This sets validation for selection of year of passing input in html form
        if (($scope.yop > (year + 4))) {
            alert("Year of Passing value should be upto current year + 4");
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.showBlock || $scope.showBlock1 || $scope.showBlock2 || $scope.showBlock3 || $scope.showBlock4)
        {
            $scope.isValid = true;
            if ($scope.showBlock)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major.length !== 0)
                {
                    $scope.details.major = $scope.major;
                    $scope.majorMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course.length !== 0) {
                    $scope.details.qualification = $scope.course;
                    $scope.courseMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream.length !== 0) {
                    $scope.details.streams = $scope.stream;
                    $scope.streamMessage = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop;
                $scope.details.cgpaMin = $scope.cgpaMin;
                $scope.details.percentageMin = $scope.percentageMin;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }

            if ($scope.showBlock1)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major1.length !== 0)
                {
                    $scope.details.major = $scope.major1;
                    $scope.majorMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage1 = 'Select Major';
                    $scope.isValid = false;
                }
                if ($scope.course1.length !== 0) {
                    $scope.details.qualification = $scope.course1;
                    $scope.courseMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage1 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream1.length !== 0) {
                    $scope.details.streams = $scope.stream1;
                    $scope.streamMessage1 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage1 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop1;
                $scope.details.cgpaMin = $scope.cgpaMin1;
                $scope.details.percentageMin = $scope.percentageMin1;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock2)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major2.length !== 0)
                {
                    $scope.details.major = $scope.major2;
                    $scope.majorMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage2 = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course2.length !== 0) {
                    $scope.details.qualification = $scope.course2;
                    $scope.courseMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage2 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream2.length !== 0) {
                    $scope.details.streams = $scope.stream2;
                    $scope.streamMessage2 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage2 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop2;
                $scope.details.cgpaMin = $scope.cgpaMin2;
                $scope.details.percentageMin = $scope.percentageMin2;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock3)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major3.length !== 0)
                {
                    $scope.details.major = $scope.major3;
                    $scope.majorMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage3 = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course3.length !== 0) {
                    $scope.details.qualification = $scope.course3;
                    $scope.courseMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage3 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream3.length !== 0) {
                    $scope.details.streams = $scope.stream3;
                    $scope.streamMessage3 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage3 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop3;
                $scope.details.cgpaMin = $scope.cgpaMin3;
                $scope.details.percentageMin = $scope.percentageMin3;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
            if ($scope.showBlock4)
            {
                $scope.details = {};
                //This assigns html form data to "details" object declared above
                if ($scope.major4.length !== 0)
                {
                    $scope.details.major = $scope.major4;
                    $scope.majorMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else
                {
                    $scope.majorMessage4 = 'Select Major';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.course4.length !== 0) {
                    $scope.details.qualification = $scope.course4;
                    $scope.courseMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.courseMessage4 = 'Select Course';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }
                if ($scope.stream4.length !== 0) {
                    $scope.details.streams = $scope.stream4;
                    $scope.streamMessage4 = undefined;
                    $scope.isValid = $scope.isValid && true;
                } else {
                    $scope.streamMessage4 = 'Select Stream';
                    $scope.isValid = false;
                    $scope.eduDetails = [];
                }

                $scope.details.yop = $scope.yop4;
                $scope.details.cgpaMin = $scope.cgpaMin4;
                $scope.details.percentageMin = $scope.percentageMin4;
                if ($scope.isValid)
                    $scope.eduDetails.push($scope.details);
            }
        } else
        {
            $scope.isValid = false;
            alert("Please Add Eligibility Criteria");
            $scope.eduDetails = [];
        }
    };
    //This function copies html form data to "mentorTypeFields" object and then to "opportunity" object
    $scope.copyMentorForStudOpportunity = function () {

        /*angular.isUndefined($scope.lastDateToApply);
         if ($scope.lastDateToApply === undefined)
         $scope.lastDateToApply =(day+'-'+(month+1)+'-'+(year+1));*/

        $opportunity = {};
        $mentorTypeFields = {};
        $mentorTypeFields.mentorOpportunityDescription = $scope.opportunityDescription;
        $mentorTypeFields.mentorSummary = $scope.summary;
        if ($scope.keySkills.length !== 0)
        {
            $mentorTypeFields.mentorKeySkills = $scope.keySkills;
            $scope.isValid = $scope.isValid && true;
            $scope.skillMessage = undefined;
        } else
        {
            $scope.skillMessage = 'Select Key Skills';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.itDomain.length !== 0 || $scope.nonItDomain.length !== 0)
        {
            if ($scope.itDomain.length !== 0) {
                $mentorTypeFields.mentorItDomain = $scope.itDomain;
            }
            if ($scope.nonItDomain.length !== 0)
                $mentorTypeFields.mentorNonItDomain = $scope.nonItDomain;
            $scope.isValid = $scope.isValid && true;
            $scope.domainMessage = undefined;
        } else
        {
            $scope.domainMessage = 'Select Domains (IT/NON-IT)';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        if ($scope.functionalInterest.length !== 0)
        {
            $mentorTypeFields.mentorFunction = $scope.functionalInterest;
            $scope.isValid = $scope.isValid && true;
            $scope.interestMessage = undefined;
        } else
        {
            $scope.interestMessage = 'Select Functional Interest';
            $scope.isValid = false;
            $scope.eduDetails = [];
        }
        $mentorTypeFields.mentorEduDetails = $scope.eduDetails;
        $mentorTypeFields.mentorMinExp = $scope.minExperience;
        $mentorTypeFields.mentorMaxExp = $scope.maxExperience;
        var mentorTypeFields = $mentorTypeFields;
                $opportunity = {mentorTypeFields};
        //$opportunity = {mentorTypeFields};
        $opportunity.type = $scope.type;
        //$scope.lastDateToApply = (day+'-'+(month+1)+'-'+(year+1));
        //$opportunity.paidOrFreeConsult = $scope.paidOrFree;
    };
    //This function send http post request with API and opportunity object as parameters to post data to database
    $scope.postStudOpportunity = function () {

        //This authenticate user for permissions
        if ($scope.isValid)
        {
            $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.emailId)) + ':' + ($scope.user.password));
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.post(CONSTANTS.SERVICES.OPPORTUNITIES3, $opportunity).success(function ($opportunity) {
                alert('Opportunity posted successfully!!!');
                //Statement below redirects to posted opportunity page
                $location.path("/home/stud-posted");
            });
        }
    };
    //This function is used to edit posted opportunity
    $scope.postEditOpportunity = function () {

        $opportunity = {};
        $mentorTypeFields = {};
        //This copies data from selected opportunity to "$mentorTypeFields" object
        $mentorTypeFields = $scope.opp.mentorTypeFields;
        var mentorTypeFields = $mentorTypeFields;
        //$opportunity = {mentorTypeFields};
        $opportunity = mentorTypeFields;
        $opportunity.type = $scope.opp.type;
        //This authenticate user for permissions	
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        //$http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        $http.put(CONSTANTS.SERVICES.OPPORTUNITIES3 + '/' + $scope.opp._id, $opportunity).success(function ($opportunity) {
            alert('Opportunity posted successfully!!!');
            //Statement below redirects to posted opportunity page	
            $location.path("/home/stud-posted");
        });
    };
});
/**
 * Author: Rushikesh Nere
 * (c) Midasfusion.com
 * License: MidasBlue
 */

/** @description
 *This controller provides a utility for getting and deleting opportunities for invite mentor, for students.
 *This module includes logic for getting and deleting different posted opportunities.
 */

//This is controller for getting and deleting opportunities posted by Student type
futureMakerApp.controller('StudPostGetController', function ($scope, emailTemplateService, $location, $window, $http, $cookieStore, CONSTANTS, opportunityService, userService) {

    //This gets user object and opportunity object from respective services
    $scope.user = userService.getUser();
    $scope.opp = opportunityService.getOpportunity();
    //This authenticates user for permissions
    $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
    //  $http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
    $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
    //This send http get request to server with API and user object as parameters
    $http.get(CONSTANTS.SERVICES.OPPORTUNITIES3, $scope.user).success(function ($opportunity) {
        $scope.opportunities = $opportunity;
    });
    //This function copies specific opportunity for editing or copying
    $scope.copyOpp = function (opportunity, action) {
        var a = opportunity;
        a.action = action;
        opportunityService.addOpportunity(a);
        switch (opportunity.type) {
            case 'Mentorship':
                $location.path("/home/mentor-for-stud-edit");
                break;
            default:
                break;
        }
    };
    //This function is used to delete specific opportunity
    $scope.postDeleteOpportunity = function (opportunity) {

        var a = opportunity;
        opportunityService.addOpportunity(a);
        $scope.opp = opportunityService.getOpportunity();
        //This authenticates user for performing delete operation
        $authdata = utilities.Base64.encode((($scope.user.username) || ($scope.user.orgId)) + ':' + ($scope.user.password));
        //$http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
        $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
        //This confirms deletion operation with popup for confirmation
        var deleteOpp = $window.confirm('Are you sure you want to permanently delete the opportunity?');
        if (deleteOpp) {

            $http.delete(CONSTANTS.SERVICES.OPPORTUNITIES3 + '/' + $scope.opp.id, $scope.opp).success(function ($opportunity) {
                alert('Opportunity deleted successfully!');
                $window.location.reload();
            });
        }

    };
    $scope.saveAsEmail = function (opportunity) {
        angular.forEach(opportunity.mentorTypeFields.mentorKeySkills, function (item, index) {

            if (index === 0)
            {
                $skills = item;
            } else
            {
                $skills = $skills + ',' + item;
            }
        });
        $subject = "Shortlisted for " + opportunity.mentorTypeFields.mentorSummary;
        $body = "Greetings From Midas Fusion\n\nCongratulations You Are Shortlisted for a opportunity \n\nJob Description:\n" + opportunity.mentorTypeFields.mentorOpportunityDescription;
        $body = $body + "\n\nExperirence Required: " + opportunity.mentorTypeFields.mentorMinExp + ' to ' + opportunity.mentorTypeFields.mentorMaxExp + ' year(s)';
        $body = $body + "\n\nSkills Required: " + $skills;
        $signature = "Thanks and Regards\n" + opportunity.ownerFields.name;
        $template = {
            jobDescription: $body,
            positionName: opportunity.mentorTypeFields.mentorSummary,
            senderEmail: opportunity.ownerFields.emailId,
            signature: $signature,
            subject: $subject
        };
        emailTemplateService.addTemplate($template);
    };
    //This is used for required date format
    $scope.getDateFormat = function (timestamp) {
        return new Date(timestamp);
    };
    //This function is used for showing datatable

    // var table = $('#bootstrap-table').DataTable();
    //table.destroy();
    setTimeout(function () {
        //table = 
        $('#bootstrap-table').DataTable(
                // {

                //"order": [[ 3, "desc" ]]
                //}
                );
    }, 300);
});
futureMakerApp.directive('stringToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseFloat(value);
            });
        }
    };
});
futureMakerApp.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
futureMakerApp.directive('loading', ['$http', function ($http)
    {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };
                scope.$watch(scope.isLoading, function (v)
                {
                    if (v) {
                        elm.show();
                    } else {
                        elm.hide();
                    }
                });
            }
        };
    }]);
futureMakerApp.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
futureMakerApp.directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        // console.info(elem.val() === $(firstPassword).val());
                        ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                    });
                });
            }
        };
    }]);
futureMakerApp.directive('httpPrefix', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, controller) {
            function ensureHttpPrefix(value) {
                // Need to add prefix if we don't have http:// prefix already AND we don't have part of it
                if (value && !/^(https?):\/\//i.test(value) && 'http://'.indexOf(value) !== 0 && 'https://'.indexOf(value) !== 0) {
                    controller.$setViewValue('http://' + value);
                    controller.$render();
                    return 'http://' + value;
                } else
                    return value;
            }
            controller.$formatters.push(ensureHttpPrefix);
            controller.$parsers.splice(0, 0, ensureHttpPrefix);
        }
    };
});
futureMakerApp.directive('modal', function () {
    return {
        template: '<div class="modal fade login-model">' +
                '<div class="modal-dialog" ng-transclude>' +
                '</div>' +
                '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink($scope, $element, $attrs) {
            $scope.$watch($attrs.visible, function (value) {
                if (value === true)
                    $($element).modal('show');
                else
                    $($element).modal('hide');
            });
            $($element).on('shown.bs.modal', function () {
                $scope.$apply(function () {
                    $scope.$parent[$attrs.visible] = true;
                });
            });
            $($element).on('hidden.bs.modal', function () {
                $scope.$apply(function () {
                    $scope.$parent[$attrs.visible] = false;
                });
            });
        },
        controller: function ($scope, $element, $attrs, $transclude) {
            $scope.closeModal = function () {
                $($element).modal('hide');
            };
        }
    };
});
//directive for a multi select dropdown menu used on a search page

futureMakerApp.directive('dropdownMultiselect', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            model: '=',
            options: '=',
            name: "@",
            placeholder: "@"
        },
        template:
                "<div class='btn-group' >" +
                " <div class='chip'>" +
                "{{placeholder}}" +
                "<span class='closebtn' onclick='this.parentElement.style.display='none''>&times;</span>" +
                "</div>" +
                "<ul class='dropdown-menu' style='width:400px;' aria-labelledby='dropdownMenu'>" +
                "<li><a data-ng-click='selectAll()'><span  aria-hidden='true'></span> Check All</a></li>" +
                //	"<li><a data-ng-click='deselectAll();'><span aria-hidden='true'></span> Uncheck All</a></li>" +
                "<li class='divider'></li>" +
                "<li data-ng-repeat='option in options'><a data-ng-click='toggleSelectItem(option)'> {{option.name}} <span data-ng-class='getClassName(option)' aria-hidden='true'></span> </a></li>" +
                "</ul>" +
                "</div>",
        //	"<div data-ng-show='error'>" + "<p> please select domains </p>" + "<div>",

        /*	link: function (scope, element, attrs, ctrl) {
         
         ctrl.$validators.abc = function (modelValue, viewValue) {
         
         if (!viewValue) {
         return true;
         }
         return false;
         */

        controller: function ($scope) {


            $scope.openDropdown = function () {

                $scope.open = !$scope.open;
            };
            /*if($scope.model == []){
             
             $scope.error = true;
             }*/

            $scope.selectAll = function () {

                $scope.model = [];
                angular.forEach($scope.options, function (item, index) {

                    $scope.model.push(item.name);
                });
            };
            /*	$scope.deselectAll = function () {
             
             $scope.model = [];
             
             };*/

            $scope.toggleSelectItem = function (option) {

                var intIndex = -1;
                angular.forEach($scope.model, function (item, index) {

                    if (item === option.name) {

                        intIndex = index;
                    }

                });
                if (intIndex >= 0) {

                    $scope.model.splice(intIndex, 1);
                } else {

                    $scope.model.push(option.name);
                }

            };
            $scope.getClassName = function (option) {

                var varClassName = '';
                angular.forEach($scope.model, function (item, index) {

                    if (item === option.name) {

                        varClassName = 'glyphicon glyphicon-ok green pul-right';
                    }

                });
                return (varClassName);
            };
        }
    };
});
futureMakerApp.directive('uniqueUsername', function (CONSTANTS, $q, $http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, $element, $attrs, ngModel) {
            ngModel.$asyncValidators.unique = function (username) {
                var deferred = $q.defer();
                // $authdata = utilities.Base64.encode($scope.user.username + ':' + $scope.user.pw1);
                $userCheck = {};
                $userCheck.username = username;
                //       $http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
                $http.post(CONSTANTS.SERVICES.USERSCHECK, $userCheck).success(function () {

                    //User not found, therefore unique!
                    // $scope.successMessage = response.data;
                    deferred.resolve();
                    return false;
                }).error(function (error) {
                    //$scope.failureMessage = error.error;    
                    //$scope.showModal = true;

                    //  });
                    //, function() {
                    // Found the user, therefore not unique.
                    deferred.reject();
                    $scope.showalertModal = true;
                    return true;
                });
                //});
                return deferred.promise;
                //return deferred.promise;
            }; //isUsernameAvailable;

        }
    };
});
futureMakerApp.service('copyFieldsService', function () {
    var fields; //= $cookieStore.get("futuremaker");

    var addFields = function (newObj) {
        var copiedFields = newObj();
        /*$opportunity = {};
         
         $scope.generalOpportunityFields = {};
         
         $scope.generalOpportunityFields.summary = $scope.summary;
         $scope.generalOpportunityFields.noOfPositions = $scope.noOfPositions;
         $scope.generalOpportunityFields.budget = $scope.budget;
         $scope.generalOpportunityFields.currency = $scope.currency;
         $scope.generalOpportunityFields.skillsRequire = $scope.keySkills;
         $scope.generalOpportunityFields.opportunityLocation = $scope.jobLocation;
         $scope.generalOpportunityFields.minExperience = $scope.minExperience;
         $scope.generalOpportunityFields.maxExperience = $scope.maxExperience;
         $scope.generalOpportunityFields.eduDetails = $scope.eduDetails;
         $scope.generalOpportunityFields.opportunityDescription = $scope.opportunityDescription;
         $scope.generalOpportunityFields.selectionProcess = $scope.selectionProcess;
         $scope.generalOpportunityFields.startDate = $scope.startDate;
         $scope.generalOpportunityFields.endDate = $scope.endDate;
         
         var generalOpportunityFields = $scope.generalOpportunityFields;
         $opportunity = {generalOpportunityFields};
         $opportunity.type = $scope.type;
         $opportunity.lastDateToApply = $scope.lastDateToApply;*/
    };
    var getFields = function () {
        //$user = $cookies.get("futuremaker",$user);
        return fields;
    };
    return {
        addFields: addFields,
        getFields: getFields,
    };
});
futureMakerApp.service('dropdownOptionsService', function () {

    var getSkillsConfig = function () {
        //$user = $cookies.get("futuremaker",$user);
        var skillConfig = {
            create: true,
            valueField: 'data',
            labelField: 'data',
            delimiter: '|',
            placeholder: 'Add Skills',
            onInitialize: function (selectize) {
                // receives the selectize object as an argument
            },
            // maxItems: 1
        };
        return skillConfig;
    };
    var getITDomainConfig = function () {
        var ITDomainConfig = {
            create: true,
            valueField: 'name',
            labelField: 'name',
            delimiter: '|',
            placeholder: 'Select IT Domains',
            onInitialize: function (selectize) {
                // receives the selectize object as an argument
            },
            // maxItems: 1
        };
        return ITDomainConfig;
    };
    var getNonITDomainConfig = function () {
        var NonITDomainConfig = {
            create: true,
            valueField: 'name',
            labelField: 'name',
            delimiter: '|',
            placeholder: 'Select Non-IT Domains',
            onInitialize: function (selectize) {
                // receives the selectize object as an argument
            },
            // maxItems: 1
        };
        return NonITDomainConfig;
    };
    var getMajorConfig = function () {
        var majorConfig = {
            create: true,
            valueField: 'name',
            labelField: 'name',
            delimiter: '|',
            placeholder: 'Select Major',
            onInitialize: function (selectize) {
                // receives the selectize object as an argument
            },
            // maxItems: 1
        };
        return majorConfig;
    };
    var getLocationConfig = function () {
        var locationConfig = {
            create: true,
            valueField: 'name',
            labelField: 'name',
            delimiter: '|',
            placeholder: 'Select Location',
            onInitialize: function (selectize) {
                // receives the selectize object as an argument
            },
            // maxItems: 1
        };
        return locationConfig;
    };
    var getCourseConfig = function () {
        var courseConfig = {
            create: true,
            valueField: 'name',
            labelField: 'name',
            delimiter: '|',
            placeholder: 'Select Course',
            onInitialize: function (selectize) {
                // receives the selectize object as an argument
            },
            // maxItems: 1
        };
        return courseConfig;
    };
    var getFunctionalInterestConfig = function () {
        var functionalInterestConfig = {
            create: true,
            valueField: 'name',
            labelField: 'name',
            delimiter: '|',
            placeholder: 'Select Functional Interest',
            onInitialize: function (selectize) {
                // receives the selectize object as an argument
            },
            // maxItems: 1
        };
        return functionalInterestConfig;
    };
    var getStreamConfig = function () {
        var streamConfig = {
            create: true,
            valueField: 'name',
            labelField: 'name',
            delimiter: '|',
            placeholder: 'Select Stream',
            onInitialize: function (selectize) {
                // receives the selectize object as an argument
            },
            // maxItems: 1
        };
        return streamConfig;
    };
    /*	var getYopConfig = function(){
     var yopConfig = {		
     
     create: true,
     valueField: 'id',
     labelField: 'name',
     delimiter: '|',
     placeholder: 'Select Year of Passing',
     onInitialize: function(selectize){
     // receives the selectize object as an argument
     },
     // maxItems: 1
     };
     return yopConfig;
     };*/

    return {
        getSkillsConfig: getSkillsConfig,
        getITDomainConfig: getITDomainConfig,
        getNonITDomainConfig: getNonITDomainConfig,
        getMajorConfig: getMajorConfig,
        getLocationConfig: getLocationConfig,
        getCourseConfig: getCourseConfig,
        getFunctionalInterestConfig: getFunctionalInterestConfig,
        getStreamConfig: getStreamConfig,
        //getYopConfig:getYopConfig,
    };
});
futureMakerApp.service('emailTemplateService', function () {
    var template = null;
    var addTemplate = function (newObj) {
        template = newObj;
    };
    var getTemplate = function () {
        return template;
    };
    var delTemplate = function (Obj) {
        // delete Obj;
        return template;
    };
    return {
        addTemplate: addTemplate,
        getTemplate: getTemplate,
        delTemplate: delTemplate,
    };
    //var userName = null;

    // var userName = function (){ 
    //$http.get(CONSTANTS.SERVICES.USERS).success(function (data) {
    // userName = data;

    //});
    //return userName;
    //};
    //$scope.loginUser = function() {
    /*  $scope.orgResultFactory	
     $user = {};
     
     $user.username = $scope.user.username;
     $user.password = $scope.user.password;
     $user.type = $scope.user.type;
     
     $authdata = utilities.Base64.encode($user.username + ':' + $user.password);
     
     $http.defaults.headers.common['Authorization'] = 'Basic ' + $authdata;
     $http.get(CONSTANTS.SERVICES.USERS, $user).success(function( login) {
     
     userService.addUser($scope.user);
     
     $scope.$emit('showUserName', {
     menu: 'home'
     });
     
     */



    /*	userService.factory('orgResultFactory', function ($resource) {
     return $resource('CONSTANTS.SERVICES.USERS', {}, {
     query: {
     method: 'GET',
     params: {},
     isArray: false
     }
     })
     });*/

});
futureMakerApp.service('searchURLService', function () {
    var url = null;
    var addURL = function (newObj) {
        url = newObj;
    };
    var getURL = function () {
        return url;
    };
    var delURL = function (Obj) {
        // delete Obj;
        return url;
    };
    return {
        addURL: addURL,
        getURL: getURL,
        delURL: delURL,
    };
});
futureMakerApp.service('fileUpload', ['$http', '$location', function ($http, $location) {
        this.uploadFileToUrl = function (file, uploadUrl, $authdata) {
            var fd = new FormData();
            fd.append('file', file);
            $http.defaults.headers.common.Authorization = 'Basic ' + $authdata;
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })

                    .success(function () {
                        alert('success');
                        $location.path('/home');
                    })

                    .error(function () {
                        alert('failed');
                    });
        }
    }]);
futureMakerApp.service('opportunityService', function () {
    var opportunity; //= $cookieStore.get("futuremaker");

    var addOpportunity = function (newObj) {
        opportunity = newObj;
        //$cookies.put("futuremaker", $user);
    };
    var getOpportunity = function () {
        //$user = $cookies.get("futuremaker",$user);
        return opportunity;
    };
    /*var ITDomainfn = function($scope.itDomainsConfig){
     //$scope.itDomain =[];
     
     //$scope.itDomainOptions = [ITDOMAINS.count - 1];
     //$scope.itDomainOptions = ITDOMAINS.ITDomains;
     
     $scope.itDomainsConfig = {
     create: true,
     valueField: 'id',
     labelField: 'name',
     delimiter: '|',
     placeholder: 'Select IT Domains',
     onInitialize: function(selectize){
     // receives the selectize object as an argument
     },
     // maxItems: 1
     }
     return $scope.itDomainsConfig;
     };*/

    return {
        addOpportunity: addOpportunity,
        getOpportunity: getOpportunity,
        //ITDomainfn:ITDomainfn,

    };
});
futureMakerApp.service('searchService', function () {
    var search; //= $cookieStore.get("futuremaker");

    var addSearch = function (newObj) {
        search = newObj;
        //$cookies.put("futuremaker", $user);
    };
    var getSearch = function () {
        //$user = $cookies.get("futuremaker",$user);
        return search;
    };
    return {
        addSearch: addSearch,
        getSearch: getSearch,
    };
});
futureMakerApp.factory('userContactService', function ($filter) {

    var service = {};
    var countrylist = [
        {"id": "India", "country": "India"},
        {"id": "USA", "country": "USA"},
        {"id": "Australia", "country": "Australia"},
        {"id": "Austria", "country": "Austria"},
        {"id": "Belgium", "country": "Belgium"},
        {"id": "Brazil", "country": "Brazil"},
        {"id": "Canada", "country": "Canada"},
        {"id": "Denmark", "country": "Denmark"},
        {"id": "England", "country": "England"},
        {"id": "Finland", "country": "Finland"},
        {"id": "France", "country": "France"},
        {"id": "Germany", "country": "Germany"},
        {"id": "Greece", "country": "Greece"},
        {"id": "Iran", "country": "Iran"},
        {"id": "Ireland", "country": "Ireland"},
        {"id": "Israel", "country": "Israel"},
        {"id": "Italy", "country": "Italy"},
        {"id": "Japan", "country": "Japan"},
        {"id": "Netherlands", "country": "Netherlands"},
        {"id": "Peoples R China", "country": "Peoples R China"},
        {"id": "Poland", "country": "Poland"},
        {"id": "Qatar", "country": "Qatar"},
        {"id": "Russia", "country": "Russia"},
        {"id": "Scotland", "country": "Scotland"},
        {"id": "Singapore", "country": "Singapore"},
        {"id": "South Korea", "country": "South Korea"},
        {"id": "Spain", "country": "Spain"},
        {"id": "Sweden", "country": "Sweden"},
        {"id": "Switzerland", "country": "Switzerland"},
        {"id": "Taiwan", "country": "Taiwan"},
        {"id": "Turkey", "country": "Turkey"},
        {"id": "United Arab Emirates", "country": "United Arab Emirates"},
    ];
    var statelist = [
        {"Id": "Andaman & Nicobar", "state": "Andaman & Nicobar", "countryId": "India"},
        {"Id": "Andhra Pradesh", "state": "Andhra Pradesh", "countryId": "India"},
        {"Id": "Arunachal Pradesh", "state": "Arunachal Pradesh", "countryId": "India"},
        {"Id": "Assam", "state": "Assam", "countryId": "India"},
        {"Id": "Bihar", "state": "Bihar", "countryId": "India"},
        {"Id": "Chandigarh", "state": "Chandigarh", "countryId": "India"},
        {"Id": "Chhattisgarh", "state": "Chhattisgarh", "countryId": "India"},
        {"Id": "Daman & Diu", "state": "Daman & Diu", "countryId": "India"},
        {"Id": "Dadra & Nagar Haveli", "state": "Dadra & Nagar Haveli", "countryId": "India"},
        {"Id": "Delhi", "state": "Delhi", "countryId": "India"},
        {"Id": "Goa", "state": "Goa", "countryId": "India"},
        {"Id": "Gujarat", "state": "Gujarat", "countryId": "India"},
        {"Id": "Haryana", "state": "Haryana", "countryId": "India"},
        {"Id": "Himachal Pradesh", "state": "Himachal Pradesh", "countryId": "India"},
        {"Id": "Jammu & Kashmir", "state": "Jammu & Kashmir", "countryId": "India"},
        {"Id": "Jharkhand", "state": "Jharkhand", "countryId": "India"},
        {"Id": "Karnataka", "state": "Karnataka", "countryId": "India"},
        {"Id": "Kerala", "state": "Kerala", "countryId": "India"},
        {"Id": "Lakshadweep", "state": "Lakshadweep", "countryId": "India"},
        {"Id": "Madhya Pradesh", "state": "Madhya Pradesh", "countryId": "India"},
        {"Id": "Maharashtra", "state": "Maharashtra", "countryId": "India"},
        {"Id": "Manipur", "state": "Manipur", "countryId": "India"},
        {"Id": "Meghalaya", "state": "Meghalaya", "countryId": "India"},
        {"Id": "Mizoram", "state": "Mizoram", "countryId": "India"},
        {"Id": "Nagaland", "state": "Nagaland", "countryId": "India"},
        {"Id": "Orissa", "state": "Orissa", "countryId": "India"},
        {"Id": "Pondicherry", "state": "Pondicherry", "countryId": "India"},
        {"Id": "Punjab", "state": "Punjab", "countryId": "India"},
        {"Id": "Rajasthan", "state": "Rajasthan", "countryId": "India"},
        {"Id": "Sikkim", "state": "Sikkim", "countryId": "India"},
        {"Id": "Tamilnadu", "state": "Tamilnadu", "countryId": "India"},
        {"Id": "Telangana", "state": "Telangana", "countryId": "India"},
        {"Id": "Tripura", "state": "Tripura", "countryId": "India"},
        {"Id": "Uttar Pradesh", "state": "Uttar Pradesh", "countryId": "India"},
        {"Id": "Uttarakhand", "state": "Uttarakhand", "countryId": "India"},
        {"Id": "West Bengal", "state": "West Bengal", "countryId": "India"},
        {"Id": "Alabama AL", "state": "Alabama AL", "countryId": "USA"},
        {"Id": "Alaska AK", "state": "Alaska AK", "countryId": "USA"},
        {"Id": "Arizona AZ", "state": "Arizona AZ", "countryId": "USA"},
        {"Id": "Arkansas AR", "state": "Arkansas AR", "countryId": "USA"},
        {"Id": "California CA", "state": "California CA", "countryId": "USA"},
        {"Id": "Colorado CO", "state": "Colorado CO", "countryId": "USA"},
        {"Id": "Connecticut CT", "state": "Connecticut CT", "countryId": "USA"},
        {"Id": "Delaware DE", "state": "Delaware DE", "countryId": "USA"},
        {"Id": "Florida FL", "state": "Florida FL", "countryId": "USA"},
        {"Id": "Georgia GA", "state": "Georgia GA", "countryId": "USA"},
        {"Id": "Hawaii HI", "state": "Hawaii HI", "countryId": "USA"},
        {"Id": "Idaho ID", "state": "Idaho ID", "countryId": "USA"},
        {"Id": "Illinois IL", "state": "Illinois IL", "countryId": "USA"},
        {"Id": "Indiana IN", "state": "Indiana IN", "countryId": "USA"},
        {"Id": "Iowa IA", "state": "Iowa IA", "countryId": "USA"},
        {"Id": "Kansas KS", "state": "Kansas KS", "countryId": "USA"},
        {"Id": "Kentucky KY", "state": "Kentucky KY", "countryId": "USA"},
        {"Id": "Louisiana LA", "state": "Louisiana LA", "countryId": "USA"},
        {"Id": "Maine ME", "state": "Maine ME", "countryId": "USA"},
        {"Id": "Maryland MD", "state": "Maryland MD", "countryId": "USA"},
        {"Id": "Massachusetts MA", "state": "Massachusetts MA", "countryId": "USA"},
        {"Id": "Michigan MI", "state": "Michigan MI", "countryId": "USA"},
        {"Id": "Minnesota MN", "state": "Minnesota MN", "countryId": "USA"},
        {"Id": "Mississippi MS", "state": "Mississippi MS", "countryId": "USA"},
        {"Id": "Missouri MO", "state": "Missouri MO", "countryId": "USA"},
        {"Id": "Montana MT", "state": "Montana MT", "countryId": "USA"},
        {"Id": "Nebraska NE", "state": "Nebraska NE", "countryId": "USA"},
        {"Id": "Nevada NV", "state": "Nevada NV", "countryId": "USA"},
        {"Id": "New Hampshire NH", "state": "New Hampshire NH", "countryId": "USA"},
        {"Id": "New Jersey NJ", "state": "New Jersey NJ", "countryId": "USA"},
        {"Id": "New Mexico NM", "state": "New Mexico NM", "countryId": "USA"},
        {"Id": "New York NY", "state": "New York NY", "countryId": "USA"},
        {"Id": "North Carolina NC", "state": "North Carolina NC", "countryId": "USA"},
        {"Id": "North Dakota ND", "state": "North Dakota ND", "countryId": "USA"},
        {"Id": "Ohio OH", "state": "Ohio OH", "countryId": "USA"},
        {"Id": "Oklahoma OK", "state": "Oklahoma OK", "countryId": "USA"},
        {"Id": "Oregon OR", "state": "Oregon OR", "countryId": "USA"},
        {"Id": "Pennsylvania PA", "state": "Pennsylvania PA", "countryId": "USA"},
        {"Id": "Rhode Island RI", "state": "Rhode Island RI", "countryId": "USA"},
        {"Id": "South Carolina SC", "state": "South Carolina SC", "countryId": "USA"},
        {"Id": "South Dakota SD", "state": "South Dakota SD", "countryId": "USA"},
        {"Id": "Tennessee TN", "state": "Tennessee TN", "countryId": "USA"},
        {"Id": "Texas TX", "state": "Texas TX", "countryId": "USA"},
        {"Id": "Utah UT", "state": "Utah UT", "countryId": "USA"},
        {"Id": "Vermont VT", "state": "Vermont VT", "countryId": "USA"},
        {"Id": "Virginia VA", "state": "Virginia VA", "countryId": "USA"},
        {"Id": "Washington WA", "state": "Washington WA", "countryId": "USA"},
        {"Id": "West Virginia WV", "state": "West Virginia WV", "countryId": "USA"},
        {"Id": "Wisconsin WI", "state": "Wisconsin WI", "countryId": "USA"},
        {"Id": "Wyoming WY", "state": "Wyoming WY", "countryId": "USA"},
    ];
    /*    var citylist = [
     {"Id":"Bakultala", "city":"Bakultala", "stateId": "Andaman & Nicobar"},
     {"Id":"Bambooflat (Bombooflat)", "city":"Bambooflat (Bombooflat)", "stateId": "Andaman & Nicobar"},
     {"Id":"Garacharma", "city":"Garacharma", "stateId": "Andaman & Nicobar"},
     {"Id":"Port Blair", "city":"Port Blair", "stateId": "Andaman & Nicobar"},
     {"Id":"Prothrapur", "city":"Prothrapur", "stateId": "Andaman & Nicobar"},
     {"Id":"Anantapur", "city":"Anantapur", "stateId": "Andhra Pradesh"},
     {"Id":"Guntūr", "city":"Guntūr", "stateId": "Andhra Pradesh"},
     {"Id":"Hyderābād", "city":"Hyderābād", "stateId": "Andhra Pradesh"},
     {"Id":"Kadapa", "city":"Kadapa", "stateId": "Andhra Pradesh"},
     {"Id":"Kākināda", "city":"Kākināda", "stateId": "Andhra Pradesh"},
     {"Id":"Kurnool", "city":"Kurnool", "stateId": "Andhra Pradesh"},
     {"Id":"Nellore", "city":"Nellore", "stateId": "Andhra Pradesh"}, 
     {"Id":"Rājahmundry", "city":"Rājahmundry", "stateId": "Andhra Pradesh"},
     {"Id":"Tirupati", "city":"Tirupati", "stateId":"Andhra Pradesh"},
     {"Id":"Vijayawāda", "city":"Vijayawāda", "stateId": "Andhra Pradesh"},
     {"Id":"Visākhapatnam", "city":"Visākhapatnam", "stateId": "Andhra Pradesh"},
     {"Id":"Aalo(Along)", "city":"Aalo(Along)", "stateId": "Arunachal Pradesh"},
     {"Id":"Itanagar", "city":"Itanagar", "stateId": "Arunachal Pradesh"},
     {"Id":"Pāsighāt", "city":"Pāsighāt", "stateId": "Arunachal Pradesh"},
     {"Id":"Naharlagun", "city":"Naharlagun", "stateId": "Arunachal Pradesh"},
     {"Id":"Bongaigaon", "city":"Bongaigaon", "stateId": "Assam"},
     {"Id":"Dibrugarh", "city":"Dibrugarh", "stateId":"Assam"},
     {"Id":"Dispu", "city":"Dispu", "stateId": "Assam"},
     {"Id":"Guwāhāti", "city":"Guwāhāti", "stateId": "Assam"},
     {"Id":"Jorhāt", "city":"Jorhāt", "stateId": "Assam"},
     {"Id":"Karīmganj", "city":"Karīmganj", "stateId": "Assam"},
     {"Id":"Nagaon", "city":"Nagaon", "stateId": "Assam"},
     {"Id":"Silchar", "city":"Silchar", "stateId": "Assam"},
     {"Id":"Tinsukia", "city":"Tinsukia", "stateId": "Assam"},
     {"Id":"Tezpur", "city":"Tezpur", "stateId": "Assam"},
     {"Id":"Ara", "city":"Ara", "stateId": "Bihar"},
     {"Id":"Bihār", "city":"Bihār", "stateId": "Bihar"},
     {"Id":"Begusarāi", "city":"Begusarāi", "stateId": "Bihar"},
     {"Id":"Bhāgalpur", "city":"Bhāgalpur", "stateId": "Bihar"},
     {"Id":"Darbhanga", "city":"Darbhanga", "stateId": "Bihar"},
     {"Id":"Gayā", "city":"Gayā", "stateId": "Bihar"},
     {"Id":"Muzaffarpur", "city":"Muzaffarpur", "stateId": "Bihar"},
     {"Id":"Patna", "city":"Patna", "stateId": "Bihar"},
     {"Id":"Pūrnia", "city":"Pūrnia", "stateId": "Bihar"},
     {"Id":"Chandigarh", "city":"Chandigarh", "stateId": "Chandigarh"},
     {"Id":"Ambikāpur", "city":"Ambikāpur", "stateId": "Chhattisgarh"},
     {"Id":"Bhilai", "city":"Bhilai", "stateId": "Chhattisgarh"},
     {"Id":"Bilāspur", "city":"Bilāspur", "stateId": "Chhattisgarh"},
     {"Id":"Dhamtari", "city":"Dhamtari", "stateId": "Chhattisgarh"},
     {"Id":"Jagdalpur", "city":"Jagdalpur", "stateId": "Chhattisgarh"},
     {"Id":"Korba", "city":"Korba", "stateId": "Chhattisgarh"},
     {"Id":"Raipur", "city":"Raipur", "stateId": "Chhattisgarh"},
     {"Id":"Rāj Nāndgaon", "city":"Rāj Nāndgaon", "stateId": "Chhattisgarh"},
     {"Id":"Raigarh", "city":"Raigarh", "stateId": "Daman & Diu"},
     {"Id":"Daman", "city":"Daman", "stateId": "Daman & Diu"},
     {"Id":"Dadhel", "city":"Dadhel", "stateId": "Daman & Diu"},
     {"Id":"Diu", "city":"Diu", "stateId": "Daman & Diu"},
     {"Id":"Kachigam", "city":"Kachigam", "stateId": "Daman & Diu"},
     {"Id":"Dādra", "city":"Dādra", "stateId": "Dadra & Nagar Haveli"},
     {"Id":"Masat", "city":"Masat", "stateId": "Dadra & Nagar Haveli"},
     {"Id":"Naroli", "city":"Naroli", "stateId": "Dadra & Nagar Haveli"},
     {"Id":"Samarvarni", "city":"Samarvarni", "stateId": "Dadra & Nagar Haveli"},
     {"Id":"Silvasa", "city":"Silvasa", "stateId":"Dadra & Nagar Haveli"},
     {"Id":"Jaffarpur Kalan", "city":"Jaffarpur Kalan", "stateId":"Delhi"},
     {"Id":"Qutabgarh", "city":"Qutabgarh", "stateId": "Delhi"},
     {"Id":"Ujwa", "city":"Ujwa", "stateId":"Delhi"},
     {"Id":"Madgaon", "city":"Madgaon", "stateId": "Goa"},
     {"Id":"Mormugao", "city":"Mormugao", "stateId": "Goa"},
     {"Id":"Panaji", "city":"Panaji", "stateId": "Goa"},
     {"Id":"Ahmadābād", "city":"Ahmadābād", "stateId": "Gujarat"},
     {"Id":"Ānand", "city":"Ānand", "stateId":"Gujarat"},
     {"Id":"Bhāvnagar", "city":"Bhāvnagar", "stateId": "Gujarat"},
     {"Id":"Gandhinagar", "city":"Gandhinagar", "stateId":"Gujarat"},
     {"Id":"Jāmnagar", "city":"Jāmnagar", "stateId": "Gujarat"},
     {"Id":"Jūnāgadh", "city":"Jūnāgadh", "stateId": "Gujarat"},
     {"Id":"Morbi", "city":"Morbi", "stateId": "Gujarat"},
     {"Id":"Navsāri", "city":"Navsāri", "stateId": "Gujarat"},
     {"Id":"Rājkot", "city":"Rājkot", "stateId": "Gujarat"},
     {"Id":"Sūrat", "city":"Sūrat", "stateId": "Gujarat"},
     {"Id":"Surendranagar", "city":"Surendranagar", "stateId":"Gujarat"},
     {"Id":"Vadodara", "city":"Vadodara", "stateId": "Gujarat"},
     {"Id":"Ambāla Sadar", "city":"Ambāla Sadar", "stateId": "Haryana"},
     {"Id":"Chandigarh", "city":"Chandigarh", "stateId": "Haryana"},
     {"Id":"Farīdābād", "city":"Farīdābād", "stateId": "Haryana"},
     {"Id":"Gurgaon", "city":"Gurgaon", "stateId": "Haryana"},
     {"Id":"Hisār", "city":"Hisār", "stateId": "Haryana"},
     {"Id":"Karnāl", "city":"Karnāl", "stateId": "Haryana"},
     {"Id":"Pānīpat", "city":"Pānīpat", "stateId": "Haryana"},
     {"Id":"Panchkula", "city":"Panchkula", "stateId": "Haryana"},
     {"Id":"Rohtak", "city":"Rohtak", "stateId": "Haryana"},
     {"Id":"Sonīpat", "city":"Sonīpat", "stateId": "Haryana"},
     {"Id":"Yamunānagar", "city":"Yamunānagar", "stateId": "Haryana"},
     {"Id":"Baddi", "city":"Baddi", "stateId": "Himachal Pradesh"},
     {"Id":"Chamba", "city":"Chamba", "stateId": "Himachal Pradesh"},
     {"Id":"Dharamsala", "city":"Dharamsala", "stateId": "Himachal Pradesh"},
     {"Id":"Kullu", "city":"Kullu", "stateId":"Himachal Pradesh"},
     {"Id":"Mandi", "city":"Mandi", "stateId": "Himachal Pradesh"},
     {"Id":"Nāhan", "city":"Nāhan", "stateId": "Himachal Pradesh"},
     {"Id":"Pāonta Sāhib", "city":"Pāonta Sāhib", "stateId": "Himachal Pradesh"},
     {"Id":"Shimla", "city":"Shimla", "stateId": "Himachal Pradesh"},
     {"Id":"Solan", "city":"Solan", "stateId": "Himachal Pradesh"},
     {"Id":"Sundarnagar", "city":"Sundarnagar", "stateId": "Himachal Pradesh"},
     {"Id":"Anantnāg", "city":"Anantnāg", "stateId": "Jammu & Kashmir"},
     {"Id":"Bandipura", "city":"Bandipura", "stateId": "Jammu & Kashmir"},
     {"Id":"Bāramūla", "city":"Bāramūla", "stateId": "Jammu & Kashmir"},
     {"Id":"Jammu", "city":"Jammu", "stateId": "Jammu & Kashmir"},
     {"Id":"Kathua", "city":"Kathua", "stateId": "Jammu & Kashmir"},
     {"Id":"Leh", "city":"Leh", "stateId": "Jammu & Kashmir"},
     {"Id":"Srīnagar", "city":"Srīnagar", "stateId": "Jammu & Kashmir"},
     {"Id":"Sopore", "city":"Sopore", "stateId": "Jammu & Kashmir"},
     {"Id":"Udhampur", "city":"Udhampur", "stateId": "Jammu & Kashmir"},
     {"Id":"Bokāro Steel City", "city":"Bokāro Steel City", "stateId": "Jharkhand"},
     {"Id":"Chirkunda", "city":"Chirkunda", "stateId": "Jharkhand"},
     {"Id":"Dhanbād", "city":"Dhanbād", "stateId": "Jharkhand"},
     {"Id":"Deoghar", "city":"Deoghar", "stateId":"Jharkhand"},
     {"Id":"Girīdīh", "city":"Girīdīh", "stateId": "Jharkhand"},
     {"Id":"Hazārībāg", "city":"Hazārībāg", "stateId":"Jharkhand"},
     {"Id":"Jamshedpur", "city":"Jamshedpur", "stateId": "Jharkhand"},
     {"Id":"Medininagar", "city":"Medininagar", "stateId": "Jharkhand"},
     {"Id":"Phusro", "city":"Phusro", "stateId": "Jharkhand"},
     {"Id":"Ramgarh Cantonment", "city":"Ramgarh Cantonment", "stateId": "Jharkhand"},
     {"Id":"Ranchi", "city":"Ranchi", "stateId": "Jharkhand"},
     {"Id":"Bangaluru", "city":"Bangaluru", "stateId": "Karnataka"},
     {"Id":"Bellary", "city":"Bellary", "stateId": "Karnataka"},
     {"Id":"Bijāpur", "city":"Bijāpur", "stateId": "Karnataka"},
     {"Id":"Belgaum", "city":"Belgaum", "stateId": "Karnataka"},
     {"Id":"Dāvanagere", "city":"Dāvanagere", "stateId": "Karnataka"},
     {"Id":"Hubli-Dhārwār", "city":"Hubli-Dhārwār", "stateId": "Karnataka"},
     {"Id":"Gulbarga", "city":"Gulbarga", "stateId": "Karnataka"},
     {"Id":"Mysore", "city":"Mysore", "stateId": "Karnataka"},
     {"Id":"Mangalore", "city":"Mangalore", "stateId": "Karnataka"},
     {"Id":"Shimoga", "city":"Shimoga", "stateId": "Karnataka"},
     {"Id":"Tumkūr", "city":"Tumkūr", "stateId": "Karnataka"},
     {"Id":"Cherthala", "city":"Cherthala", "stateId": "Kerala"},
     {"Id":"Kochi", "city":"Kochi", "stateId": "Kerala"},
     {"Id":"Kozhikode", "city":"Kozhikode", "stateId": "Kerala"},
     {"Id":"Kannur", "city":"Kannur", "stateId": "Kerala"},
     {"Id":"Kollam", "city":"Kollam", "stateId": "Kerala"},
     {"Id":"Kāyamkulam", "city":"Kāyamkulam", "stateId": "Kerala"},
     {"Id":"Kottayam", "city":"Kottayam", "stateId": "Kerala"},
     {"Id":"Malappuram", "city":"Malappuram", "stateId": "Kerala"},
     {"Id":"Thrissur", "city":"Thrissur", "stateId": "Kerala"},
     {"Id":"Thiruvananthapuram", "city":"Thiruvananthapuram", "stateId": "Kerala"},
     {"Id":"Amini", "city":"Amini", "stateId": "Lakshadweep"},
     {"Id":"Andrott", "city":"Andrott", "stateId":"Lakshadweep"},
     {"Id":"Kavaratti", "city":"Kavaratti", "stateId": "Lakshadweep"},
     {"Id":"Minico", "city":"Minico", "stateId": "Lakshadweep"},
     {"Id":"Bhopal", "city":"Bhopal", "stateId":"Madhya Pradesh"},
     {"Id":"Dewās", "city":"Dewās", "stateId": "Madhya Pradesh"},
     {"Id":"Gwalior", "city":"Gwalior", "stateId": "Madhya Pradesh"},
     {"Id":"Indore", "city":"Indore", "stateId": "Madhya Pradesh"},
     {"Id":"Jabalpur", "city":"Jabalpur", "stateId": "Madhya Pradesh"},
     {"Id":"Ratlām", "city":"Ratlām", "stateId": "Madhya Pradesh"},
     {"Id":"Rewa", "city":"Rewa", "stateId": "Madhya Pradesh"},
     {"Id":"Sāgar", "city":"Sāgar", "stateId": "Madhya Pradesh"},
     {"Id":"Satna", "city":"Satna", "stateId": "Madhya Pradesh"},
     {"Id":"Ujjain", "city":"Ujjain", "stateId": "Madhya Pradesh"},
     {"Id":"Amrāvati", "city":"Amrāvati", "stateId": "Maharashtra"},
     {"Id":"Aurangābād", "city":"Aurangābād", "stateId": "Maharashtra"},
     {"Id":"Bhiwandi", "city":"Bhiwandi", "stateId": "Maharashtra"},
     {"Id":"Mumbai", "city":"Mumbai", "stateId": "Maharashtra"},
     {"Id":"Nāgpur", "city":"Nāgpur", "stateId": "Maharashtra"},
     {"Id":"Nāshik", "city":"Nāshik", "stateId": "Maharashtra"},
     {"Id":"Pune", "city":"Pune", "stateId": "Maharashtra"},
     {"Id":"Solāpur", "city":"Solāpur", "stateId": "Maharashtra"},
     {"Id":"Vāsai-Virār", "city":"Vāsai-Virār", "stateId": "Maharashtra"},
     {"Id":"Imphal", "city":"Imphal", "stateId": "Manipur"},
     {"Id":"Kakching", "city":"Kakching", "stateId": "Manipur"},
     {"Id":"Mayāng Imphāl", "city":"Mayāng Imphāl", "stateId": "Manipur"},
     {"Id":"Thoubāl", "city":"Thoubāl", "stateId": "Manipur"},
     {"Id":"Ukhrul", "city":"Ukhrul", "stateId": "Manipur"},
     {"Id":"Jowai", "city":"Jowai", "stateId": "Meghalaya"},
     {"Id":"Nongstoin", "city":"Nongstoin", "stateId": "Meghalaya"},
     {"Id":"Shillong", "city":"Shillong", "stateId": "Meghalaya"},
     {"Id":"Tura", "city":"Tura", "stateId": "Meghalaya"},
     {"Id":"Williamnagar", "city":"Williamnagar", "stateId": "Meghalaya"},
     {"Id":"Aizawl", "city":"Aizawl", "stateId": "Mizoram"},
     {"Id":"Champhai", "city":"Champhai", "stateId": "Mizoram"},
     {"Id":"Kolosib (Kolasib)", "city":"Kolosib (Kolasib)", "stateId": "Mizoram"},
     {"Id":"Lawngtlai", "city":"Lawngtlai", "stateId": "Mizoram"},
     {"Id":"Lunglei", "city":"Lunglei", "stateId": "Mizoram"},
     {"Id":"Saiha", "city":"Saiha", "stateId": "Mizoram"},
     {"Id":"Serchhīp", "city":"Serchhīp", "stateId": "Mizoram"},
     {"Id":"Chumukedima", "city":"Chumukedima", "stateId": "Nagaland"},
     {"Id":"Dimāpur", "city":"Dimāpur", "stateId": "Nagaland"},
     {"Id":"Kohima", "city":"Kohima", "stateId":"Nagaland"},
     {"Id":"Mokokchūng","city":"Mokokchūng", "stateId": "Nagaland"},
     {"Id":"Mon", "city":"Mon", "stateId": "Nagaland"},
     {"Id":"Tuensang", "city":"Tuensang", "stateId": "Nagaland"},
     {"Id":"Wokha", "city":"Wokha", "stateId": "Nagaland"},
     {"Id":"Zunheboto", "city":"Zunheboto", "stateId": "Nagaland"},
     {"Id":"Brahmapur", "city":"Brahmapur", "stateId": "Orissa"},
     {"Id":"Bāleshwar", "city":"Bāleshwar", "stateId": "Orissa"},
     {"Id":"Bhadrak", "city":"Bhadrak", "stateId": "Orissa"},
     {"Id":"Bāripada", "city":"Bāripada", "stateId": "Orissa"},
     {"Id":"Bhubaneswar", "city":"Bhubaneswar", "stateId": "Orissa"},
     {"Id":"Cuttack", "city":"Cuttack", "stateId": "Orissa"},
     {"Id":"Puri", "city":"Puri", "stateId": "Orissa"},
     {"Id":"Raurkela", "city":"Raurkela", "stateId": "Orissa"},
     {"Id":"Sambalpur", "city":"Sambalpur", "stateId": "Orissa"},
     {"Id":" Puducherry", "city":"Puducherry", "stateId":"Pondicherry"},
     {"Id":"Kāraikāl (Karikal)", "city":"Kāraikāl (Karikal)", "stateId": "Pondicherry"},
     {"Id":"Mahe (Mahé)", "city":"Mahe (Mahé)", "stateId": "Pondicherry"},
     {"Id":"Yanam (Yanaon)", "city":"Yanam (Yanaon)", "stateId":"Pondicherry"},
     {"Id":"Amritsar", "city":"Amritsar", "stateId":"Punjab"},
     {"Id":"Batāla", "city":"Batāla", "stateId": "Punjab"},
     {"Id":"Bathinda", "city":"Bathinda", "stateId": "Punjab"},
     {"Id":"Chandigarh", "city":"Chandigarh", "stateId": "Punjab"},
     {"Id":"Hoshiārpur", "city":"Hoshiārpur", "stateId": "Punjab"},
     {"Id":"Jalandhar", "city":"Jalandhar", "stateId": "Punjab"},
     {"Id":"Ludhiāna", "city":"Ludhiāna", "stateId": "Punjab"},
     {"Id":"Moga", "city":"Moga", "stateId": "Punjab"},
     {"Id":"Patiāla", "city":"Patiāla", "stateId": "Punjab"},
     {"Id":"Pathānkot", "city":"Pathānkot", "stateId": "Punjab"},
     {"Id":"S.A.S. Nagar", "city":"S.A.S. Nagar", "stateId": "Punjab"},
     {"Id":"Ajmer", "city":"Ajmer", "stateId": "Rajasthan"},
     {"Id":"Alwar", "city":"Alwar", "stateId": "Rajasthan"},
     {"Id":"Bhīlwāra", "city":"Bhīlwāra", "stateId": "Rajasthan"},
     {"Id":"Bharatpur", "city":"Bharatpur", "stateId": "Rajasthan"},
     {"Id":"Bīkāner", "city":"Bīkāner", "stateId": "Rajasthan"},
     {"Id":"Jaipur", "city":"Jaipur", "stateId": "Rajasthan"},
     {"Id":"Jodhpur", "city":"Jodhpur", "stateId": "Rajasthan"},
     {"Id":"Kotā", "city":"Kotā", "stateId": "Rajasthan"},
     {"Id":"Udaipur", "city":"Udaipur", "stateId": "Rajasthan"},
     {"Id":"Gangtok", "city":"Gangtok", "stateId": "Sikkim"},
     {"Id":"Jorethang", "city":"Jorethang", "stateId": "Sikkim"},
     {"Id":"Namchi", "city":"Namchi", "stateId": "Sikkim"},
     {"Id":"Rangpo", "city":"Rangpo", "stateId": "Sikkim"},
     {"Id":"Chennai", "city":"Chennai", "stateId": "Tamilnadu"},
     {"Id":"Coimbatore", "city":"Coimbatore", "stateId": "Tamilnadu"},
     {"Id":"Erode", "city":"Erode", "stateId": "Tamilnadu"},
     {"Id":"Madurai", "city":"Madurai", "stateId": "Tamilnadu"},
     {"Id":"Salem", "city":"Salem", "stateId": "Tamilnadu"},
     {"Id":"Tiruchirāppalli", "city":"Tiruchirāppalli", "stateId":"Tamilnadu"},
     {"Id":"Tiruppūr", "city":"Tiruppūr", "stateId": "Tamilnadu"},
     {"Id":"Tirunelveli", "city":"Tirunelveli", "stateId": "Tamilnadu"},
     {"Id":"Thoothukkudi", "city":"Thoothukkudi", "stateId": "Tamilnadu"},
     {"Id":"Vellore", "city":"Vellore", "stateId": "Tamilnadu"},
     {"Id":"Ādilābād", "city":"Ādilābād", "stateId": "Telangana"},
     {"Id":"Hyderābād", "city":"Hyderābād", "stateId": "Telangana"},
     {"Id":"Karīmnagar", "city":"Karīmnagar", "stateId": "Telangana"},
     {"Id":"Khammam", "city":"Khammam", "stateId": "Telangana"},
     {"Id":"Mancherial", "city":"Mancherial", "stateId": "Telangana"},
     {"Id":"Mahbūbnagar", "city":"Mahbūbnagar", "stateId": "Telangana"},
     {"Id":"Nalgonda", "city":"Nalgonda", "stateId": "Telangana"},
     {"Id":"Nizāmābād", "city":"Nizāmābād", "stateId": "Telangana"},
     {"Id":"Rāmagundam", "city":"Rāmagundam", "stateId": "Telangana"},
     {"Id":"Warangal", "city":"Warangal", "stateId": "Telangana"},
     {"Id":"Agartala", "city":"Agartala", "stateId": "Tripura"},
     {"Id":"Belonia", "city":"Belonia", "stateId": "Tripura"},
     {"Id":"Bishalgarh", "city":"Bishalgarh", "stateId": "Tripura"},
     {"Id":"Dharmanagar", "city":"Dharmanagar", "stateId": "Tripura"},
     {"Id":"Kailāshahar", "city":"Kailāshahar", "stateId": "Tripura"},
     {"Id":"Teliamura", "city":"Teliamura", "stateId": "Tripura"},
     {"Id":"Udaipur", "city":"Udaipur", "stateId": "Tripura"},
     {"Id":"Āgra", "city":"Āgra", "stateId": "Uttar Pradesh"},
     {"Id":"Allahābād", "city":"Allahābād", "stateId": "Uttar Pradesh"},
     {"Id":"Alīgarh", "city":"Alīgarh", "stateId": "Uttar Pradesh"},
     {"Id":"Bareilly", "city":"Bareilly", "stateId": "Uttar Pradesh"},
     {"Id":"Ghāziābād", "city":"Ghāziābād", "stateId": "Uttar Pradesh"},
     {"Id":"Kānpur", "city":"Kānpur", "stateId": "Uttar Pradesh"},
     {"Id":"Lucknow", "city":"Lucknow", "stateId": "Uttar Pradesh"},
     {"Id":"Meerut", "city":"Meerut", "stateId": "Uttar Pradesh"},
     {"Id":"Morādābād", "city":"Morādābād", "stateId": "Uttar Pradesh"},
     {"Id":"Vārānasi", "city":"Vārānasi", "stateId": "Uttar Pradesh"},
     {"Id":"Dehradun", "city":"Dehradun", "stateId": "Uttarakhand"},
     {"Id":"Hardwār", "city":"Hardwār", "stateId": "Uttarakhand"},
     {"Id":"Haldwāni", "city":"Haldwāni", "stateId": "Uttarakhand"},
     {"Id":"Jaspur", "city":"Jaspur", "stateId": "Uttarakhand"},
     {"Id":"Kichha", "city":"Kichha", "stateId": "Uttarakhand"},
     {"Id":"Kāshīpur", "city":"Kāshīpur", "stateId":"Uttarakhand"},
     {"Id":"Manglaur", "city":"Manglaur", "stateId": "Uttarakhand"},
     {"Id":"Pithorāgarh","city":"Pithorāgarh", "stateId": "Uttarakhand"},
     {"Id":"Roorkee", "city":"Roorkee", "stateId": "Uttarakhand"},
     {"Id":"Rudrapur", "city":"Rudrapur", "stateId": "Uttarakhand"},
     {"Id":"Rishīkesh", "city":"Rishīkesh", "stateId": "Uttarakhand"},
     {"Id":"Rāmnagar", "city":"Rāmnagar", "stateId": "Uttarakhand"},
     {"Id":"Āsansol", "city":"Āsansol", "stateId": "West Bengal"},
     {"Id":"Bardhamān", "city":"Bardhamān", "stateId":"West Bengal"},
     {"Id":"Baharampur", "city":"Baharampur", "stateId": "West Bengal"},
     {"Id":"Durgāpur", "city":"Durgāpur", "stateId": "West Bengal"},
     {"Id":"Hābra", "city":"Hābra", "stateId": "West Bengal"},
     {"Id":"Ingrāj Bāzār", "city":"Ingrāj Bāzār", "stateId": "West Bengal"},
     {"Id":"Kolkata", "city":"Kolkata", "stateId":"West Bengal"},
     {"Id":"Kharagpur", "city":"Kharagpur", "stateId": "West Bengal"},
     {"Id":"Shiliguri", "city":"Shiliguri", "stateId": "West Bengal"},
     {"Id":"Sāntipur", "city":"Sāntipur", "stateId": "West Bengal"},
     
     ];
     */
    service.getCountry = function () {
        return countrylist;
    };
    service.getCountryState = function (countryId) {
        var states = ($filter('filter')(statelist, {countryId: countryId}));
        return states;
    };
    /*    service.getStateCity = function(stateId){
     var items = ($filter('filter')(citylist, {stateId: stateId}));      
     return items;
     };
     */
    return service;
});
function PagerService() {
    // service definition
    var service = {};
    service.GetPager = GetPager;
    return service;
    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;
        // default page size is 10
        pageSize = pageSize || 10;
        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);
        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}
futureMakerApp.service('userService', function ($cookieStore) {
    var user = $cookieStore.get("futuremaker");
    var addUser = function (newObj) {
        user = newObj;
        //$cookies.put("futuremaker", $user);
    };
    var getUser = function () {
        //$user = $cookies.get("futuremaker",$user);
        return user;
    };
    return {
        addUser: addUser,
        getUser: getUser,
    };
});
futureMakerApp.constant('CONSTANTS', (function () {
    // Define your variable
    var CONSTANTS = {};
    var SERVICES = {
        BASE_PATH: 'http://ec2-52-74-20-101.ap-southeast-1.compute.amazonaws.com/api/fm/v0/' //'http://localhost:8080/api/fm/v0/' 'http://ec2-52-74-20-101.ap-southeast-1.compute.amazonaws.com/api/fm/v0/' 
    };
    SERVICES.USERS = SERVICES.BASE_PATH + 'users';
    SERVICES.VERACC = SERVICES.BASE_PATH + 'users/verify/';
    SERVICES.GETPROFILE = SERVICES.BASE_PATH + 'users/';
    SERVICES.RESETPASS = SERVICES.BASE_PATH + 'mail/reset/';
    SERVICES.FORGETPASS = SERVICES.BASE_PATH + 'mail/forget/';
    SERVICES.USERSCHECK = SERVICES.BASE_PATH + 'users/' + 'check'; //API for unique username
    SERVICES.STUDENTS = SERVICES.BASE_PATH + 'students'; //API for student sign up form
    SERVICES.COLLEGES = SERVICES.BASE_PATH + 'colleges'; //API for institute signup form
    SERVICES.MENTORS = SERVICES.BASE_PATH + 'mentors'; //API for mentor sign up form
    SERVICES.ORGANIZATIONS = SERVICES.BASE_PATH + 'organizations'; //API for organization signup form
    SERVICES.OPPORTUNITIES = SERVICES.BASE_PATH + 'orgOpportunities'; //API for organization post opportunity
    SERVICES.OPPORTUNITIES1 = SERVICES.BASE_PATH + 'collegeOpportunities'; //API for institute post opportunity
    SERVICES.OPPORTUNITIES2 = SERVICES.BASE_PATH + 'mentorOpportunities'; //API for mentor post opportunity
    SERVICES.GETCANDID = SERVICES.BASE_PATH + 'applyOpportunity/getAppliedCandidates/'; //API for mentor post opportunity
    SERVICES.OPPORTUNITIES3 = SERVICES.BASE_PATH + 'studentOpportunities'; //API for student post opportunity
    SERVICES.TEMPLATES = SERVICES.BASE_PATH + 'templates'; //API for email templates
    SERVICES.SEARCHES = SERVICES.BASE_PATH + 'search/student'; //API for student search
    SERVICES.SEARCHES1 = SERVICES.BASE_PATH + 'search/mentor'; //API for mentor search
    SERVICES.SEARCHESORG = SERVICES.BASE_PATH + 'search/organization'; //API for mentor search
    SERVICES.SEARCHES2 = SERVICES.BASE_PATH + 'search/institute'; //API for institute search
    SERVICES.SEARCHES3 = SERVICES.BASE_PATH + 'opportunitySearch/event'; //API for event search
    SERVICES.GUESTSEARCH = SERVICES.BASE_PATH + 'opportunitySearch/guest'; //API for event search
    SERVICES.JOBSEARCH = SERVICES.BASE_PATH + 'opportunitySearch/generalFields'; //API for event search
    SERVICES.MENTORSHIPSEARCH = SERVICES.BASE_PATH + 'opportunitySearch/mentorType'; //API for event search
    SERVICES.MENTEESHIPSEARCH = SERVICES.BASE_PATH + 'opportunitySearch/mentee'; //API for event search
    SERVICES.FOLDERS = SERVICES.BASE_PATH + 'folders'; //API for saving folders

    SERVICES.SAVESEARCH = SERVICES.BASE_PATH + 'savedSearch'; //API for saving folders
    SERVICES.APPLIEDOPP = SERVICES.BASE_PATH + 'getAppliedJobs'; //API for saving folders
    SERVICES.JOBAPPLY = SERVICES.BASE_PATH + 'applyOpportunity/'; //API for saving folders
    SERVICES.UPLOADRESUME = SERVICES.BASE_PATH + 'resume'; //API for saving folders
    CONSTANTS.SERVICES = SERVICES;
    // Use the variable in your constants
    return CONSTANTS;
})());
futureMakerApp.constant('KEYSKILLS', {
    count: 4,
    keyskills: [
        {"id": "Angular js", "data": "Angular js"},
        {"id": "Java", "data": "Java"},
        {"id": "Java Script", "data": "Java Script"},
        {"id": "Mongo DB", "data": "Mongo DB"},
    ]
});
futureMakerApp.constant('LOCATIONS', {
    count: 6,
    location: [
        {id: 1, name: 'Bangalore'},
        {id: 2, name: 'Pune'},
        {id: 3, name: 'Chennai'},
        {id: 4, name: 'Hyderabad'},
        {id: 5, name: 'Mumbai'},
        {id: 6, name: 'Gurgaon'}
    ]
});
futureMakerApp.constant('ITDOMAINS', {
    count: 17,
    ITDomains: [
        {id: 1, name: 'Automobile'},
        {id: 2, name: 'Banking'},
        {id: 3, name: 'Education'},
        {id: 4, name: 'Energy'},
        {id: 5, name: 'Entertainment'},
        {id: 6, name: 'Financial'},
        {id: 7, name: 'Healthcare'},
        {id: 8, name: 'Life Sciences'},
        {id: 9, name: 'Media & Information Services'},
        {id: 10, name: 'MultiMedia'},
        {id: 11, name: 'Networking'},
        {id: 12, name: 'Real Estate'},
        {id: 13, name: 'Retail & Consumer Products'},
        {id: 14, name: 'Security'},
        {id: 15, name: 'Telecom'},
        {id: 16, name: 'Travel,Transportation & Hospitality'},
        {id: 17, name: 'Others'}
    ]
});
futureMakerApp.constant('NONITDOMAINS', {
    count: 39,
    NonITDomains: [
        {id: 1, name: 'Aerospace'},
        {id: 2, name: 'Architectural'},
        {id: 3, name: 'Automation'},
        {id: 4, name: 'Automobile'},
        {id: 5, name: 'Banking & Financial Services'},
        {id: 6, name: 'Chemical'},
        {id: 7, name: 'Clinical research'},
        {id: 8, name: 'Computer'},
        {id: 9, name: 'Construction'},
        {id: 10, name: 'Consulting services'},
        {id: 11, name: 'Consumer packaged Goods'},
        {id: 12, name: 'Education'},
        {id: 13, name: 'Electronic'},
        {id: 14, name: 'Energy - Oil & Gas, Oil Field Services and renewables'},
        {id: 15, name: 'Engg. Service provider'},
        {id: 16, name: 'Entertainment, animation, gaming'},
        {id: 17, name: 'Event management'},
        {id: 18, name: 'Food'},
        {id: 19, name: 'Government, Defense'},
        {id: 20, name: 'Healthcare'},
        {id: 21, name: 'High Tech'},
        {id: 22, name: 'Information technology'},
        {id: 23, name: 'Insurance'},
        {id: 24, name: 'IT enabled services'},
        {id: 25, name: 'Life Sciences'},
        {id: 26, name: 'Manufacturing'},
        {id: 27, name: 'Marine'},
        {id: 28, name: 'Materials & Metals'},
        {id: 29, name: 'Media & information services'},
        {id: 30, name: 'Pharmaceuticals'},
        {id: 31, name: 'Rail'},
        {id: 32, name: 'Real estate'},
        {id: 33, name: 'Research foundation'},
        {id: 34, name: 'Resources- Metals, Mining & Construction'},
        {id: 35, name: 'Retail'},
        {id: 36, name: 'Telecom'},
        {id: 37, name: 'Travel, Transportation & Hospitality'},
        {id: 38, name: 'Utilities'},
        {id: 39, name: 'Others'}

    ]
});
futureMakerApp.constant('MAJORS', {
    count: 17,
    majors: [
        {id: 1, name: 'Automobile'},
        {id: 2, name: 'Banking'},
        {id: 3, name: 'Education'},
        {id: 4, name: 'Engineering'},
        {id: 5, name: 'Entertainment'},
        {id: 6, name: 'Financial'},
        {id: 7, name: 'Healthcare'},
        {id: 8, name: 'Life Sciences'},
        {id: 9, name: 'Media & Information Services'},
        {id: 10, name: 'MultiMedia'},
        {id: 11, name: 'Networking'},
        {id: 12, name: 'Real Estate'},
        {id: 13, name: 'Retail & Consumer Products'},
        {id: 14, name: 'Security'},
        {id: 15, name: 'Telecom'},
        {id: 16, name: 'Travel,Transportation & Hospitality'},
        {id: 17, name: 'Others'}
    ]
});
futureMakerApp.constant('COURSES', {
    count: 6,
    courses: [
        {id: 1, name: 'B.E./B.Tech.'},
        {id: 2, name: 'Diploma'},
        {id: 3, name: 'M.E./M.Tech'},
        {id: 4, name: 'B.D.S.'},
        {id: 5, name: 'B.Pharm'},
        {id: 6, name: 'B.B.A.'}
    ]
});
/*futureMakerApp.constant('YOPASSING', {
 count: 6,
 yop:[
 { id: 1, name: 2017 },
 { id: 2, name: 2016 },
 { id: 3, name: 2015 },
 { id: 4, name: 2014 },
 { id: 5, name: 2013 },
 { id: 6, name: 2012 },
 { id: 6, name: 2012 },
 { id: 6, name: 2012 },
 { id: 6, name: 2012 },
 { id: 6, name: 2012 },
 { id: 6, name: 2012 },
 { id: 6, name: 2012 },
 ]
 });*/

futureMakerApp.constant('FUNCTIONALINTEREST', {
    count: 18,
    functionalInterest: [
        {id: 1, name: 'Automation testing'},
        {id: 2, name: 'Customer Support'},
        {id: 3, name: 'Development'},
        {id: 4, name: 'Devops'},
        {id: 5, name: 'Functional consultant'},
        {id: 6, name: 'Human Resources'},
        {id: 7, name: 'Maintenance'},
        {id: 8, name: 'Manual testing'},
        {id: 9, name: 'Pre-Sales'},
        {id: 10, name: 'Product management'},
        {id: 11, name: 'Program Management'},
        {id: 12, name: 'Project Management'},
        {id: 13, name: 'Software architecture & design'},
        {id: 14, name: 'Solution deployment'},
        {id: 15, name: 'System Admin'},
        {id: 16, name: 'System Analyst'},
        {id: 17, name: 'Technical Consultant'},
        {id: 18, name: 'Technical Management'},
    ]
});
futureMakerApp.constant('STREAMS', {
    count: 39,
    streams: [
        {id: 1, name: 'Automobile Engineering'},
        {id: 2, name: 'Applied Electronics and Instrumentation Engineering'},
        {id: 3, name: 'Agricultural Engineering'},
        {id: 4, name: 'Aeronautical Engineering'},
        {id: 5, name: 'Bio Technology'},
        {id: 6, name: 'Biochemical Engineering'},
        {id: 7, name: 'Civil Engineering'},
        {id: 8, name: 'Chemical and Alcohol Technology'},
        {id: 9, name: 'Computer Science & Engineering'},
        {id: 10, name: 'Chemical Engineering'},
        {id: 11, name: 'Electronics & Instrumentation Engineering'},
        {id: 12, name: 'Electronics & Telecomm Engineering'},
        {id: 13, name: 'Electronics Engineering'},
        {id: 14, name: 'Electronics Instrumentation & Control'},
        {id: 15, name: 'Electrical & Electronics Engineering'},
        {id: 16, name: 'Electrical Engineering'},
        {id: 17, name: 'Electronics & Communication Engineering'},
        {id: 18, name: 'Environmental Engineering'},
        {id: 19, name: 'Industrial Production Engineering'},
        {id: 20, name: 'Instrumentation & Control'},
        {id: 21, name: 'Industrial Engineering'},
        {id: 22, name: 'Instrumentation Engineering'},
        {id: 23, name: 'Information Technology'},
        {id: 24, name: 'Food Technology'},
        {id: 25, name: 'Leather Technology'},
        {id: 26, name: 'Mechanical Engineering'},
        {id: 28, name: 'Marine Engineering'},
        {id: 29, name: 'Material Science'},
        {id: 30, name: 'Mechanical & Industrial Engineering'},
        {id: 31, name: 'Metallurgical Engineering'},
        {id: 32, name: 'Man Made Fibre Technology'},
        {id: 33, name: 'Manufacturing Technology'},
        {id: 34, name: 'Oil Technology'},
        {id: 35, name: 'Production Engineering'},
        {id: 36, name: 'Production & Industrial Engineering'},
        {id: 37, name: 'Plastic Technology'},
        {id: 38, name: 'Textile Engineering'},
        {id: 39, name: 'Textile Technology'}
    ]
});
futureMakerApp.constant('INTERESTS', {
    count: 5,
    interests: [
        {id: 1, name: 'Placement'},
        {id: 2, name: 'Internship'},
        {id: 3, name: 'Research Project'},
        {id: 4, name: 'Innovation Sponsorship'},
        {id: 5, name: 'Guest Speaker'}
    ]
});
/*$scope.keySkills = [];
 
 $scope.skillOptions = [KEYSKILLS.count - 1];
 $scope.skillOptions = KEYSKILLS.keyskills;
 
 $scope.skillConfig = {
 create: true,
 valueField: 'id',
 labelField: 'data',
 delimiter: '|',
 placeholder: 'Add Skills',
 onInitialize: function (selectize) {
 // receives the selectize object as an argument
 }
 }; */
(function () {
    'use strict';
    // attach utilities as a property of window
    var utilities = window.utilities || (window.utilities = {});
    // BEGIN API
    function helloWorld() {
        alert('hello world!');
    }

    function utilityMethod1() {
        alert('Utility Method 1');
    }

    function utilityMethod2() {
        alert('Utility Method 2');
    }

    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = Base64._utf8_encode(input);
            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }
    };
    // END API

    // publish external API by extending myLibrary
    function publishExternalAPI(utilities) {
        angular.extend(utilities, {
            'Base64': Base64,
            'helloWorld': helloWorld,
            'utilityMethod1': utilityMethod1,
            'utilityMethod2': utilityMethod2
        });
    }

    publishExternalAPI(utilities);
})(window, document);
