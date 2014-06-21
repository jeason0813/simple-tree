class Tree extends Widget
  opts:
    el: null
    url: null
    items: null
    expand: false
    onNodeRender: $.noop
    selected: false
    nodeProperties: {}
    placeholder: 'No data...'

  properties:
    id: 'id'
    label: "name"
    children: "children"
    params: {}

  @_tpl:
    list: """
      <ul>
        <li class="node loading">正在加载...</li>
      </ul>
    """
    node: """
      <li class="node">
        <div class="node-content">
          <a href="javascript:;" class="toggle fa"></a>
          <a href="javascript:;" class="label"><span></span></a>
        </div>
      </li>
    """


  _init: () ->
    unless @opts.el
      throw "simple tree: option el is required"
      return

    unless @opts.items or @opts.url
      throw "simple tree: option items or url is required"
      return

    $.extend @properties, @opts.nodeProperties
    @_render()


  _render: () ->
    @el = $(@opts.el).addClass("simple-tree").data("tree", @)
    @tree = $(Tree._tpl.list).addClass('tree').prependTo(@el)

    if @opts.url
      $.ajax
        url: @opts.url
        type: "get"
        dataType: "json"
        success: (result) =>
          if result.length < 1
            @tree.empty().append('<li class="node empty">' + @opts.placeholder + '</li>')
          else
            @_renderTree @tree, result
            @select @opts.selected if @opts.selected
    else if @opts.items.length < 1
      @tree.empty().append('<li class="node empty">' + @opts.placeholder + '</li>')
    else
      @_renderTree @tree, @opts.items
      @select @opts.selected if @opts.selected

    @_bind()


  _renderTree: ($list, items) ->
    return false unless $list and items
    $list.empty()

    for item in items
      item.params = {}
      item.params[key] = item[value] for key, value of @properties.params
      $nodeEl = $(Tree._tpl.node)
        .data("node", item)
        .attr('data-id', item[@properties.id])
      $nodeEl.find(".label span").text(item[@properties.label])

      $list.append $nodeEl
      @opts.onNodeRender.call(@, $nodeEl, item)  if $.isFunction @opts.onNodeRender

      if item[@properties.children]
        expand = if item.expand? then item.expand else @opts.expand
        isArray = $.isArray item[@properties.children]
        $listEl = $(Tree._tpl.list).appendTo $nodeEl
        if expand and isArray
          $nodeEl.addClass('expand')
            .find(".toggle").addClass "fa-caret-down"
        else
          $nodeEl.find(".toggle").addClass "fa-caret-right"

        @_renderTree $listEl, item[@properties.children] if isArray
      else
        $nodeEl.find(".toggle").remove()
        $nodeEl.addClass("leaf")


  _bind: ->
    @tree.on "click.simple-tree", ".node .toggle", (e) =>
      e.preventDefault()
      $toggle = $(e.currentTarget)
      $node = $toggle.closest('.node')
      $list = $node.find('> ul')
      item = $node.data('node')

      $node.toggleClass('expand')
      $toggle.toggleClass('fa-caret-right')
        .toggleClass('fa-caret-down')

      unless $.isArray item[@properties.children]
        $.ajax
          url: @opts.url
          type: "get"
          dataType: "json"
          data: $.extend {}, $node.data("node").params
          success: (result) =>
            item[@properties.children] = result
            @_renderTree $list, result

    @tree.on "click.simple-tree", ".node .label", (e) =>
        e.preventDefault()
        $node = $(e.currentTarget).closest('.node')
        @select $node
        @trigger "nodeselected", [$node, $node.data("node")]


  refresh: (opts) ->
    $.extend @opts, opts
    @destroy()
    @_render()


  select: ($node) ->
    if $node
      $node = @tree.find('.node[data-id=' + $node + ']') unless typeof $node is 'object'
      return unless $node.length > 0

      @tree.find('.node.selected').removeClass('selected')
      $node.addClass('selected')
    else
      $node = @tree.find('.node.selected')

    $node


  destroy: ->
    @tree.remove()
    @el.removeClass("simple-tree")
      .removeData("tree")


@simple ||= {}

$.extend(@simple, {
  tree: (opts) ->
    return new Tree opts
})
