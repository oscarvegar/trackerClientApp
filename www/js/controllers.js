angular.module('starter.controllers', ['ngCordova', 'uiGmapgoogle-maps', 'ionic', 'ui.bootstrap'])

.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})

.controller('ProductosCtrl', function($scope, $ionicModal, $timeout, $http) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('modalCompra.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };


  $scope.productosArray = [];

  $http.get(_HOST+'/api/productos/all').success(function(data){
    $scope.productosArray = data;
  })
  .error(function(data, status, headers, config){
    console.log("Error: ",JSON.stringify(status));
  });


})

.controller('DatosCompraCtrl', function ($scope, $rootScope, $http, $cordovaGeolocation, $state, uiGmapGoogleMapApi,
    $ionicModal, $window, $modal, $log) {
  var datosCompraInit = {
    nombre: '',
    ap_pat: '',
    ap_mat: '',
    direccion: {
      calle: '',
      no_ext: '',
      no_int: '',
      colonia: '',
      cp: '',
      del_mun: '',
      estado: '',
      pais: ''
    },
    contacto: {
      tel: '',
      movil: '',
      nextel: '',
      email: ''
    },
    location: {
      coordinates: new Array()
    },
    detalle: new Array(),
    totalCompra: 0
  };

  $scope.datosCompra = angular.copy(datosCompraInit);

  $scope.initDatosCompra = function() {
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        $scope.map = { center: { latitude: latitude, longitude: longitude }, zoom: 15 };
        $scope.map['markers'] = [{
          id:0,
          latitude:latitude,
          longitude:longitude,
          icon:{url:"img/beer-marker.jpg"},
          options: {
            draggable: true
          }
        }];
      }, function(err) {
        console.error('Error ::', JSON.stringify(err));
        // Default a Plaza de la Constitución, D. F.
        var latitude = 19.4325179;
        var longitude = -99.1332456;

        $scope.map = { center: { latitude: latitude, longitude: longitude }, zoom: 15 };
        $scope.map['markers'] = [{
          id:0,
          latitude:latitude,
          longitude:longitude,
          icon:{url:"img/beer-marker.jpg"},
          options: {
            draggable: true
          }
        }];
      });
  }


  $scope.enviarOrdenCompra = function() {
    console.log('DatosCompraCtrl.enviarOrdenCompra');

    if ($rootScope.detalle === undefined || $rootScope.detalle.length === 0) {
      $scope.alerts = [
        { type: 'danger', msg: 'El carro de compras se encuentra vacío.' }
      ];
      return;
    };

    var modalEnviando = $scope.open('mySendingReceivedModalContent.html', 'sm', 'Enviando ...', 'Se esta realizando el envio de tú orden', false);

    /*
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function (position) {
    */
    var markers = $scope.map.markers;
    console.log('markers ::', markers);
    var position = markers[0];

        var latitude = position.latitude;
        var longitude = position.longitude;

        $scope.datosCompra.location.coordinates = new Array();
        $scope.datosCompra.location.coordinates.push(longitude);
        $scope.datosCompra.location.coordinates.push(latitude);

        $scope.datosCompra.detalle = $rootScope.detalle;
        $scope.datosCompra.totalCompra = $rootScope.totalCompra;

        console.log('DatosCompra :: ', $scope.datosCompra);

        // $http.post('http://192.168.1.72:1337/api/orden/place', $scope.datosCompra)
        $http.post(_HOST+'/api/orden/place', $scope.datosCompra)
          .success(function(response) {
            console.log('Response :: ', response);
            // $modalInstance.close('okModal');
            $scope.modalInstance.dismiss('cancel');
            $scope.open('mySendingReceivedModalContent.html', 'sm', 'Orden Recibida', 'Tú orden ha sido enviada correctamente.', true);
            $scope.names = response.records;
            $scope.datosCompra = angular.copy(datosCompraInit);
            $rootScope.detalle = new Array();
            $rootScope.totalCompra = 0;
          })
          .error(function(error) {
            console.log('ERROR ::', JSON.stringify(error));
            $scope.datosCompra = angular.copy(datosCompraInit);
            $rootScope.detalle = new Array();
            $rootScope.totalCompra = 0;
          });
      /*
      }, function(err) {
        console.error("Error ::", err);
      });
      */

  }

  $scope.regresarHomeProducts = function() {
    console.log('DatosCompraCtrl.regresarHomeProducts');
    $rootScope.detalle = new Array();
    $rootScope.totalCompra = 0;
    $state.go('productos');
  }

  $scope.cancelarOrden = function() {
    console.log('DatosCompraCtrl.cancelarOrden');
    $rootScope.detalle = new Array();
    $rootScope.totalCompra = 0;
    $state.go('productos');
  }

  $scope.regresar = function() {
    console.log('DatosCompraCtrl.regresar');
    $state.go('comprar');
  }

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.animationsEnabled = true;

  $scope.open = function (templateUrl, size, modalTitleText, modalDetailText, okButtonShow) {
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: templateUrl,
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        modalTitleText: function () {
          return modalTitleText;
        },
        modalDetailText: function () {
          return modalDetailText
        },
        okButtonShow: function () {
          return okButtonShow;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $log.info('selectedItem ::' + selectedItem);
      $scope.regresarHomeProducts();
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

      return $scope.modalInstance;
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

  $scope.$evalAsync(function($scope) {
    $scope.initDatosCompra();
  })

  // uiGmapGoogleMapApi is a promise.
  // The "then" callback function provides the google.maps object.
  uiGmapGoogleMapApi.then(function(maps) {

  });

})

