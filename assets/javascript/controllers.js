/*
 * Author: Mikael Hallgren
 * Mail: Hallgren.mikael@gmail.com
 * Desc: An angular application that allows users to search facebook-pages.
 */


/*
 * Controller for the search/start -page
 */
function GroupListCtrl($scope, $http, Cache) {

  /*
   * Functions that handle the search queries
   */

  // searchfunction 
	$scope.search = function(){
		var url = 'http://graph.facebook.com/search?q=' + $scope.query +  '&type=page'
    Cache.put("search", $scope.query)
    getSearchResult(url);
    event.preventDefault();
  }

  // loads the next-page searchresult
  $scope.next = function(){
    getSearchResult($scope.paging.next);
    event.preventDefault();
  }

  // loads the previous-page searchresult
  $scope.previous = function(){
    getSearchResult($scope.paging.previous);
    event.preventDefault();
  }

  // helpfunction that preformes a search and updates the value for groups & paging
  function getSearchResult(query)
  {
    if(query)
    {
      $http.get(query).success(function(data) {
        if(data.data)
        {
          $scope.groups = data.data;
          $scope.paging = data.paging;
        }
      });
    }
    console.log(query)
  }

  // when user return to startpage fetch searchresults
  $scope.query = Cache.get("search");
  if($scope.query)
  {
    $scope.search();
  }


  /*
   * Functions that handle the favorite-feature
   */
  $scope.add_favorite = function(id, name){
    var favorites = Cache.get("favorites") ? Cache.get("favorites") : [];
    var exists = objectExists({"id": id, "name": name}, favorites)
    console.log(exists);
    if(exists == -1)
    {
      favorites.push({"id": id, "name": name});
      Cache.put("favorites", favorites)
      $scope.favorites = Cache.get("favorites");
    }

    event.preventDefault();
  }

  $scope.remove_favorite = function(id, name){
    var favorites = Cache.get("favorites") ? Cache.get("favorites") : [];
    var index = objectExists({"id": id, "name": name}, favorites)
    favorites.splice(index, 1);
    Cache.put("favorites", favorites)
    $scope.favorites = Cache.get("favorites");
    
    event.preventDefault();
  }

  // when user return to startpage fetch cached favourites
  $scope.favorites = Cache.get("favorites");
}


/*
 * Controller for the detail page-view
 */
function GroupDetailCtrl($scope, $routeParams, $http) { 
  var url = 'http://graph.facebook.com/' + $routeParams.groupId + '/'
  
  // binding values to variables that are used in the templatefiles
  $http.get(url).success(function(data) {
    $scope.name     = data.name;
    $scope.location = data.current_location;
    $scope.category = data.category;

    $scope.about  = data.description;
    $scope.bio	  = data.bio;
    $scope.likes  = data.likes;

    $scope.cover    = (data.cover) ? {source: data.cover.source, offset: {y: data.cover.offset_y, x: data.cover.offset_x} } : null/*{source: null, offset: {y: null, x: null} }*/ ;
    $scope.profile_picture  = "https://graph.facebook.com/" + data.id +"/picture?width=150&height=150";

    $scope.category = data.category;
    $scope.websites = (data.website)? data.website.split(" ") : [];
  });

  
  url = 'http://graph.facebook.com/' + $routeParams.groupId + '/photos?fields=source,height,width'
  $http.get(url).success(function(data) {
  	$scope.images = data.data
  });
}