function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
  /***/
  "./$$_lazy_route_resource lazy recursive":
  /*!******************************************************!*\
    !*** ./$$_lazy_route_resource lazy namespace object ***!
    \******************************************************/

  /*! no static exports found */

  /***/
  function $$_lazy_route_resourceLazyRecursive(module, exports) {
    function webpackEmptyAsyncContext(req) {
      // Here Promise.resolve().then() is used instead of new Promise() to prevent
      // uncaught exception popping up in devtools
      return Promise.resolve().then(function () {
        var e = new Error("Cannot find module '" + req + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      });
    }

    webpackEmptyAsyncContext.keys = function () {
      return [];
    };

    webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
    module.exports = webpackEmptyAsyncContext;
    webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";
    /***/
  },

  /***/
  "./src/app/app.component.ts":
  /*!**********************************!*\
    !*** ./src/app/app.component.ts ***!
    \**********************************/

  /*! exports provided: AppComponent */

  /***/
  function srcAppAppComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppComponent", function () {
      return AppComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _work_items_work_items_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./work-items/work-items.component */
    "./src/app/work-items/work-items.component.ts");

    function AppComponent_app_work_items_1_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "app-work-items", 1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Loading app work items");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("fileUri", ctx_r0.fileUri)("connectorUrl", ctx_r0.host);
      }
    }

    var AppComponent =
    /*#__PURE__*/
    function () {
      function AppComponent() {
        _classCallCheck(this, AppComponent);

        this.title = 'Main page';
      }

      _createClass(AppComponent, [{
        key: "onMessage",
        value: function onMessage(event) {
          var message = event.data; // The json data that the extension sent
          // TODO:

          console.log('test!');

          switch (message.command) {
            case 'search':
              this.host = message.serverHost;
              this.resource = message.resource;
              this.fileUri = message.folderUri;
              break;

            case 'findDocumentation':
              {
                var serverHost = message.serverHost;
                var folderUri = message.folderUri;
                var queryTerm = message.queryTerm;
                console.log(serverHost);
                console.log(queryTerm);
                console.log(folderUri);
                break;
              }
          }
        }
      }, {
        key: "ngOnInit",
        value: function ngOnInit() {
          // @ts-ignore
          this.vscodeApi = acquireVsCodeApi();
        }
      }]);

      return AppComponent;
    }();

    AppComponent.ɵfac = function AppComponent_Factory(t) {
      return new (t || AppComponent)();
    };

    AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      hostBindings: function AppComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("message", function AppComponent_message_HostBindingHandler($event) {
            return ctx.onMessage($event);
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresolveWindow"]);
        }
      },
      decls: 2,
      vars: 1,
      consts: [[3, "fileUri", "connectorUrl", 4, "ngIf"], [3, "fileUri", "connectorUrl"]],
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, AppComponent_app_work_items_1_Template, 2, 2, "app-work-items", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.resource === "workItems");
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], _work_items_work_items_component__WEBPACK_IMPORTED_MODULE_2__["WorkItemsComponent"]],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-root',
          template: "\n    <div>\n      <app-work-items [fileUri]=\"fileUri\" [connectorUrl]=\"host\" *ngIf=\"resource ==='workItems'\">Loading app work items</app-work-items>\n    </div>\n  ",
          styleUrls: ['./app.component.css']
        }]
      }], null, {
        onMessage: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"],
          args: ['window:message', ['$event']]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/app.module.ts":
  /*!*******************************!*\
    !*** ./src/app/app.module.ts ***!
    \*******************************/

  /*! exports provided: AppModule */

  /***/
  function srcAppAppModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppModule", function () {
      return AppModule;
    });
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
    /* harmony import */


    var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./app.component */
    "./src/app/app.component.ts");
    /* harmony import */


    var _work_items_work_items_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./work-items/work-items.component */
    "./src/app/work-items/work-items.component.ts");
    /* harmony import */


    var _toMarkdown_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./toMarkdown.pipe */
    "./src/app/toMarkdown.pipe.ts");
    /* harmony import */


    var ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ngx-infinite-scroll */
    "./node_modules/ngx-infinite-scroll/__ivy_ngcc__/modules/ngx-infinite-scroll.js");

    var AppModule = function AppModule() {
      _classCallCheck(this, AppModule);
    };

    AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
    });
    AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
      factory: function AppModule_Factory(t) {
        return new (t || AppModule)();
      },
      providers: [],
      imports: [[_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"], ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__["InfiniteScrollModule"]]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, {
        declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"], _work_items_work_items_component__WEBPACK_IMPORTED_MODULE_4__["WorkItemsComponent"], _toMarkdown_pipe__WEBPACK_IMPORTED_MODULE_5__["ToMarkdownPipe"]],
        imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"], ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__["InfiniteScrollModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
          declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"], _work_items_work_items_component__WEBPACK_IMPORTED_MODULE_4__["WorkItemsComponent"], _toMarkdown_pipe__WEBPACK_IMPORTED_MODULE_5__["ToMarkdownPipe"]],
          imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"], ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_6__["InfiniteScrollModule"]],
          providers: [],
          bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/toMarkdown.pipe.ts":
  /*!************************************!*\
    !*** ./src/app/toMarkdown.pipe.ts ***!
    \************************************/

  /*! exports provided: ToMarkdownPipe */

  /***/
  function srcAppToMarkdownPipeTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ToMarkdownPipe", function () {
      return ToMarkdownPipe;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var showdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! showdown */
    "./node_modules/showdown/dist/showdown.js");
    /* harmony import */


    var showdown__WEBPACK_IMPORTED_MODULE_1___default =
    /*#__PURE__*/
    __webpack_require__.n(showdown__WEBPACK_IMPORTED_MODULE_1__);

    var ToMarkdownPipe =
    /*#__PURE__*/
    function () {
      function ToMarkdownPipe() {
        _classCallCheck(this, ToMarkdownPipe);
      }

      _createClass(ToMarkdownPipe, [{
        key: "transform",
        value: function transform(value) {
          return new showdown__WEBPACK_IMPORTED_MODULE_1___default.a.Converter().makeHtml(value).replace(/<pre>/g, "\n    <div style=\"white-space: pre-wrap !important; width: 99% !important;\">");
        }
      }]);

      return ToMarkdownPipe;
    }();

    ToMarkdownPipe.ɵfac = function ToMarkdownPipe_Factory(t) {
      return new (t || ToMarkdownPipe)();
    };

    ToMarkdownPipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
      name: "toMarkdown",
      type: ToMarkdownPipe,
      pure: true
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ToMarkdownPipe, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Pipe"],
        args: [{
          name: 'toMarkdown'
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/work-items/work-items.component.ts":
  /*!****************************************************!*\
    !*** ./src/app/work-items/work-items.component.ts ***!
    \****************************************************/

  /*! exports provided: WorkItemsComponent */

  /***/
  function srcAppWorkItemsWorkItemsComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "WorkItemsComponent", function () {
      return WorkItemsComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
    /* harmony import */


    var ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ngx-infinite-scroll */
    "./node_modules/ngx-infinite-scroll/__ivy_ngcc__/modules/ngx-infinite-scroll.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _toMarkdown_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../toMarkdown.pipe */
    "./src/app/toMarkdown.pipe.ts");

    function WorkItemsComponent_div_1_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h1");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "div", 2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](4, "toMarkdown");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var workItem_r2 = ctx.$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](workItem_r2.title);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("innerHTML", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](4, 2, workItem_r2.body), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeHtml"]);
      }
    }

    var PreFetchResponse = function PreFetchResponse(identifier, message) {
      _classCallCheck(this, PreFetchResponse);

      this.identifier = identifier;
      this.message = message;
    };

    var WorkItemsComponent =
    /*#__PURE__*/
    function () {
      function WorkItemsComponent(http) {
        _classCallCheck(this, WorkItemsComponent);

        this.http = http;
        this.currentPage = 0;
        this.workItems = [];
      }

      _createClass(WorkItemsComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          this.updatePageContent();
        }
      }, {
        key: "updatePageContent",
        value: function updatePageContent() {
          var _this = this;

          this.getWorkItems().subscribe(function (items) {
            return items.forEach(function (item) {
              _this.workItems.push(item);
            });
          });
        }
      }, {
        key: "onScrolledDown",
        value: function onScrolledDown() {
          console.log('scrolled down');
          this.currentPage++;
          this.updatePageContent();
        }
      }, {
        key: "onScrolledUp",
        value: function onScrolledUp() {
          console.log('scrolled up');
        }
      }, {
        key: "fetchWorkItems",
        value: function fetchWorkItems() {
          var _this2 = this;

          return this.http.get("http://".concat(this.connectorUrl, "/workItems?uri=").concat(this.fileUri)).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["tap"])(function (result) {
            console.log(result.identifier);
          }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["delay"])(2000), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["switchMap"])(function (value) {
            _this2.currentIdentifier = value;
            return _this2.fetchResults(value);
          }));
        }
      }, {
        key: "fetchResults",
        value: function fetchResults(value) {
          return this.http.get("http://".concat(this.connectorUrl, "/workItems/").concat(value.identifier, "?page=").concat(this.currentPage)).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["tap"])(function (result) {
            console.log(result);
          }));
        }
      }, {
        key: "getWorkItems",
        value: function getWorkItems() {
          if (this.currentIdentifier !== undefined) {
            return this.fetchResults(this.currentIdentifier);
          } else {
            return this.fetchWorkItems();
          }
        }
      }]);

      return WorkItemsComponent;
    }();

    WorkItemsComponent.ɵfac = function WorkItemsComponent_Factory(t) {
      return new (t || WorkItemsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]));
    };

    WorkItemsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: WorkItemsComponent,
      selectors: [["app-work-items"]],
      inputs: {
        fileUri: "fileUri",
        connectorUrl: "connectorUrl"
      },
      decls: 2,
      vars: 1,
      consts: [["infinite-scroll", "", 1, "results", 3, "scrolled", "scrolledUp"], [4, "ngFor", "ngForOf"], [3, "innerHTML"]],
      template: function WorkItemsComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("scrolled", function WorkItemsComponent_Template_div_scrolled_0_listener($event) {
            return ctx.onScrolledDown();
          })("scrolledUp", function WorkItemsComponent_Template_div_scrolledUp_0_listener($event) {
            return ctx.onScrolledUp();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, WorkItemsComponent_div_1_Template, 5, 4, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.workItems);
        }
      },
      directives: [ngx_infinite_scroll__WEBPACK_IMPORTED_MODULE_3__["InfiniteScrollDirective"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"]],
      pipes: [_toMarkdown_pipe__WEBPACK_IMPORTED_MODULE_5__["ToMarkdownPipe"]],
      encapsulation: 2
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](WorkItemsComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-work-items',
          template: "\n    <div class=\"results\" infinite-scroll (scrolled)=\"onScrolledDown()\" (scrolledUp)=\"onScrolledUp()\">\n      <div *ngFor=\"let workItem of workItems\">\n        <h1>{{workItem.title}}</h1>\n        <div [innerHTML]=\"workItem.body | toMarkdown \"></div>\n      </div>\n    </div>\n  ",
          styles: []
        }]
      }], function () {
        return [{
          type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
        }];
      }, {
        fileUri: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        connectorUrl: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/environments/environment.ts":
  /*!*****************************************!*\
    !*** ./src/environments/environment.ts ***!
    \*****************************************/

  /*! exports provided: environment */

  /***/
  function srcEnvironmentsEnvironmentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "environment", function () {
      return environment;
    }); // This file can be replaced during build by using the `fileReplacements` array.
    // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
    // The list of file replacements can be found in `angular.json`.


    var environment = {
      production: false,
      daemonHostUrl: 'localhost:9999'
    };
    /*
     * For easier debugging in development mode, you can import the following file
     * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
     *
     * This import should be commented out in production mode because it will have a negative impact
     * on performance if an error is thrown.
     */
    // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

    /***/
  },

  /***/
  "./src/main.ts":
  /*!*********************!*\
    !*** ./src/main.ts ***!
    \*********************/

  /*! no exports provided */

  /***/
  function srcMainTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./environments/environment */
    "./src/environments/environment.ts");
    /* harmony import */


    var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./app/app.module */
    "./src/app/app.module.ts");
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");

    if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
      Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
    }

    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"]).catch(function (err) {
      return console.error(err);
    });
    /***/

  },

  /***/
  0:
  /*!***************************!*\
    !*** multi ./src/main.ts ***!
    \***************************/

  /*! no static exports found */

  /***/
  function _(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(
    /*! /home/dom/WebstormProjects/untitled1/src/main.ts */
    "./src/main.ts");
    /***/
  }
}, [[0, "runtime", "vendor"]]]);
//# sourceMappingURL=main-es5.js.map