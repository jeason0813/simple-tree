class Tree extends Widget
  opts:
    el:      null
    content: null


  @_tpl:
    tree: """
      <ul class="tree"></ul>
    """

    folder: """
      <li>
        <a href="javascript:;" class="folder">
          <i class="fa fa-caret-down"></i>
          <i class="fa fa-folder-open-o"></i>
          <span class="name"></span>
        </a>
      </li>
    """

    folderEmpty: """
      <li>
        <a href="javascript:;" class="folder empty">
          <i class="fa fa-folder-o"></i>
          <span class="name"></span>
        </a>
      </li>
    """


  _init: () ->
    if @opts.el is null or @opts.content is null
      throw "[Tree] - 内容不能为空"

    $(".simple-tree").each () ->
      $(@).data("tree").destroy()

    @_render()
    @_bind()
    @tree.data "tree", @


  _render: () ->
    @el   = @opts.el
    @tree = $(Tree._tpl.tree).addClass "simple-tree"

    @_createTree @tree, @opts.content
    @tree.appendTo @el


  _bind: () ->
    @tree.find(".folder").on "click.simple-tree", (e) =>
      e.preventDefault()
      target = $(e.target)
      folder = $(e.currentTarget)
      treeEl = folder.next(".tree")

      if target.is(".fa") and not folder.is(".empty")
        treeEl.toggle()
        folder.find(".fa-caret-down, .fa-caret-right")
          .toggleClass("fa-caret-down").toggleClass("fa-caret-right")
          .end().find(".fa-folder-open-o, .fa-folder-o")
          .toggleClass("fa-folder-open-o").toggleClass("fa-folder-o")

      else
        @tree.find(".folder.selected").removeClass "selected"
        folder.addClass "selected"


  _unbind: () ->
    @tree.find(".folder").off(".simple-popover")


  _createTree: (el, content) ->
    for folder in content
      if folder.children
        folderEl = $(Tree._tpl.folder)
          .find(".name")
          .text(folder.label)
          .end().appendTo(el)

        treeEl = $(Tree._tpl.tree).appendTo folderEl
        @_createTree treeEl, folder.children

      else
        folderEl = $(Tree._tpl.folderEmpty)
          .find(".name")
          .text(folder.label)
          .end().appendTo(el)


  destroy: ->
    @_unbind()
    @tree.remove()


@simple ||= {}

$.extend(@simple, {

  tree: (opts) ->
    return new Tree opts

})