.controller('ModalInstanceCtrl', function ($scope, $state, $modalInstance, modalTitleText, modalDetailText, okButtonShow) {

  $scope.modalTitleText = modalTitleText;
  $scope.modalDetailText = modalDetailText;
  $scope.okButtonShow = okButtonShow;

  $scope.okModal = function () {
    $modalInstance.close('okModal');
  };

  $scope.cancelModal = function () {
    $modalInstance.dismiss('cancel');
  };
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $rootScope) {
  $rootScope.totalCompra = 0;
  $rootScope.detalle;

  $scope.sumarPrecio = function(precio){
    $rootScope.totalCompra = $rootScope.totalCompra + precio;
  };

  $scope.restarPrecio = function(precio){
    if($rootScope.totalCompra!=0)
    $rootScope.totalCompra = $rootScope.totalCompra - precio;
  };

  $scope.agregarProducto = function(producto){
    var continuar = true;
    var posicion = -1;
    if($rootScope.detalle === undefined){
      $rootScope.detalle = [{producto:producto.id, cantidad:1, nombre: producto.descripcion, presentacion: producto.presentacion, precio:producto.precio, imagen:producto.imagen}]
    }else{

      angular.forEach($rootScope.detalle, function(value, key){
        if(continuar){
          if(value.producto === producto.id){
            posicion = key
            continuar = false;
          }
        }
      });
      if(posicion !== -1){
        $rootScope.detalle[posicion].cantidad = $rootScope.detalle[posicion].cantidad + 1;
      }else{
        $rootScope.detalle.push({producto:producto.id, cantidad:1, nombre: producto.descripcion, presentacion: producto.presentacion, precio:producto.precio, imagen:producto.imagen});
      }
    }
  };

  $scope.quitarProducto = function(producto){
    var posicion = -1;
    if($rootScope.detalle === undefined){
      return;
    }else{
      angular.forEach($rootScope.detalle, function(value, key){
        if(value.producto === producto.id){
          posicion = key;
        }
      });
      if(posicion!==-1){
        if($rootScope.detalle[posicion].cantidad===1){
          $rootScope.detalle.splice(posicion, 1);
        }else{
          $rootScope.detalle[posicion].cantidad = $rootScope.detalle[posicion].cantidad - 1;
        }
      }
    }
  }


  $scope.numProductos = function(){
    var cantidad = 0;
    if($rootScope.detalle === undefined){
      return cantidad;
    }else{
      angular.forEach($rootScope.detalle, function(value, key){
        cantidad = cantidad + value.cantidad;
      });
      return cantidad;
    }
  };

  $scope.numProducto = function(idProducto){
    var cantidad = 0;
    var posicion = -1;
    if($rootScope.detalle === undefined){
      return cantidad;
    }else{
      angular.forEach($rootScope.detalle, function(value, key){
        if(value.producto === idProducto){
          posicion = key;
        }
      });
      if(posicion!==-1)
        return $rootScope.detalle[posicion].cantidad;
      else
        return cantidad;
    }
  };

  $scope.go = function(path, params) {
      $state.go(path, params);
    };

});
