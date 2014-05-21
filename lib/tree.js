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
      isFolder: false
    };

    Tree._tpl = {
      leaf: "<li class=\"leaf\">\n  <a href=\"javascript:;\" class=\"icon fa\"></a>\n  <a href=\"javascript:;\" class=\"label\"></a>\n</li>"
    };

    Tree.prototype._init = function() {
      if (this.opts.el === null || this.opts.items === null) {
        throw "[Tree] - 内容不能为空";
      }
      this._render();
      return this.tree.data("tree", this);
    };

    Tree.prototype._render = function() {
      var createTree;
      createTree = (function(_this) {
        return function(el, items) {
          var leaf, leafEl, treeEl, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            leaf = items[_i];
            leafEl = $(Tree._tpl.leaf).find(".label").text(leaf.label).end().appendTo(el);
            leafEl.data("leaf", leaf);
            if (_this.opts.isFolder) {
              leafEl.addClass("folder");
            }
            if (leaf.children) {
              leafEl.find(".fa").addClass("fa-caret-down");
              treeEl = $('<ul class="tree">').appendTo(leafEl);
              _results.push(createTree(treeEl, leaf.children));
            } else {
              leafEl.find(".fa").remove();
              _results.push(leafEl.addClass("empty"));
            }
          }
          return _results;
        };
      })(this);
      this.tree = $('<ul class="tree simple-tree">');
      createTree(this.tree, this.opts.items);
      this.tree.appendTo(this.opts.el);
      this.tree.find(".icon").on("click.simple-tree", (function(_this) {
        return function(e) {
          e.preventDefault();
          return $(e.currentTarget).siblings(".tree").toggle().end().toggleClass("fa-caret-down").toggleClass("fa-caret-right").parent().toggleClass("off");
        };
      })(this));
      return this.tree.find(".label").on("click.simple-tree", (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.tree.find(".leaf.selected").removeClass("selected");
          $(e.currentTarget).parent().addClass("selected");
          return _this.tree.trigger("selected.simple-tree");
        };
      })(this));
    };

    Tree.prototype.destroy = function() {
      this.tree.find(".icon").off(".simple-tree");
      this.tree.find(".label").off(".simple-tree");
      return this.tree.remove();
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
