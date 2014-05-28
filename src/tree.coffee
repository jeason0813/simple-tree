class Tree extends Widget
  opts:
    el: null
    url: null
    items: null
    expand: false
    loading: false
    onNodeRender: $.noop
    nodeProperties: {}

  properties:
    label: "label"
    children: "children"
    params: {}

  @_tpl:
    node: """
      <li class="node">
        <a href="javascript:;" class="toggle fa"></a>
        <a href="javascript:;" class="label"><span></span></a>
      </li>
    """


  _init: () ->
    unless @opts.el
      throw "simple tree: option el is required"
      return

    unless @opts.items or @opts.url
      throw "simple tree: option items is required"
      return

    $.extend @properties, @opts.nodeProperties
    @_render()


  _render: () ->
    @el = $(@opts.el).addClass("simple-tree").data("tree", @)
    @tree = $('<ul class="tree">').appendTo(@el)
    @loading = $('<li class="node loading">正在加载...</li>').appendTo(@tree)  if @opts.loading

    if @opts.url
      $.ajax
        url: @opts.url
        type: "get"
        dataType: "json"
        success: (result) =>
          @_createTree @tree, result
    else
      @_createTree @tree, @opts.items

    @tree.on "click.simple-tree", ".node .toggle", (e) =>
      e.preventDefault()
      $list = $(e.currentTarget).siblings("ul")
      $node = $list.parent()

      if $list?.is ":empty"
        $.ajax
          url: @opts.url
          type: "get"
          dataType: "json"
          data: $.extend {}, $node.data("node").params
          success: (result) =>
            @_createTree $list, result

      $node.toggleClass("off")
      $list.toggle()
        .end()
        .toggleClass("fa-caret-down")
        .toggleClass("fa-caret-right")

    @tree.on "click.simple-tree", ".node .label", (e) =>
        e.preventDefault()
        @tree.find(".node.selected").removeClass "selected"
        $nodeEl = $(e.currentTarget).parent("li").addClass "selected"
        @tree.trigger "nodeselected", [$nodeEl, $nodeEl.data("node")]


  _createTree: ($list, items) ->
    @loading.remove()  if @loading?.length
    return false  if $list is null or items is null

    for item in items
      item.params = {}
      item.params[key] = item[value]  for key, value of @properties.params
      $nodeEl = $(Tree._tpl.node).data("node", item)
      $nodeEl.find(".label span").text(item[@properties.label])

      $list.append $nodeEl
      @opts.onNodeRender.call(@, $nodeEl, item)  if $.isFunction @opts.onNodeRender

      if item[@properties.children]
        expand = if item.expand? then item.expand else @opts.expand
        $treeEl = $("<ul/>").appendTo $nodeEl
        if expand
          $nodeEl.find(".toggle").addClass "fa-caret-down"
          $treeEl.show()
        else
          $nodeEl.find(".toggle").addClass "fa-caret-right"
        @_createTree $treeEl, item[@properties.children]  if $.isArray item[@properties.children]
      else
        $nodeEl.find(".toggle").remove()
        $nodeEl.addClass("leaf")


  refresh: (opts) ->
    $.extend @opts, opts
    @destroy()
    @_render()


  destroy: ->
    @tree.remove()
    @el.removeClass("simple-tree")
      .removeData("tree")


@simple ||= {}

$.extend(@simple, {

  tree: (opts) ->
    return new Tree opts

})
