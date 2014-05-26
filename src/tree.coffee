class Tree extends Widget
  opts:
    el: null
    items: null
    url: null
    expand: false
    onNodeRender: $.noop


  @_tpl:
    node: """
      <li class="node">
        <a href="javascript:;" class="toggle fa"></a>
        <a href="javascript:;" class="name"><span></span></a>
      </li>
    """


  _init: () ->
    unless @opts.el
      throw "simple tree: option el is required"
      return

    unless @opts.items or @opts.url
      throw "simple tree: option items is required"
      return

    @_render()


  _render: () ->
    @el = $(@opts.el).addClass("simple-tree").data("tree", @)
    @tree = $('<ul class="tree">').appendTo(@el)

    if @opts.url
      $.ajax
        url: @opts.url
        type: "get"
        dataType: "json"
        success: (result) =>
          @createTree @tree, result
    else
      @createTree @tree, @opts.items

    @tree.on "click.simple-tree", ".node .toggle", (e) =>
      e.preventDefault()
      $(e.currentTarget).siblings("ul").toggle()
        .end()
        .toggleClass("fa-caret-down")
        .toggleClass("fa-caret-right")
        .parent(".node").toggleClass("off")

    @tree.on "click.simple-tree", ".node .name", (e) =>
        e.preventDefault()
        @tree.find(".node.selected").removeClass "selected"
        $nodeEl = $(e.currentTarget).parent("li").addClass "selected"
        @tree.trigger "nodeselected", [$nodeEl, $nodeEl.data('node')]

  createTree: ($list, items) ->
    for item in items
      $nodeEl = $(Tree._tpl.node).data("node", item)
      $nodeEl.find(".name span").text(item.name)

      $list.append $nodeEl
      @opts.onNodeRender.call(@, $nodeEl, item) if $.isFunction @opts.onNodeRender

      if item.children
        expand = if item.expand? then item.expand else @opts.expand
        $treeEl = $('<ul/>').appendTo $nodeEl
        if expand
          $nodeEl.find(".toggle").addClass "fa-caret-down"
          $treeEl.show()
        else
          $nodeEl.find(".toggle").addClass "fa-caret-right"
        @createTree $treeEl, item.children if $.isArray item.children
      else
        $nodeEl.find(".toggle").remove()
        $nodeEl.addClass("leaf")

  destroy: ->
    @tree.remove()
    @el.removeClass("simple-tree")
      .removeData("tree")


@simple ||= {}

$.extend(@simple, {

  tree: (opts) ->
    return new Tree opts

})
