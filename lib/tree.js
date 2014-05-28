(function() {
  var Tree,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tree = (function(_super) {
    __extends(Tree, _super);

    function Tree() {
      return Tree.__super__.constructor.apply(this, arguments);
    }

    Tree.prototype.opts = {
      el: null,
      url: null,
      items: null,
      expand: false,
      loading: false,
      onNodeRender: $.noop,
      nodeProperties: {}
    };

    Tree.prototype.properties = {
      label: "label",
      children: "children",
      params: {}
    };

    Tree._tpl = {
      node: "<li class=\"node\">\n  <a href=\"javascript:;\" class=\"toggle fa\"></a>\n  <a href=\"javascript:;\" class=\"label\"><span></span></a>\n</li>"
    };

    Tree.prototype._init = function() {
      if (!this.opts.el) {
        throw "simple tree: option el is required";
        return;
      }
      if (!(this.opts.items || this.opts.url)) {
        throw "simple tree: option items is required";
        return;
      }
      $.extend(this.properties, this.opts.nodeProperties);
      return this._render();
    };

    Tree.prototype._render = function() {
      this.el = $(this.opts.el).addClass("simple-tree").data("tree", this);
      this.tree = $('<ul class="tree">').appendTo(this.el);
      if (this.opts.loading) {
        this.loading = $('<li class="node loading">正在加载...</li>').appendTo(this.tree);
      }
      if (this.opts.url) {
        $.ajax({
          url: this.opts.url,
          type: "get",
          dataType: "json",
          success: (function(_this) {
            return function(result) {
              return _this._createTree(_this.tree, result);
            };
          })(this)
        });
      } else {
        this._createTree(this.tree, this.opts.items);
      }
      this.tree.on("click.simple-tree", ".node .toggle", (function(_this) {
        return function(e) {
          var $list, $node;
          e.preventDefault();
          $list = $(e.currentTarget).siblings("ul");
          $node = $list.parent();
          if ($list != null ? $list.is(":empty") : void 0) {
            $.ajax({
              url: _this.opts.url,
              type: "get",
              dataType: "json",
              data: $.extend({}, $node.data("node").params),
              success: function(result) {
                return _this._createTree($list, result);
              }
            });
          }
          $node.toggleClass("off");
          return $list.toggle().end().toggleClass("fa-caret-down").toggleClass("fa-caret-right");
        };
      })(this));
      return this.tree.on("click.simple-tree", ".node .label", (function(_this) {
        return function(e) {
          var $nodeEl;
          e.preventDefault();
          _this.tree.find(".node.selected").removeClass("selected");
          $nodeEl = $(e.currentTarget).parent("li").addClass("selected");
          return _this.tree.trigger("nodeselected", [$nodeEl, $nodeEl.data("node")]);
        };
      })(this));
    };

    Tree.prototype._createTree = function($list, items) {
      var $nodeEl, $treeEl, expand, item, key, value, _i, _len, _ref, _ref1, _results;
      if ((_ref = this.loading) != null ? _ref.length : void 0) {
        this.loading.remove();
      }
      if ($list === null || items === null) {
        return false;
      }
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        item.params = {};
        _ref1 = this.properties.params;
        for (key in _ref1) {
          value = _ref1[key];
          item.params[key] = item[value];
        }
        $nodeEl = $(Tree._tpl.node).data("node", item);
        $nodeEl.find(".label span").text(item[this.properties.label]);
        $list.append($nodeEl);
        if ($.isFunction(this.opts.onNodeRender)) {
          this.opts.onNodeRender.call(this, $nodeEl, item);
        }
        if (item[this.properties.children]) {
          expand = item.expand != null ? item.expand : this.opts.expand;
          $treeEl = $("<ul/>").appendTo($nodeEl);
          if (expand) {
            $nodeEl.find(".toggle").addClass("fa-caret-down");
            $treeEl.show();
          } else {
            $nodeEl.find(".toggle").addClass("fa-caret-right");
          }
          if ($.isArray(item[this.properties.children])) {
            _results.push(this._createTree($treeEl, item[this.properties.children]));
          } else {
            _results.push(void 0);
          }
        } else {
          $nodeEl.find(".toggle").remove();
          _results.push($nodeEl.addClass("leaf"));
        }
      }
      return _results;
    };

    Tree.prototype.refresh = function(opts) {
      $.extend(this.opts, opts);
      this.destroy();
      return this._render();
    };

    Tree.prototype.destroy = function() {
      this.tree.remove();
      return this.el.removeClass("simple-tree").removeData("tree");
    };

    return Tree;

  })(Widget);

  this.simple || (this.simple = {});

  $.extend(this.simple, {
    tree: function(opts) {
      return new Tree(opts);
    }
  });

}).call(this);
