simple-tree
===========

一个基于 [Simple Module](https://github.com/mycolorway/simple-module) 的树组件。

![Demo Png](https://raw.githubusercontent.com/mycolorway/simple-tree/master/demo.png)

### 一、如何使用

**1. 下载并引用**

通过 `bower install` 下载依赖的第三方库，然后在页面中引入这些文件：

```html
<link rel="stylesheet" type="text/css" href="[style path]/font-awesome.css" />
<link rel="stylesheet" type="text/css" href="[style path]/tree.css" />

<script type="text/javascript" src="[script path]/jquery.min.js"></script>
<script type="text/javascript" src="[script path]/module.js"></script>
<!-- simple-util https://github.com/mycolorway/simple-util -->
<script type="text/javascript" src="[script path]/util.js"></script>
<script type="text/javascript" src="[script path]/tree.js"></script>
```

**2. 初始化配置**

在使用 simple-tree 的 HTML 页面里应该有一个对应的 select 元素，例如：

```html
<select></select>
```

我们需要在这个页面的脚本里初始化 simple-select：

```javascript
simple.tree({
    el: null,                   // * 必须（页面上的元素）
    url: null,                  // 获取节点的接口地址
    items: null,                // 节点（url items 必须有一个）
    expand: false,              // 是否展开树
    onNodeRender: $.noop,       // 渲染每个节点后触发的函数
    selected: false,            // 初始化时是否选中某个节点
    nodeProperties: {},         // 节点上的元素
    placeholder: 'No data...'   // 子节点为空时显示的内容
});
```

### 二、方法和事件

simple-tree 初始化之后，tree 实例会暴露一些公共方法供调用：

```javascript
// 初始化 simple-tree
var tree = simple.tree({
  el: $('#tree')
});

// 调用 refresh 方法根据 opts 参数重新渲染树
select.refresh(opts);
```

**1. 公共方法**

**refresh(opts)**

根据 opts 参数重新渲染树。

**select(node)**

选择节点并返回该节点（返回 jQuery 对象），可传节点的 `data-id` 或 jQuery 对象。没有参数时直接返回当前选中节点的 jQuery 对象。

**destroy()**

恢复到初始化之前的状态。

**2. 事件**

**nodeselected**

触发条件：选择某个节点。返回该节点的 jQuery 对象和节点 `data("node")` 值。
