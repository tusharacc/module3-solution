(function(){
    angular.module('MenuItems', [])
    .controller('AllMenuItemsController', AllMenuItemsController)
    .controller('GetRequestedMenuController', GetRequestedMenuController)
    .service('GetMenuItemsService',GetMenuItemsService)
    .directive('listItems',ListItems);
    
    
    
    function ListItems(){
        var ddo = {
            templateUrl: 'ListItem.html',
            scope: {
                menuItems: "=myItem"
            }
        };
        
        return ddo;
    }
    
    
    GetRequestedMenuController.$inject=['GetMenuItemsService'];
    function GetRequestedMenuController(GetMenuItemsService){
        var getMenu = this;
        getMenu.requestedStr = '';

        var service = GetMenuItemsService;
        getMenu.requestItems = function(){         
            getMenu.foundItems = service.getRequestedItems(getMenu.requestedStr);
        };  

        getMenu.removeItem = function(index){
            getMenu.foundItems = service.removeRequesteditem(index);
        };  
    }

    AllMenuItemsController.$inject = ['GetMenuItemsService'];
    function AllMenuItemsController(GetMenuItemsService){
        var menuItems = this;
        
        var service = GetMenuItemsService;
        menuItems.items = service.getAllMenuItemsFromAPI();
    }
    
    GetMenuItemsService.$inject = ['$http']
    function GetMenuItemsService($http){
        var service = this;
        var menu_items = [];
        var requestedItems = [];

        service.getAllMenuItemsFromAPI = function(){

            var promise = getAllMenuItems($http);        

            promise.then(function(response){
                items = response.data;
                menu_items.push(...items.menu_items);
            })
            .catch(function(error){
                console.log('Something went terribly wrong');
            });
            return menu_items
        }

        service.getRequestedItems = function(requestedStr){
            for (i=0;i<menu_items.length;i++){
                if (menu_items[i].name.toLowerCase().indexOf(requestedStr.toLowerCase()) >= 0){
                    requestedItems.push(menu_items[i]);
                }
            }
            return requestedItems;
        };

        service.removeRequesteditem = function(index){
            requestedItems.splice(index,1);
            return requestedItems;
        };

        function getAllMenuItems(){
            var response = $http({
                method: "GET",
                url: "https://davids-restaurant.herokuapp.com/menu_items.json"
            });
            return response;
        }
    }
})();