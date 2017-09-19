// lazyload config
(function() {
    'use strict';
    angular
      .module('app')
      .constant('MODULE_CONFIG', [
          {
              name: 'mgcrea.ngStrap',
              module: true,
              serie: true,
              files: [
                  '/angular/assets/angular-motion/dist/angular-motion.min.css',
                  '/angular/assets/bootstrap-additions/dist/bootstrap-additions.min.css',
                  '/angular/libs/angular/angular-strap/dist/angular-strap.js',
                  '/angular/libs/angular/angular-strap/dist/angular-strap.tpl.js'
              ]
          },
          {
              name: 'ui.bootstrap',
              module: true,
              serie: true,
              files: [
                  '/angular/libs/angular/angular-bootstrap/ui-bootstrap-tpls.min.js',
                  '/angular/libs/angular/angular-bootstrap/ui-bootstrap-tpls.js'
              ]
          },
          {
              name: 'ui.select',
              module: true,
              files: [
                  '/angular/libs/angular/angular-ui-select/dist/select.min.js',
                  '/angular/libs/angular/angular-ui-select/dist/select.min.css'
              ]
          },
          {
              name: 'vr.directives.slider',
              module: true,
              files: [
                  '/angular/libs/angular/venturocket-angular-slider/build/angular-slider.min.js',
                  '/angular/libs/angular/venturocket-angular-slider/angular-slider.css'
              ]
          },
          {
              name: 'angularBootstrapNavTree',
              module: true,
              files: [
                  '/angular/libs/angular/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                  '/angular/libs/angular/angular-bootstrap-nav-tree/dist/abn_tree.css'
              ]
          },
          {
              name: 'angularFileUpload',
              module: true,
              files: [
                  '/angular/libs/angular/angular-file-upload/angular-file-upload.js'
              ]
          },
          {
              name: 'ngImgCrop',
              module: true,
              files: [
                  '/angular/libs/angular/ngImgCrop/compile/minified/ng-img-crop.js',
                  '/angular/libs/angular/ngImgCrop/compile/minified/ng-img-crop.css'
              ]
          },
          {
              name: 'smart-table',
              module: true,
              files: [
                  '/angular/libs/angular/angular-smart-table/dist/smart-table.min.js'
              ]
          },
          {
              name: 'ui.map',
              module: true,
              files: [
                  '/angular/libs/angular/angular-ui-map/ui-map.js'
              ]
          },
          {
              name: 'ui.grid',
              module: true,
              files: [
                  '/angular/libs/angular/angular-ui-grid/ui-grid.min.js',
                  '/angular/libs/angular/angular-ui-grid/ui-grid.min.css',
                  '/angular/libs/angular/angular-ui-grid/ui-grid.bootstrap.css'
              ]
          },
          {
              name: 'xeditable',
              module: true,
              files: [
                  '/angular/libs/angular/angular-xeditable/dist/js/xeditable.min.js',
                  '/angular/libs/angular/angular-xeditable/dist/css/xeditable.css'
              ]
          },
          {
              name: 'smart-table',
              module: true,
              files: [
                  '/angular/libs/angular/angular-smart-table/dist/smart-table.min.js'
              ]
          },
          {
              name:'ui.calendar',
              module: true,
              files: ['/angular/libs/angular/angular-ui-calendar/src/calendar.js']
          },
          {
              name:'summernote',
              module: true,
              files: [
                '/angular/libs/jquery/summernote/dist/summernote.css',
                '/angular/libs/jquery/summernote/dist/summernote.js',
                '/angular/libs/angular/angular-summernote/dist/angular-summernote.js'
              ]
          },
          {
              name: 'dataTable',
              module: false,
              files: [
                  '/angular/libs/jquery/datatables/media/js/jquery.dataTables.min.js',
                  '/angular/libs/jquery/plugins/integration/bootstrap/3/dataTables.bootstrap.js',
                  '/angular/libs/jquery/plugins/integration/bootstrap/3/dataTables.bootstrap.css'
              ]
          },
          {
              name: 'footable',
              module: false,
              files: [
                  '/angular/libs/jquery/footable/dist/footable.all.min.js',
                  '/angular/libs/jquery/footable/css/footable.core.css'
              ]
          },
          {
              name: 'easyPieChart',
              module: false,
              files: [
                  '/angular/libs/jquery/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'
              ]
          },
          {
              name: 'sparkline',
              module: false,
              files: [
                  '/angular/libs/jquery/jquery.sparkline/dist/jquery.sparkline.retina.js'
              ]
          },
          {
              name: 'plot',
              module: false,
              files: [
                  '/angular/libs/jquery/flot/jquery.flot.js',
                  '/angular/libs/jquery/flot/jquery.flot.resize.js',
                  '/angular/libs/jquery/flot/jquery.flot.pie.js',
                  '/angular/libs/jquery/flot.tooltip/js/jquery.flot.tooltip.min.js',
                  '/angular/libs/jquery/flot-spline/js/jquery.flot.spline.min.js',
                  '/angular/libs/jquery/flot.orderbars/js/jquery.flot.orderBars.js'
              ]
          },
          {
              name: 'vectorMap',
              module: false,
              files: [
                  '/angular/libs/jquery/bower-jvectormap/jquery-jvectormap-1.2.2.min.js',
                  '/angular/libs/jquery/bower-jvectormap/jquery-jvectormap.css', 
                  '/angular/libs/jquery/bower-jvectormap/jquery-jvectormap-world-mill-en.js',
                  '/angular/libs/jquery/bower-jvectormap/jquery-jvectormap-us-aea-en.js'
              ]
          },
          {
              name: 'moment',
              module: false,
              files: [
                  '/angular/libs/js/moment/moment.js'
              ]
          },
          {
              name: 'fullcalendar',
              module: false,
              files: [
                  '/angular/libs/jquery/moment/moment.js',
                  '/angular/libs/jquery/fullcalendar/dist/fullcalendar.min.js',
                  '/angular/libs/jquery/fullcalendar/dist/fullcalendar.css',
                  '/angular/libs/jquery/fullcalendar/dist/fullcalendar.theme.css'
              ]
          },
          {
              name: 'sortable',
              module: false,
              files: [
                  '/angular/libs/jquery/html.sortable/dist/html.sortable.min.js'
              ]
          },
          {
              name: 'nestable',
              module: false,
              files: [
                  '/angular/libs/jquery/nestable/jquery.nestable.css',
                  '/angular/libs/jquery/nestable/jquery.nestable.js'
              ]
          },
          {
              name: 'chart',
              module: false,
              files: [
                  '/angular/libs/js/echarts/build/dist/echarts-all.js',
                  '/angular/libs/js/echarts/build/dist/theme.js',
                  '/angular/libs/js/echarts/build/dist/jquery.echarts.js'
              ]
          }
        ]
      )
      .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function($ocLazyLoadProvider, MODULE_CONFIG) {
          $ocLazyLoadProvider.config({
              debug: false,
              events: false,
              modules: MODULE_CONFIG
          });
      }]);
})();

