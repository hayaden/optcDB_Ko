/* jshint loopfunc:true */

(function() {

var app = angular.module('optc', [ 'ui.router', 'ui.bootstrap', 'ngSanitize', 'chart.js', 'ngDialog' ]);

Utils.parseUnits(false);

/********************
 * GA Configuration *
 ********************/

app
    .run(function($rootScope, $location, $window, $state, $stateParams) {
        $rootScope.$on('$stateChangeSuccess',function(e) {
            $rootScope.currentState = $state.current.name;
            if (ga) ga('send', 'pageview', '/characters');
            var title = 'One Piece Treasure Cruise Character Table';
            if ($state.current.name == 'main.search.view') {
                var unit = window.units[parseInt($stateParams.id,10) - 1];
                title = (unit.name || '?') + ' | ' + title;
                if (unit.preview) title = '(Preview) ' + title;
            }
            window.document.title = title;
        });
    });

/**************
 * Versioning *
 **************/

app
    .run(function($http, $storage) {

        /* * * * * Check version * * * * */

        $http.get('../common/data/version.js?ts=' + Date.now())
            .then(function(response) {
                var version = parseInt(response.data.match(/=\s*(\d+)/)[1],10);
                if (version <= window.dbVersion) return;
                noty({
                    text: '새로운 데이터가 감지되었습니다. 페이지를 새로고침 해주세요.',
                    timeout: 5000,
                    type: 'success',
                    layout: 'topRight',
                    theme: 'relax'
                });
            });

        /* * * * * Alerts * * * * */

        var version = $storage.get('charVersion', 5);

        if (version < 5) {
            $storage.set('charVersion', 5);
            setTimeout(function() {
                noty({
                    text: '일부 항목이 변경되었습니다. 페이지를 새로고침하거나 브라우저 캐시를 지워주세요.',
                    timeout: 10000,
                    type: 'error',
                    layout: 'topRight',
                    theme: 'relax'
                });
            },500);
        }

    });

})();
