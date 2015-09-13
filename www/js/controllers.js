angular.module('starter.controllers', [])

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


.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {
  $scope.totalCompra = 0;
  $scope.detalle;

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
    if($scope.detalle === undefined){
      $scope.detalle = [{producto:producto.idProducto, cantidad:1, nombre: producto.descripcion, presentacion: producto.presentacion, precio:producto.precio, imagen:producto.imagen}]
    }else{

      angular.forEach($scope.detalle, function(value, key){
        if(continuar){
          if(value.producto === producto.idProducto){
            posicion = key
            continuar = false;
          }
        }
      });
      if(posicion !== -1){
        $scope.detalle[posicion].cantidad = $scope.detalle[posicion].cantidad + 1;
      }else{
        $scope.detalle.push({producto:producto.idProducto, cantidad:1, nombre: producto.descripcion, presentacion: producto.presentacion, precio:producto.precio, imagen:producto.imagen});
      }
    }
  };

  $scope.quitarProducto = function(producto){
    var posicion = -1;
    if($scope.detalle === undefined){
      return;
    }else{
      angular.forEach($scope.detalle, function(value, key){
        if(value.producto === producto.idProducto){
          posicion = key;
        }
      });
      if(posicion!==-1){
        if($scope.detalle[posicion].cantidad===1){
          $scope.detalle.splice(posicion, 1);
        }else{
          $scope.detalle[posicion].cantidad = $scope.detalle[posicion].cantidad - 1;
        }
      }
    }
  }


  $scope.numProductos = function(){
    var cantidad = 0;
    if($scope.detalle === undefined){
      return cantidad;
    }else{
      angular.forEach($scope.detalle, function(value, key){
        cantidad = cantidad + value.cantidad;
      });
      return cantidad;
    }
  };

  $scope.numProducto = function(idProducto){
    var cantidad = 0;
    var posicion = -1;
    if($scope.detalle === undefined){
      return cantidad;
    }else{
      angular.forEach($scope.detalle, function(value, key){
        if(value.producto === idProducto){
          posicion = key;
        }
      });
      if(posicion!==-1)
        return $scope.detalle[posicion].cantidad;
      else
        return cantidad;
    }
  };

  $scope.go = function(path, params) {
      $state.go(path, params);
    };

});
