/*
 * Author: Mikael Hallgren
 * Mail: Hallgren.mikael@gmail.com
 * Desc: An angular application that allows users to search facebook-pages.
 */


/*
 * Defining the angular application
 */
 var app = angular.module('facebook',[]);

/*
 * Configuring the routing pattern for the application
 */
 app.config(['$routeProvider', function($routeProvider) {
   $routeProvider.
   when('/facebook-api-angular/groups',          {templateUrl: 'partials/group_list.html',   controller: GroupListCtrl}).
   when('/facebook-api-angular/groups/:groupId', {templateUrl: 'partials/group_detail.html', controller: GroupDetailCtrl}).
   otherwise({redirectTo: '/facebook-api-angular/groups'});
 }]);

/*
 * Configuring the routing pattern for the application
 */
app.directive('updateMasonry', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
      // on last element initiate masonry
      var $container = $('.photo_stream');
      $container.masonry({
        itemSelector : '.images',
        isAnimated: true,
        isFitWidth: true 
      });

      // due to the racing problem of images loading 
      // we append each object separately to masonry
      $container.imagesLoaded(function( $images, $proper, $broken ){
        $.each($images, function(index, obj) {
          $container.masonry( 'appended', $(obj), true )
        });
      });
    }
  };
});

/*
 * Initiating a AngularJS cache factory to save
 * favourites and latest search string
 */
app.factory('Cache', function($cacheFactory) {
  return $cacheFactory('cache', {
    capacity: 2
  });
});

/*
 * Helpfunction that checks if object with matching ID exists in array
 */
function objectExists(obj, list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].id == obj.id) 
    {
      return i;
    }
  }
  return -1;
}