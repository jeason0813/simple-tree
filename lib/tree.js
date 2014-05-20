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
      content: null
    };

    Tree._tpl = {
      tree: "<ul class=\"tree\"></ul>",
      folder: "<li>\n  <a href=\"javascript:;\" class=\"folder\">\n    <i class=\"fa fa-caret-down\"></i>\n    <i class=\"fa fa-folder-open-o\"></i>\n    <span class=\"name\"></span>\n  </a>\n</li>",
      folderEmpty: "<li>\n  <a href=\"javascript:;\" class=\"folder empty\">\n    <i class=\"fa fa-folder-o\"></i>\n    <span class=\"name\"></span>\n  </a>\n</li>"
    };

    Tree.prototype._init = function() {
      if (this.opts.el === null || this.opts.content === null) {
        throw "[Tree] - 内容不能为空";
      }
      $(".simple-tree").each(function() {
        return $(this).data("tree").destroy();
      });
      this._render();
      this._bind();
      return this.tree.data("tree", this);
    };

    Tree.prototype._render = function() {
      this.el = this.opts.el;
      this.tree = $(Tree._tpl.tree).addClass("simple-tree");
      this._createTree(this.tree, this.opts.content);
      return this.tree.appendTo(this.el);
    };

    Tree.prototype._bind = function() {
      return this.tree.find(".folder").on("click.simple-tree", (function(_this) {
        return function(e) {
          var folder, target, treeEl;
          e.preventDefault();
          target = $(e.target);
          folder = $(e.currentTarget);
          treeEl = folder.next(".tree");
          if (target.is(".fa") && treeEl.length) {
            treeEl.toggle();
            return folder.find(".fa:first").toggleClass("fa-caret-down").toggleClass("fa-caret-right").end().find(".fa:last").toggleClass("fa-folder-open-o").toggleClass("fa-folder-o");
          } else {
            _this.tree.find(".folder.selected").removeClass("selected");
            return folder.addClass("selected");
          }
        };
      })(this));
    };

    Tree.prototype._unbind = function() {
      return this.tree.find(".folder").off(".simple-tree");
    };

    Tree.prototype._createTree = function(el, content) {
      var folder, folderEl, treeEl, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = content.length; _i < _len; _i++) {
        folder = content[_i];
        if (folder.children) {
          folderEl = $(Tree._tpl.folder).find(".name").text(folder.label).end().appendTo(el);
          treeEl = $(Tree._tpl.tree).appendTo(folderEl);
          _results.push(this._createTree(treeEl, folder.children));
        } else {
          _results.push(folderEl = $(Tree._tpl.folderEmpty).find(".name").text(folder.label).end().appendTo(el));
        }
      }
      return _results;
    };

    Tree.prototype.destroy = function() {
      this._unbind();
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
