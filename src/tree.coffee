class Tree extends Widget
  opts:
    el: null
    items: null
    expand: false
    onNodeRender: $.noop


  @_tpl:
    node: """
      <li class="node">
        <a href="javascript:;" class="icon fa"></a>
        <a href="javascript:;" class="label"><span></span></a>
      </li>
    """


  _init: () ->
    unless @opts.el
      throw "simple tree: option el is required"
      return

    unless @opts.items
      throw "simple tree: option items is required"
      return

    @_render()


  _render: () ->
    createTree = ($list, items) =>
      for item in items
        $nodeEl = $(Tree._tpl.node).data("node", item)
        $nodeEl.find(".label span").text(item.label)

        $list.append $nodeEl
        @opts.onNodeRender.call(@, $nodeEl, item) if $.isFunction @opts.onNodeRender

        if item.children
          expand = if item.expand? then item.expand else @opts.expand
          $treeEl = $('<ul/>').appendTo $nodeEl
          if expand
            $nodeEl.find(".icon").addClass "fa-caret-down"
            $treeEl.show()
          else
            $nodeEl.find(".icon").addClass "fa-caret-right"
          createTree $treeEl, item.children
        else
          $nodeEl.find(".icon").remove()
          $nodeEl.addClass("leaf")

    @el = $(@opts.el).addClass("simple-tree").data("tree", @)
    @tree = $('<ul class="tree">').appendTo(@el)
    createTree @tree, @opts.items

    @tree.on "click.simple-tree", ".node .icon", (e) =>
      e.preventDefault()
      $(e.currentTarget).siblings("ul").toggle()
        .end()
        .toggleClass("fa-caret-down")
        .toggleClass("fa-caret-right")
        .parent(".node").toggleClass("off")

    @tree.on "click.simple-tree", ".node .label", (e) =>
        e.preventDefault()
        @tree.find(".node.selected").removeClass "selected"
        $nodeEl = $(e.currentTarget).parent("li").addClass "selected"
        @trigger "nodeselected", [$nodeEl, $nodeEl.data('node')]


  destroy: ->
    @tree.remove()
    @el.removeClass("simple-tree")
      .removeData("tree")


@simple ||= {}

$.extend(@simple, {

  tree: (opts) ->
    return new Tree opts

})
