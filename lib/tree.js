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
      url: null,
      expand: false,
      onNodeRender: $.noop
    };

    Tree._tpl = {
      node: "<li class=\"node\">\n  <a href=\"javascript:;\" class=\"toggle fa\"></a>\n  <a href=\"javascript:;\" class=\"name\"><span></span></a>\n</li>"
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
      return this._render();
    };

    Tree.prototype._render = function() {
      this.el = $(this.opts.el).addClass("simple-tree").data("tree", this);
      this.tree = $('<ul class="tree">').appendTo(this.el);
      if (this.opts.url) {
        $.ajax({
          url: this.opts.url,
          type: "get",
          dataType: "json",
          success: (function(_this) {
            return function(result) {
              return _this.createTree(_this.tree, result);
            };
          })(this)
        });
      } else {
        this.createTree(this.tree, this.opts.items);
      }
      this.tree.on("click.simple-tree", ".node .toggle", (function(_this) {
        return function(e) {
          e.preventDefault();
          return $(e.currentTarget).siblings("ul").toggle().end().toggleClass("fa-caret-down").toggleClass("fa-caret-right").parent(".node").toggleClass("off");
        };
      })(this));
      return this.tree.on("click.simple-tree", ".node .name", (function(_this) {
        return function(e) {
          var $nodeEl;
          e.preventDefault();
          _this.tree.find(".node.selected").removeClass("selected");
          $nodeEl = $(e.currentTarget).parent("li").addClass("selected");
          return _this.tree.trigger("nodeselected", [$nodeEl, $nodeEl.data('node')]);
        };
      })(this));
    };

    Tree.prototype.createTree = function($list, items) {
      var $nodeEl, $treeEl, expand, item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        $nodeEl = $(Tree._tpl.node).data("node", item);
        $nodeEl.find(".name span").text(item.name);
        $list.append($nodeEl);
        if ($.isFunction(this.opts.onNodeRender)) {
          this.opts.onNodeRender.call(this, $nodeEl, item);
        }
        if (item.children) {
          expand = item.expand != null ? item.expand : this.opts.expand;
          $treeEl = $('<ul/>').appendTo($nodeEl);
          if (expand) {
            $nodeEl.find(".toggle").addClass("fa-caret-down");
            $treeEl.show();
          } else {
            $nodeEl.find(".toggle").addClass("fa-caret-right");
          }
          if ($.isArray(item.children)) {
            _results.push(this.createTree($treeEl, item.children));
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
