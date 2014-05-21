class Tree extends Widget
  opts:
    el:       null
    items:    null
    isFolder: false


  @_tpl:
    leaf: """
      <li class="leaf">
        <a href="javascript:;" class="icon fa"></a>
        <a href="javascript:;" class="label"></a>
      </li>
    """


  _init: () ->
    if @opts.el is null or @opts.items is null
      throw "[Tree] - 内容不能为空"

    @_render()
    @tree.data "tree", @


  _render: () ->
    createTree = (el, items) =>
      for leaf in items
        leafEl = $(Tree._tpl.leaf)
          .find(".label").text(leaf.label)
          .end().appendTo(el)

        leafEl.data("leaf", leaf)
        leafEl.addClass("folder") if @opts.isFolder
        if leaf.children
          leafEl.find(".fa").addClass("fa-caret-down")
          treeEl = $('<ul class="tree">').appendTo leafEl
          createTree treeEl, leaf.children
        else
          leafEl.find(".fa").remove()
          leafEl.addClass("empty")

    @tree = $('<ul class="tree simple-tree">')
    createTree @tree, @opts.items
    @tree.appendTo @opts.el

    @tree.find(".icon").on "click.simple-tree", (e) =>
      e.preventDefault()
      $(e.currentTarget).siblings(".tree").toggle()
        .end().toggleClass("fa-caret-down")
        .toggleClass("fa-caret-right")
        .parent().toggleClass("off")

    @tree.find(".label").on "click.simple-tree", (e) =>
        e.preventDefault()
        @tree.find(".leaf.selected").removeClass "selected"
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
