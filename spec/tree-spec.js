(function() {
  var data, treeEl;

  treeEl = $("<div id='tree'></div>");

  data = [
    {
      label: "一级目录1号",
      children: [
        {
          label: "二级目录1号"
        }, {
          label: "二级目录2号",
          children: [
            {
              label: "三级目录1号"
            }
          ]
        }
      ]
    }, {
      label: "一级目录2号"
    }
  ];

  beforeEach(function() {
    return treeEl.appendTo("body");
  });

  afterEach(function() {
    $(".simple-tree").each(function() {
      return $(this).data("tree").destroy();
    });
    return treeEl.remove();
  });

  describe("simple tree", function() {
    it("shuould display", function() {
      simple.tree({
        el: "#tree",
        items: data
      });
      return expect($(".simple-tree").length).toBe(1);
    });
    it("should hide nodes when use the default config", function() {
      simple.tree({
        el: "#tree",
        items: data
      });
      return expect($(".simple-tree ul:not(.tree)").is(":hidden")).toEqual(true);
    });
    it("should show nodes when expand is true", function() {
      simple.tree({
        el: "#tree",
        items: data,
        expand: true
      });
      return expect($(".simple-tree ul:not(.tree)").is(":visible")).toEqual(true);
    });
    it("should show the secified node when item's expand is true", function() {
      simple.tree({
        el: "#tree",
        items: [
          {
            label: "一级目录1号",
            expand: true,
            children: [
              {
                label: "二级目录1号"
              }
            ]
          }
        ]
      });
      return expect($(".simple-tree ul:not(.tree)").is(":visible")).toEqual(true);
    });
    it("should show the secified node when item's expand is true and expand is false", function() {
      simple.tree({
        el: "#tree",
        expand: false,
        items: [
          {
            label: "一级目录1号",
            expand: true,
            children: [
              {
                label: "二级目录1号"
              }
            ]
          }
        ]
      });
      return expect($(".simple-tree ul:not(.tree)").is(":visible")).toEqual(true);
    });
    it("should show nodes when click the button", function() {
      simple.tree({
        el: "#tree",
        items: data
      });
      $(".simple-tree .tree .icon:first").click();
      return expect($(".simple-tree .tree ul:first").is(":visible")).toEqual(true);
    });
    return it("shuld destroy when call destroy()", function() {
      simple.tree({
        el: "#tree",
        items: data
      });
      treeEl.data("tree").destroy();
      return expect($(".simple-tree").length).toBe(0);
    });
  });

}).call(this);
