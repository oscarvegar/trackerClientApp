// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var _HOST="http://yoplanner.com:1337";

angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
  $rootScope.$on("$routeChangeSuccess", function(){
     window.scrollTo(0,0);
})
})

.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('comprar', {
    url: "/comprar",
    templateUrl: "modalCompra.html",
    controller: 'ProductosCtrl'
  })
  .state('productos', {
    url: "/productos",
    templateUrl: "productos.html",
    controller: 'ProductosCtrl'
  })
  .state('datos_compra', {
    url: "/datos_compra",
    templateUrl: "datos_compra.html",
    controller: 'DatosCompraCtrl'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/productos');
});
