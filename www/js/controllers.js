angular.module('starter.controllers', [])

.controller('ProductosCtrl', function($scope, $ionicModal, $timeout) {

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


  $scope.productosArray = [
{
'idProducto': 33,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440115982601.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440115982678.png',
'descripcion': 'Bud Light',
'precio': 170.00,
'presentacion': 'Bud Light - 18 Pack - 355ml - No retornable'
},
{
'idProducto': 34,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440116133232.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440116133309.png',
'descripcion': 'Corona Extra',
'precio': 170.00,
'presentacion': 'Corona Extra - 18 Pack - 355ml - No retornable'
},
{
'idProducto': 35,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440116317974.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440116318051.png',
'descripcion': 'Corona Light',
'precio': 170.00,
'presentacion': 'Corona Light - 18 Pack - 355ml - No retornable'
},
{
'idProducto': 36,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440116459637.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440116459714.png',
'descripcion': 'Modelo Especial',
'precio': 220.00,
'presentacion': 'Modelo Especial - 18 Pack - 355ml - No retornable'
},
{
'idProducto': 37,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440116568795.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440116568872.png',
'descripcion': 'Stella Artois',
'precio': 340.00,
'presentacion': 'Stella Artois - 18 Pack - 330 ml - No Retornable'
},
{
'idProducto': 38,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440116699453.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440116699530.png',
'descripcion': 'Michelob Ultra',
'precio': 265.00,
'presentacion': 'Michelob Ultra - 18 Pack - 355ml - No retornable'
},
{
'idProducto': 39,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440169062281.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440169062358.png',
'descripcion': 'Bud Light Raz-Ber-Rita',
'precio': 205.00,
'presentacion': 'Bud Light Raz-Ber-Rita - 18 Pack - 8 Oz - No Retornable'
},
{
'idProducto': 40,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440169658601.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440169658678.png',
'descripcion': 'Bud Light Lime-A-Rita',
'precio': 205.00,
'presentacion': 'Bud Light Lime-A-Rita - 18 Pack - 8 Oz - No Retornable'
},
{
'idProducto': 41,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440169932088.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440169932165.png',
'descripcion': 'Bud Light Straw-Ber-Rita',
'precio': 205.00,
'presentacion': 'Bud Light Straw-Ber-Rita - 18 Pack - 8 Oz - No Retornable'
},
{
'idProducto': 42,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440170191776.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440170191853.png',
'descripcion': 'Barrilito',
'precio': 205.00,
'presentacion': 'Barrilito - 18 Pack - 325 ml - No Retornable'
},
{
'idProducto': 43,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1440607565153.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1440607565230.png',
'descripcion': 'Promo Bud Light',
'precio': 170.00,
'presentacion': 'Compra un 18-Pack de Bud Light bote, y ll&eacute;vate 3 botes adicionales. Aplican Restricciones.'
},
{
'idProducto': 45,
'cantidad': 0,
'imagen': 'http://www.modelonow.com/repository/productos/1441243753010.png',
'imagen_hover': 'http://www.modelonow.com/repository/productos/1441243753087.png',
'descripcion': 'Bud Light',
'precio': 120.00,
'presentacion': 'Bud Light - 12 Pack - 355ml - No retornable'
}
];


})



.controller('SessionsCtrl', function($scope, Session, $http) {
 $http.get('http://localhost:8080/SIPEWEB/mobile/getGruposDemandadosByImei/861378016136630')
	.success(function(data){
	    $scope.gruposDemandados = data;
	})
})

.controller('SessionCtrl', function($scope, $stateParams, Session, $http) {

	$http.get('http://localhost:8080/SIPEWEB/mobile/getSolidariosDemanda/' + $stateParams.sessionId)
		.success(function(data){
		    $scope.solidarios = data;
		})
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
        $scope.detalle.push({producto:producto.idProducto, cantidad:1, nombre: producto.descripcion, presentacion: producto.presentacion, precio:producto.precio});
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
