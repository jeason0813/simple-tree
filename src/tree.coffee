class Tree extends Widget
  opts:
    el:       null
    items:    null
    isFolder: false


  @_tpl:
    node: """
      <li class="node">
        <a href="javascript:;" class="icon fa"></a>
        <a href="javascript:;" class="label"><span></span></a>
      </li>
    """


  _init: () ->
    if @opts.el is null or @opts.items is null
      throw "[Tree] - 内容不能为空"

    @_render()
    @tree.data "tree", @


  _render: () ->
    createTree = (el, items) =>
      for item in items
        nodeEl = $(Tree._tpl.node)
          .find(".label span").text(item.label)
          .end().appendTo(el)

        nodeEl.data("node", item)
        nodeEl.addClass("folder") if @opts.isFolder
        if item.children
          nodeEl.find(".fa").addClass("fa-caret-down")
          treeEl = $('<ul class="tree">').appendTo nodeEl
          createTree treeEl, item.children
        else
          nodeEl.find(".fa").remove()
          nodeEl.addClass("leaf")

    @tree = $('<ul class="tree simple-tree">')
    createTree @tree, @opts.items
    @opts.el.addClass("simple-tree").append(@tree)

    @tree.find(".icon").on "click.simple-tree", (e) =>
      e.preventDefault()
      $(e.currentTarget).siblings(".tree").toggle()
        .end()
        .toggleClass("fa-caret-down")
        .toggleClass("fa-caret-right")
        .parent().toggleClass("off")

    @tree.find(".label").on "click.simple-tree", (e) =>
        e.preventDefault()
        @tree.find(".node.selected").removeClass "selected"
        $(e.currentTarget).parent().addClass "selected"
        @tree.trigger "selected.simple-tree"


  destroy: ->
    @tree.find(".icon").off(".simple-tree")
    @tree.find(".label").off(".simple-tree")
    @tree.remove()


@simple ||= {}

$.extend(@simple, {

  tree: (opts) ->
    return new Tree opts

})
