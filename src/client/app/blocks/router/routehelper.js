(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routehelperConfig', routehelperConfig)
        .factory('routehelper', routehelper);

    // Must configure via the routehelperConfigProvider
    function routehelperConfig() {
        /* jshint validthis:true */
        this.config = {
            // These are the properties we need to set
            // $routeProvider: undefined
            // docTitle: ''
            // resolveAlways: {ready: function(){ } }
        };

        this.$get = function() {
            return {
                config: this.config
            };
        };
    }


    // routehelper.$inject = ['$location', '$rootScope', '$state', 'logger', 'routehelperConfig'];

    /* @ngInject */
    function routehelper($location, $rootScope, $state, logger, routehelperConfig) {
        var handlingRouteChangeError = false;
        var stateCounts = {
            errors: 0,
            changes: 0
        };
        var navRoutes = [];
        var $stateProvider = routehelperConfig.config.$stateProvider;
        var $urlRouterProvider = routehelperConfig.config.$urlRouterProvider;

        var service = {
            configureRoutes: configureRoutes,
            getNavRoutes: getNavRoutes,
            stateCounts: stateCounts
        };

        init();

        return service;
        ///////////////

        function configureRoutes(routes) {
            routes.forEach(function(route) {
                route.config.resolve =
                    angular.extend(route.config.resolve || {}, routehelperConfig.config.resolveAlways);
                $stateProvider.state(route.state, route.config);
            });
            $urlRouterProvider.otherwise('/');
        }

        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error) {
                    if (handlingRouteChangeError) {
                        return;
                    }
                    stateCounts.errors++;
                    handlingRouteChangeError = true;
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    logger.warning(msg, [current]);
                    $location.path('/');
                }
            );
            // on state not found, go to dashboard
            $rootScope.$on('$stateNotFound',
                function(event, unfoundState, fromState, fromParams) {
                    if (handlingRouteChangeError) {
                        return;
                    }
                    stateCounts.errors++;
                    handlingRouteChangeError = true;
                    var destination = (unfoundState && (unfoundState.title || unfoundState.to || unfoundState.name)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + ': state not found';
                    logger.warning(msg, [unfoundState]);
                    $location.path('/');
                }
            );



        }

        function init() {
            handleRoutingErrors();
            updateDocTitle();
        }

        function getNavRoutes() {
            var states = $state.get();
            for (var prop in states) {
                if (states.hasOwnProperty(prop)) {
                    var state = states[prop];
                    var isNavRoute = !!state.title;
                    if (isNavRoute) {
                        navRoutes.push(state);
                    }
                }
            }
            return navRoutes;
        }

        function updateDocTitle() {
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    stateCounts.changes++;
                    handlingRouteChangeError = false;
                    var title = routehelperConfig.config.docTitle + ' ' + (toState.title || '');
                    $rootScope.title = title; // data bind to <title>
                }
            );
        }
    }
})();





/*
myApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/state1");
  //
  // Now set up the states
  $stateProvider
    .state('state1', {
      url: "/state1",
      templateUrl: "partials/state1.html"
    })
    .state('state1.list', {
      url: "/list",
      templateUrl: "partials/state1.list.html",
      controller: function($scope) {
        $scope.items = ["A", "List", "Of", "Items"];
      }
    })
    .state('state2', {
      url: "/state2",
      templateUrl: "partials/state2.html"
    })
    .state('state2.list', {
      url: "/list",
      templateUrl: "partials/state2.list.html",
      controller: function($scope) {
        $scope.things = ["A", "Set", "Of", "Things"];
      }
    });
});
*/