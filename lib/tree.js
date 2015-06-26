(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('simple-tree', ["jquery",
      "simple-module"], function ($, SimpleModule) {
      return (root.returnExportsGlobal = factory($, SimpleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),
      require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['tree'] = factory(jQuery,
      SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Tree, tree,
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
    onNodeRender: $.noop,
    selected: false,
    nodeProperties: {},
    placeholder: 'No data...'
  };

  Tree.prototype.properties = {
    id: 'id',
    label: "name",
    children: "children",
    params: {}
  };

  Tree.i18n = {
    "zh-CN": {
      loading: "正在加载"
    },
    "en": {
      loading: "loading"
    }
  };

  Tree._tpl = {
    list: "<ul>\n  <li class=\"node loading\">" + (Tree.prototype._t('loading')) + "...</li>\n</ul>",
    node: "<li class=\"node\">\n  <div class=\"node-content\">\n    <a href=\"javascript:;\" class=\"toggle\"></a>\n    <a href=\"javascript:;\" class=\"label\"><span></span></a>\n  </div>\n</li>"
  };

  Tree.prototype._init = function() {
    if (!this.opts.el) {
      throw "simple tree: option el is required";
      return;
    }
    if (!(this.opts.items || this.opts.url)) {
      throw "simple tree: option items or url is required";
      return;
    }
    $.extend(this.properties, this.opts.nodeProperties);
    return this._render();
  };

  Tree.prototype._render = function() {
    this.el = $(this.opts.el).addClass("simple-tree").data("tree", this);
    this.tree = $(Tree._tpl.list).addClass('tree').prependTo(this.el);
    if (this.opts.url) {
      $.ajax({
        url: this.opts.url,
        type: "get",
        dataType: "json",
        success: (function(_this) {
          return function(result) {
            if (result.length < 1) {
              return _this.tree.empty().append('<li class="node empty">' + _this.opts.placeholder + '</li>');
            } else {
              _this._renderTree(_this.tree, result);
              if (_this.opts.selected) {
                return _this.select(_this.opts.selected);
              }
            }
          };
        })(this)
      });
    } else if (this.opts.items.length < 1) {
      this.tree.empty().append('<li class="node empty">' + this.opts.placeholder + '</li>');
    } else {
      this._renderTree(this.tree, this.opts.items);
      if (this.opts.selected) {
        this.select(this.opts.selected);
      }
    }
    return this._bind();
  };

  Tree.prototype._renderTree = function($list, items) {
    var $listEl, $nodeEl, expand, isArray, item, key, value, _i, _len, _ref, _results;
    if (!($list && items)) {
      return false;
    }
    $list.empty();
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      item.params = {};
      _ref = this.properties.params;
      for (key in _ref) {
        value = _ref[key];
        item.params[key] = item[value];
      }
      $nodeEl = $(Tree._tpl.node).data("node", item).attr('data-id', item[this.properties.id]);
      $nodeEl.find(".label span").text(item[this.properties.label]);
      $list.append($nodeEl);
      if ($.isFunction(this.opts.onNodeRender)) {
        this.opts.onNodeRender.call(this, $nodeEl, item);
      }
      if (item[this.properties.children]) {
        expand = item.expand != null ? item.expand : this.opts.expand;
        isArray = $.isArray(item[this.properties.children]);
        $listEl = $(Tree._tpl.list).appendTo($nodeEl);
        if (expand && isArray) {
          $nodeEl.addClass('expand').find(".toggle").addClass("icon-caret-down");
        } else {
          $nodeEl.find(".toggle").addClass("icon-caret-right");
        }
        if (isArray) {
          _results.push(this._renderTree($listEl, item[this.properties.children]));
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

  Tree.prototype._bind = function() {
    this.tree.on("click.simple-tree", ".node .toggle", (function(_this) {
      return function(e) {
        var $list, $node, $toggle, item;
        e.preventDefault();
        $toggle = $(e.currentTarget);
        $node = $toggle.closest('.node');
        $list = $node.find('> ul');
        item = $node.data('node');
        $node.toggleClass('expand');
        $toggle.toggleClass('icon-caret-right').toggleClass('icon-caret-down');
        if (!$.isArray(item[_this.properties.children])) {
          return $.ajax({
            url: _this.opts.url,
            type: "get",
            dataType: "json",
            data: $.extend({}, $node.data("node").params),
            success: function(result) {
              item[_this.properties.children] = result;
              return _this._renderTree($list, result);
            }
          });
        }
      };
    })(this));
    return this.tree.on("click.simple-tree", ".node .label", (function(_this) {
      return function(e) {
        var $node;
        e.preventDefault();
        $node = $(e.currentTarget).closest('.node');
        _this.select($node);
        return _this.trigger("nodeselected", [$node, $node.data("node")]);
      };
    })(this));
  };

  Tree.prototype.refresh = function(opts) {
    $.extend(this.opts, opts);
    this.destroy();
    return this._render();
  };

  Tree.prototype.select = function($node) {
    if ($node) {
      if (typeof $node !== 'object') {
        $node = this.tree.find('.node[data-id=' + $node + ']');
      }
      if (!($node.length > 0)) {
        return;
      }
      this.tree.find('.node.selected').removeClass('selected');
      $node.addClass('selected');
    } else {
      $node = this.tree.find('.node.selected');
    }
    return $node;
  };

  Tree.prototype.destroy = function() {
    this.tree.remove();
    return this.el.removeClass("simple-tree").removeData("tree");
  };

  return Tree;

})(SimpleModule);

tree = function(opts) {
  return new Tree(opts);
};


return tree;


}));

