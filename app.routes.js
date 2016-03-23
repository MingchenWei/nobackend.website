export default function routing($routeProvider, $urlRouterProvider, $stateProvider, $locationProvider) {
  'ngInject';
  $stateProvider
    .state('users2', {
      url: '/users2',
      views: {
        "viewA": {templateUrl: './components/users/users.html'},
        "viewB": {template: '<a ui-sref="users2.details({id:34})">cross link (ui-sref)</a>'}
      },
      controller: 'Users2Controller',
      controllerAs: 'users2'
    })
    .state('users2.details', {
      url: '/:id',
      template: '<button ng-click="details.sayHi(\'ui-router\')">changed to ui-router</button>',
      controller: 'DetailsController',
      controllerAs: 'details'
    })
    .state('zuimeia', {
      url: '/zuimeia',
      template: '<apps app-items="appItems"></apps>',
      resolve: {
        appItems($http) {
          'ngInject';

          return $http.get('data.json')
        }
      },
      controller($scope, appItems) {
        'ngInject';

        $scope.appItems = appItems;
      }
    })
    .state('jekyll', {
      url: '/jekyll',
      template: '<posts categories="categories.data"></posts>',
      resolve: {
        categories(githubService) {
          'ngInject';

          return githubService.readApi('_posts');
        }
      },
      controller($scope, categories) {
        'ngInject';

        $scope.categories = categories;
      }
    });

  const originalWhen = $routeProvider.when;

  $routeProvider.when = (path, route) => {
    route.resolve || (route.resolve = {});
    angular.extend(route.resolve, {
      config(githubService) {
        'ngInject';

        return githubService.getConfig();
      },
      index(githubService) {
        'ngInject';

        return githubService.getIndex();
      }
    });

    return originalWhen.call($routeProvider, path, route);
  };

  $routeProvider
    .when('/note/:category?/:post?', {
      template: '<note post-content="$resolve.post.data" site-info="$resolve.config.data" index="$resolve.index.data"></note>',
      resolve: {
        post($route, githubService) {
          'ngInject';

          const category = $route.current.params.category;
          const postId = $route.current.params.post;
          if (postId) {
            return githubService.getPost(category, postId);
          }
        }
      }
    })
    .when('/pages/:page', {template: '<nest site-info="$resolve.config.data" index="$resolve.index.data"></nest>'})
    .when('/photos', {template: '<iframe id="preview" src="http://unperfectlove.lofter.com/" frameborder="0" width="100%" height="100%"></iframe>'})
    .when('/', {redirectTo: '/note'});

  $locationProvider.hashPrefix('!');
}
