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
      items: null,
      expand: false,
      onNodeRender: $.noop
    };

    Tree._tpl = {
      node: "<li class=\"node\">\n  <a href=\"javascript:;\" class=\"icon fa\"></a>\n  <a href=\"javascript:;\" class=\"label\"><span></span></a>\n</li>"
    };

    Tree.prototype._init = function() {
      if (!this.opts.el) {
        throw "simple tree: option el is required";
        return;
      }
      if (!this.opts.items) {
        throw "simple tree: option items is required";
        return;
      }
      return this._render();
    };

    Tree.prototype._render = function() {
      var createTree;
      createTree = (function(_this) {
        return function($list, items) {
          var $nodeEl, $treeEl, expand, item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            $nodeEl = $(Tree._tpl.node).data("node", item);
            $nodeEl.find(".label span").text(item.label);
            $list.append($nodeEl);
            if ($.isFunction(_this.opts.onNodeRender)) {
              _this.opts.onNodeRender.call(_this, $nodeEl, item);
            }
            if (item.children) {
              expand = item.expand != null ? item.expand : _this.opts.expand;
              $treeEl = $('<ul/>').appendTo($nodeEl);
              if (expand) {
                $nodeEl.find(".icon").addClass("fa-caret-down");
                $treeEl.show();
              } else {
                $nodeEl.find(".icon").addClass("fa-caret-right");
              }
              _results.push(createTree($treeEl, item.children));
            } else {
              $nodeEl.find(".icon").remove();
              _results.push($nodeEl.addClass("leaf"));
            }
          }
          return _results;
        };
      })(this);
      this.el = $(this.opts.el).addClass("simple-tree").data("tree", this);
      this.tree = $('<ul class="tree">').appendTo(this.el);
      createTree(this.tree, this.opts.items);
      this.tree.on("click.simple-tree", ".node .icon", (function(_this) {
        return function(e) {
          e.preventDefault();
          return $(e.currentTarget).siblings("ul").toggle().end().toggleClass("fa-caret-down").toggleClass("fa-caret-right").parent(".node").toggleClass("off");
        };
      })(this));
      return this.tree.on("click.simple-tree", ".node .label", (function(_this) {
        return function(e) {
          var $nodeEl;
          e.preventDefault();
          _this.tree.find(".node.selected").removeClass("selected");
          $nodeEl = $(e.currentTarget).parent("li").addClass("selected");
          return _this.trigger("nodeselected", [$nodeEl, $nodeEl.data('node')]);
        };
      })(this));
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
