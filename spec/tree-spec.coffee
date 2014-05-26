treeEl = $("<div id='tree'></div>")
data = [
  {
    label: "一级目录1号"
    children: [
      {
        label: "二级目录1号"
      }
      {
        label: "二级目录2号"
        children: [label: "三级目录1号"]
      }
    ]
  }
  {
    label: "一级目录2号"
  }
]


beforeEach ->
  treeEl.appendTo("body")


afterEach ->
  $(".simple-tree").each () ->
    $(@).data("tree").destroy()
  treeEl.remove()



describe "simple tree", ->
  it "shuould display", ->
    simple.tree
      el: "#tree"
      items: data
    expect($(".simple-tree").length).toBe(1)


  it "should hide nodes when use the default config", () ->
    simple.tree
      el: "#tree"
      items: data
    expect($(".simple-tree ul:not(.tree)").is(":hidden")).toEqual(true)


  it "should show nodes when expand is true", () ->
    simple.tree
      el: "#tree"
      items: data
      expand: true
    expect($(".simple-tree ul:not(.tree)").is(":visible")).toEqual(true)


  it "should show the secified node when item's expand is true", () ->
    simple.tree
      el: "#tree"
      items: [{
        label: "一级目录1号"
        expand: true
        children: [{
          label: "二级目录1号"
        }]
      }]
    expect($(".simple-tree ul:not(.tree)").is(":visible")).toEqual(true)


  it "should show the secified node when item's expand is true and expand is false", () ->
    simple.tree
      el: "#tree"
      expand: false
      items: [{
        label: "一级目录1号"
        expand: true
        children: [{
          label: "二级目录1号"
        }]
      }]
    expect($(".simple-tree ul:not(.tree)").is(":visible")).toEqual(true)


   it "should show nodes when click the button", () ->
    simple.tree
      el: "#tree"
      items: data
    $(".simple-tree .tree .toggle:first").click()
    expect($(".simple-tree .tree ul:first").is(":visible")).toEqual(true)

  it "shuld destroy when call destroy()", ->
    simple.tree
      el: "#tree"
      items: data
    treeEl.data("tree").destroy()
    expect($(".simple-tree").length).toBe(0)

