angular.module('starter.controllers', ['ngCordova'])

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

  $http.get('http://yoplanner.com:1337/api/productos/all').success(function(data){
    $scope.productosArray = data;
  })
  .error(function(data, status, headers, config){
    console.log("Error: " +status);
  });


})
.controller('DatosCompraCtrl', function ($scope, $rootScope, $http, $cordovaGeolocation, $state) {
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
    detalle: [
      {
        producto: 1,
        cantidad: 123
      }
    ]
  };

  $scope.datosCompra = angular.copy(datosCompraInit);

  $scope.enviarOrdenCompra = function() {
    console.log('DatosCompraCtrl.enviarOrdenCompra');

    $rootScope.orden = {};

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function (position) {
        var latitude = position.coords.latitude
        var longitude = position.coords.longitude

        $scope.datosCompra.location.coordinates = new Array();
        $scope.datosCompra.location.coordinates.push(longitude);
        $scope.datosCompra.location.coordinates.push(latitude);

        console.log('DatosCompra :: ', $scope.datosCompra);

        // $http.post('http://192.168.1.72:1337/api/orden/place', $scope.datosCompra)
        $http.post('http://yoplanner.com:1337/api/orden/place', $scope.datosCompra)
          .success(function(response) {
            console.log('Response :: ', response);
            $scope.names = response.records;
          })
          .error(function(error) {
            console.log('ERROR ::', error);
            $scope.datosCompra = angular.copy(datosCompraInit);
          });
        ;

      }, function(err) {
        // error
      });

  }

  $scope.cancelarOrden = function() {
    console.log('DatosCompraCtrl.cancelarOrden');
    $state.go('productos');
  }

  $scope.regresar = function() {
    console.log('DatosCompraCtrl.regresar');
    $state.go('comprar');
  }

})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $rootScope) {
  $scope.totalCompra = 0;
  $rootScope.detalle;

  $scope.sumarPrecio = function(precio){
    $scope.totalCompra = $scope.totalCompra + precio;
  };

  $scope.restarPrecio = function(precio){
    if($scope.totalCompra!=0)
    $scope.totalCompra = $scope.totalCompra - precio;
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
