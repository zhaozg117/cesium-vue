<script>
export default {
  name: "cMenuItem",
  props: {
    route: Object,
    prePath: {
      type: String,
      default: "/",
    },
  },
  functional: true,
  render(h, { props }) {
    const r = props.route;
    const { hiddenInMenu } = r?.meta ?? {};

    if (hiddenInMenu) return undefined;

    // helpers
    const getMenuTitle = (r) => r?.meta?.title ?? r.name;
    const getMenuPath = (path, prePath = props.prePath) =>
      path.startsWith("/") ? path : prePath + path;

    // 无子菜单
    if (!r?.children?.length) {
      return h(
        "el-menu-item",
        {
          props: { index: getMenuPath(r.path) },
        },
        getMenuTitle(r)
      );
    }

    const children = r?.children;
    const prePath = getMenuPath(r.path) + "/";

    if (children && children.length > 1) {
      // 嵌套菜单
      return h(
        "el-submenu",
        {
          props: { index: getMenuPath(r.path) },
        },
        [
          h("template", { slot: "title" }, getMenuTitle(r)),
          ...children.map((rc) =>
            h("cMenuItem", {
              props: { route: rc, prePath },
            })
          ),
        ]
      );
    } else if (children && children.length === 1) {
      // 提升孤儿节点到上级菜单
      const child = children[0];
      return h(
        "el-menu-item",
        {
          props: {
            index: r.redirect ?? getMenuPath(child.path, prePath),
          },
        },
        getMenuTitle(r) ?? getMenuTitle(child)
      );
    }
  },
};
</script>
